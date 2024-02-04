const sequelize = require('./config/connection');
const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});
