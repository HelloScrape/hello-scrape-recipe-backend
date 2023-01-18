# Hello Fresh Recipe Backend

Hello Fresh Recipe Backend | Get all scraped recipes from Hello Fresh

## Routes

- GET: `/recipe` - Returns a 200 OK response, list with all recipes
- GET: `/recipe/language/<nl/en/fr>` - Returns a 200 OK response, with a list of recipes in the specified language
- GET: `/recipe/id/:id`- Returns a 200 OK response, with the recipe with the specified id


## How to run

- Copy `.env.example` to `.env`
- Fill in the required values
- Configure the port in the `docker-compose.yml` file if needed. (If you want to run the server on port 90 for example use the following value: `90:8080`)
- Run `docker-compose up -d` to start the server
