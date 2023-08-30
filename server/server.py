from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np 
import ast
import requests
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

# Constants and Configurations
API_KEY = '9e025a764b43c28d9d3092f8833f92c8'
PERCENTILE = 0.90

# Load Data
top_movies_list = pd.read_pickle('top_movies.pkl').head(25)
genre_based_movie_data = pd.read_pickle('gen_md_movies.pkl')
content_based_movie_data = pd.read_pickle('content_based_md.pkl')
similar_user_movies = pd.read_pickle('similar_user_movies.pkl')
user_similarity = pd.read_pickle('user_similarity.pkl')

# Convert DataFrame to a list of dictionaries
top_movies_list_dict = top_movies_list.to_dict(orient='records')
content_based_movie_data_dict = content_based_movie_data.to_dict(orient='records')

# Utility methods
def fetch_poster(movie_id):
    response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={API_KEY}')
    data = response.json()
    poster_path = data.get('poster_path')
    if(poster_path):
        return f"https://image.tmdb.org/t/p/w500{data['poster_path']}"
    else:
        return "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"

def build_recommendation(genres, percentile=0.90, popularity_metric='popularity'):
    # Filter the DataFrame to include movies from the specified genres
    df = genre_based_movie_data[genre_based_movie_data['genre'].isin(genres)]
    
    # Calculate vote_counts, vote_averages, C, and m
    vote_counts = df[df['vote_count'].notnull()]['vote_count'].astype('int')
    vote_averages = df[df['vote_average'].notnull()]['vote_average'].astype('int')
    C = vote_averages.mean()
    m = vote_counts.quantile(percentile)
    
    # Filter qualified movies based on vote count and average criteria
    qualified = df[(df['vote_count'] >= m) & (df['vote_count'].notnull()) & (df['vote_average'].notnull())][['id','title', 'year', 'vote_count', 'vote_average', 'popularity']]
    qualified['vote_count'] = qualified['vote_count'].astype('int')
    qualified['vote_average'] = qualified['vote_average'].astype('int')
    
    # Calculate weighted rating (WR)
    qualified['wr'] = qualified.apply(lambda x: (x['vote_count']/(x['vote_count']+m) * x['vote_average']) + (m/(m+x['vote_count']) * C), axis=1)
    
    qualified = qualified.drop_duplicates(subset=['id'])
    # Sort by weighted rating
    qualified = qualified.sort_values(['wr', popularity_metric], ascending=[False, False]).head(10)
    qualified = qualified.to_dict(orient='records')
    return qualified



def get_content_based_recommendations(title):
    content_based_movie_data = pd.read_pickle('content_based_md.pkl')
    # Create a TF-IDF vectorizer
    tf = TfidfVectorizer(analyzer='word',ngram_range=(1, 2),min_df=1, stop_words='english')
    tfidf_matrix = tf.fit_transform(content_based_movie_data['description'])
    # # Compute cosine similarity between movies based on TF-IDF
    cosine_sim_desc = linear_kernel(tfidf_matrix, tfidf_matrix)
    count = CountVectorizer(analyzer='word',ngram_range=(1, 2),min_df=1, stop_words='english')
    count_matrix = count.fit_transform(content_based_movie_data['soup'])
    cosine_sim_desc = linear_kernel(tfidf_matrix, tfidf_matrix)
    cosine_sim_meta = cosine_similarity(count_matrix, count_matrix)
    content_based_movie_data = content_based_movie_data.reset_index()
    titles = content_based_movie_data['title']
    indices = pd.Series(content_based_movie_data.index, index=content_based_movie_data['title'])
    idx = indices[title]
    desc_sim_scores = cosine_sim_desc[idx]  # Similarity scores from description
    meta_sim_scores = cosine_sim_meta[idx]  # Similarity scores from metadata
    
    # Compute the combined similarity score using a weighted average
    sim_scores = (desc_sim_scores + meta_sim_scores) / 2
    
    # Create a list of tuples (index, combined similarity score)
    movie_scores = list(enumerate(sim_scores))
    
    # # Sort the movies based on the combined similarity score
    sorted_scores = sorted(movie_scores, key=lambda x: x[1], reverse=True)
    
    # # Get the top similar movies
    similar_movies = sorted_scores[1:26]  # Exclude the movie itself
    movie_indices = [i[0] for i in similar_movies]
    
    movies = content_based_movie_data.iloc[movie_indices][['id','title', 'vote_count', 'vote_average', 'year']]
    vote_counts = movies[movies['vote_count'].notnull()]['vote_count'].astype('int')
    vote_averages = movies[movies['vote_average'].notnull()]['vote_average'].astype('int')
    C = vote_averages.mean()
    m = vote_counts.quantile(0.50)
    qualified = movies[(movies['vote_count'] >= m) & (movies['vote_count'].notnull()) & (movies['vote_average'].notnull())]
    qualified['vote_count'] = qualified['vote_count'].astype('int')
    qualified['vote_average'] = qualified['vote_average'].astype('int')
    qualified['wr'] = qualified.apply(lambda x: (x['vote_count']/(x['vote_count']+m) * x['vote_average']) + (m/(m+x['vote_count']) * C), axis=1)
    qualified = qualified.sort_values('wr', ascending=False).head(20)
    qualified = qualified.to_dict(orient='records')
    return qualified

