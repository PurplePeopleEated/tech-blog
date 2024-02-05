const sequelize = require('./config/connection');
const express = require('express');
const routes = require('./controllers');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
