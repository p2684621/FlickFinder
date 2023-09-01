# FlicFinder - Personalized Movie Recommendation System 

Welcome to the FlickFinder repository! This repository contains the code and documentation for a sophisticated recommendation system that suggests movies to users based on their preferences. The system is built using Python for the backend and React with TypeScript for the frontend.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Backend](#backend)
- [Frontend](#frontend)

## Introduction

The FlickFinder project aims to enhance user movie discovery and engagement by providing personalized movie recommendations. The system employs various recommendation techniques, including popular-based, genre-based, content-based, and user-user collaborative filtering algorithms, to offer a diverse and comprehensive recommendation experience to users.

## Features

- Recommendation using best algorithm techniques
- Real-time updates for recommendations
- Dynamic genre selection and movie search functionality

## Technologies Used

- **Backend:**
  - Python: Primary programming language for backend development, algorithm implementation, and data manipulation.
  - Flask: Lightweight web framework for building RESTful APIs to handle HTTP requests efficiently.

- **Frontend:**
  - React with TypeScript: JavaScript library for building user interfaces with static typing for improved code organization.

- **Development Tools:**
  - Google Colab: Initial environment for algorithm development and testing, pre-installed with libraries for data analysis and machine learning.
  - GitHub: Collaborative platform for version control, enabling multiple team members to contribute and manage code iterations.
  - Visual Studio Code (VS Code): Integrated development environment with debugging capabilities, supporting both Python and TypeScript development.

## Installation

1. Clone this repository to your local machine using:

2. Navigate to the project's root directory:

3. **Backend:**
- Set up a virtual environment and install required Python packages:
  ```
  cd server
  python -m venv venv
  source venv/bin/activate   # On Windows: venv\Scripts\activate
  pip install -r requirements.txt
  ```

4. **Frontend:**
- Install Node.js and npm if not already installed.
- Navigate to the frontend directory:
  ```
  cd client
  ```
- Install dependencies:
  ```
  npm install
  ```

## Usage

1. **Backend:**
- Run the Flask server:
  ```
  python server.py
  ```
- The backend server should now be running at http://localhost:5000.

2. **Frontend:**
- Run the React development server:
  ```
  npm run dev
  ```
- Open your browser and visit http://localhost:5173 to access the frontend.

## Backend

The backend of the project is developed using Flask, a lightweight Python web framework. It handles incoming requests, collaborates with the recommendation algorithms, and serves data to the frontend through RESTful APIs. The backend is responsible for fetching and processing movie recommendations based on user preferences and algorithm choices.

## Frontend

The frontend is built using React with TypeScript, providing a dynamic and responsive user interface. Users can select genres, search for movies, and receive real-time recommendations. The frontend interacts with the backend through API requests, ensuring a seamless flow of data between the user interface and recommendation algorithms.