# Collaborative filtering
def get_collaborative_recommendations(similar_users):
  # A dictionary to store item scores
  item_score = {}

  # Loop through items
  for i in similar_user_movies.columns:
    # Get the ratings for movie i
    movie_rating = similar_user_movies[i]
    # Create a variable to store the score
    total = 0
    # Create a variable to store the number of scores
    count = 0
    # Loop through similar users
    for u in similar_users.index:
      # If the movie has rating
      if pd.isna(movie_rating[u]) == False:
        # Score is the sum of user similarity score multiply by the movie rating
        score = similar_users[u] * movie_rating[u]
        # Add the score to the total score for the movie so far
        total += score
        # Add 1 to the count
        count +=1
    # Get the average score for the item
    item_score[i] = total / count

  # Convert dictionary to pandas dataframe
  item_score = pd.DataFrame(item_score.items(), columns=['movie', 'movie_score'])

  # Sort the movies by score
  ranked_item_score = item_score.sort_values(by='movie_score', ascending=False)
  ranked_item_score = ranked_item_score.to_dict(orient='records')
  
  return ranked_item_score
# Routes
# Define your API route
@app.route('/genre', methods=['GET'])
def genre():
    # Return the response with the appropriate CORS headers
    selected_genres = request.args.get('selectedGenres')  # Get the selected genres from query parameters
    
    if selected_genres:
        selected_genres_list = selected_genres.split(',')  # Convert the comma-separated string to a list
        genre_rec_movies = build_recommendation(selected_genres_list)
    else:
        genre_rec_movies = build_recommendation([])

    rec_movies = []
    if genre_rec_movies is not None:
        for movie in genre_rec_movies:
            movie_id = movie['id'] 
            poster_url = fetch_poster(movie_id)
            rec_movies.append({
                'id':movie_id,
                'title': movie['title'],  
                'poster': poster_url
            })

    response = jsonify(rec_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

@app.route('/top_movies', methods=['GET'])
def top_movies():
    # Return the response with the appropriate CORS headers

    rec_movies = []

    for movie in top_movies_list_dict:
        movie_id = movie['id'] 
        poster_url = fetch_poster(movie_id)
        rec_movies.append({
            'id': movie_id,
            'title': movie['title'],  
            'poster': poster_url
        })
    response = jsonify(rec_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

@app.route('/search', methods=['GET'])
def search():
    search_query = request.args.get('q', '')
    
    cleaned_movies_df = content_based_movie_data.drop_duplicates(subset=['id'])
    # Clean up the DataFrame by dropping rows with missing values
    cleaned_movies_df = cleaned_movies_df.dropna(subset=['title'])  # Adjust column name as needed

    # Create a boolean mask for filtering based on the search query
    search_mask = cleaned_movies_df['title'].str.contains(search_query, case=False, na=False)

     # Apply the boolean mask to the cleaned DataFrame
    search_results_df = cleaned_movies_df[search_mask]

    # Replace NaN values with empty strings
    search_results_df_filled = search_results_df.fillna('').head(10)
    
    # Convert the DataFrame to a dictionary
    search_results = search_results_df_filled.to_dict(orient='records')

    if(search_query == ''):
        search_results = []

    response = jsonify(search_results)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

@app.route('/content', methods=['GET'])
def content():
    movie_title = request.args.get('movieTitle')
    rec_movies = []
    genre_rec_movies = get_content_based_recommendations(movie_title)
    # genre_rec_movies_dict = top_movies_list.to_dict(orient='records')
    for movie in genre_rec_movies:
        movie_id = movie['id'] 
        poster_url = fetch_poster(movie_id)
        rec_movies.append({
            'id':movie_id,
            'title': movie['title'], 
            'poster': poster_url
        })

    response = jsonify(rec_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response

@app.route('/collaborative', methods=['GET'])
def collaborative():

    # Make a copy of user_similarity before dropping
    user_similarity_copy = user_similarity.copy()

    # Pick a user ID
    picked_userid = 75

    # Remove picked user ID from the candidate list
    user_similarity_copy.drop(index=picked_userid, inplace=True)
    # Take a look at the data
    user_similarity.head()

    # Number of similar users
    n = 10

    # User similarity threashold
    user_similarity_threshold = 0.3

    # Get top n similar users
    similar_users = user_similarity_copy[user_similarity_copy[picked_userid]>user_similarity_threshold][picked_userid].sort_values(ascending=False)[:n]

    recommended_movies = get_collaborative_recommendations(similar_users)

    rec_movies = []

    for res in recommended_movies:
        movie = content_based_movie_data[content_based_movie_data['id']== res['movie'] ]
        if not movie.empty:
            movie_id = int(movie['id'].values[0])
            poster_url = fetch_poster(movie_id)
            rec_movies.append({
                'id': movie_id,
                'title': movie['title'].values[0],  
                'poster': poster_url
            })

    response = jsonify(rec_movies)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response


if __name__ == "__main__":
    app.run(debug=True) 