import pandas as pd
# import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns
# from scipy import stats
# from ast import literal_eval
# from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
# from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
# from nltk.stem.snowball import SnowballStemmer
# from nltk.stem.wordnet import WordNetLemmatizer
# from nltk.corpus import wordnet
# from surprise import Reader, Dataset, SVD
# from surprise.model_selection import cross_validate
from flask import Flask, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})

top_movies_list = pickle.load(open('top_movies.pkl','rb'))

@app.route('/top_movies', methods=['GET'])
def test():
    # Return the response with the appropriate CORS headers
    response = jsonify(top_movies_list)
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Methods', 'GET')
    return response
