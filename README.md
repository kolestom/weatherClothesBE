# WeatherClothes APP backend

## Description

This repository contains the backend server for the WeatherClothes APP.
To be able to run the server on your local machine, follow these steps.

### Steps for running

1. Clone the repository
2. Install the dependencies:
    $ npm install
3. Create a .env file in the root directory of the project with the following variables:
    -   SERVER: the port number of the express server that the frontend will use (3005)
    -   MONGO_URL: a MongoDB URI for connecting to your database.
    -   JWT_SECRET_KEY: a secret key of your choice for JWT creation, verification
    -   CLIENT_ID: a client ID for the OAuth2 application from the Google Developer Console.
    -   CLIENT_SECRET: a secret key for the OAuth2 application from the Google Developer Console.
    -   REDIRECT_URI = http://localhost:5173/callback
    -   WEATHER_API_KEY = An API key for the 3rd party Weather API [Documentation](https://www.weatherapi.com/docs/)
    -   TEST_TOKEN = create a test token for testing that is created with the JWT_SECRET_KEY
    -   TEST_SUB = create a sub that will be included in the TEST_TOKEN
4.  Run the build script:
    npm run build
5.  Start the backend server:
    npm start
6.  Start the frontend development server:
    npm run dev
    Access the frontend by navigating to http://localhost:5173/ in your browser
