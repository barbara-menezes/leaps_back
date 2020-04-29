require('dotenv').config();
module.exports= {
  "development": {
    "url": "postgres://postgres:admin@127.0.0.1:5432/db_acessibilidade"
  },
  "test": {
    "url": process.env.HEROKU_POSTGRESQL_CRIMSON_URL
  },
  "production": {
    "url": process.env.HEROKU_POSTGRESQL_CRIMSON_URL
  }
}