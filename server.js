const sequelize = require('./config/connection');
const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();
app.get('/', (req, res) => {
  res.send('Hello World!');
})

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening at http://localhost:${PORT}`));
});
