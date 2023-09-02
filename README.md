# WeatherClothes APP backend

## About the APP

The basic idea behind this weather application is to be able to set clothes suggestions for temperature intervals. This feature is available after a Google OAuth login. Without login only the basic city search function is available.
After login the user can set up custom temperature intervals and select clothes for that interval in the "Manage preferences" menu (the options are based on the clothes I use for cycling ;-))
By clicking on the temerature value of a city the app will show the clothes suggestion for that temperature. (The 24h forecast cards can also be clicked)
The user can also save a city as a favorite by clicking on the star on the city card.

## Description

This repository contains the backend server for the WeatherClothes APP.
To be able to run the server on your local machine, follow these steps.

## Prerequisites

Make sure you have Node.js installed on your machine. You can download it from the official website: https://nodejs.org/
You will also need git installed on your machine. Check the [GitHub](https://github.com/git-guides/install-git) or the [git-scm](https://git-scm.com/downloads) websites for guidance.

### Steps for running

1. Clone the repository and change to the new directory:
    ```
    $ git clone https://github.com/kolestom/weatherClothesBE.git
    $ cd weatherClothesBE
    ```
2. Install the dependencies:
    ```
    $ npm install
    ```
3. Create a .env file in the root directory of the project with the following variables:
    -   SERVER: the port number of the express server that the frontend will use (3005)
    -   MONGO_URL: a MongoDB URI for connecting to your database.
    -   JWT_SECRET_KEY: a secret key of your choice for JWT creation, verification
    -   CLIENT_ID: a client ID for the OAuth2 application from the Google Developer Console.
    -   CLIENT_SECRET: a secret key for the OAuth2 application from the Google Developer Console.
    -   REDIRECT_URI = http://localhost:5173/callback
    -   WEATHER_API_KEY = An API key for the 3rd party Weather API [Documentation](https://www.weatherapi.com/docs/)
    -   TEST_TOKEN = create a token for testing using the JWT_SECRET_KEY
    -   TEST_SUB = create a sub that will be included in the TEST_TOKEN
4.  Run the build script:
    ```
    $ npm run build
    ```
5.  Start the backend server:
    ```
    $ npm start
    ```
6.  To download and launch the frontend server, follow the README.md on [this](https://github.com/kolestom/weatherClothesFE) link
