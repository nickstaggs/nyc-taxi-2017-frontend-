## [NYC Taxi Map Frontend](https://nyctaximap.nickstaggs.com)
Interactive map of NYC that represents all of the zones that yellow taxis can pick up and drop off in.
The backend is housed in Azure in an app service app. https://eus-fa-ntm.azurewebsites.net/api

## How to run locally

1. `git clone https://github.com/nickstaggs/nyc-taxi-2017-frontend.git`
2. `cd nyc-taxi-2017-frontend`
3. `npm i`
4. `touch .env`
5. `echo "REACT_APP_API_URL=https://eus-fa-ntm.azurewebsites.net/api" >> .env`
6. `npm run start`


