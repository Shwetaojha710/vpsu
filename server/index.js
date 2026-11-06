require('dotenv').config();

const app = require('./app');
const sequelize = require('./connection/connection');
require('./models');

const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(function () {
    console.log('PostgreSQL connected');
    app.listen(PORT, function () {
      console.log('Server running on http://localhost:' + PORT);
    });
  })
  .catch(function (err) {
    console.error('PostgreSQL connection failed.');
    console.error('Check DB name, user and password in server/.env');
    console.error('Error: ' + err.message);
    process.exit(1);
  });
