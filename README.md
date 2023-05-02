# WeatherClothes APP backend

## Description

This repository contains the backend server for the WeatherClothes APP.
To be able to run the server on your local machine, follow these steps.

### Steps for running

1. Clone the repository
2. Install the dependencies:
    -   npm install
3. Create a .env file in the root directory of the project with the following variables:
    -   SERVER: the port number of the express server that the frontend will use (3005)
    -   MONGO_URL: a MongoDB URI for connecting to your database.
    -   JWT_SECRET_KEY: a secret key of your choice for JWT creation, verification
    -   CLIENT_ID: a client ID for the OAuth2 application from the Google Developer Console.
    -   CLIENT_SECRET: a secret key for the OAuth2 application from the Google Developer Console.
    -   REDIRECT_URI = http://localhost:5173/callback
    -   WEATHER_API_KEY = An API key for the 3rd party Weather API [Documentation](https://www.weatherapi.com/docs/)
    -   TEST_TOKEN = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiS8O2bGVzIFRhbcOhcyIsInN1YiI6IjExNDk2MDgwNDI5MjQ4MDU4NDYxNiIsImVtYWlsIjoia29sZXN0b21AZ21haWwuY29tIiwiaWF0IjoxNjgxNjczNTI2fQ.akFSOlCFpPhvXTn3M-MfBoi3IAOGAFFb6UPmHzmePUs
    -   TEST_SUB = 114960804292480584616
4.  npm run build
