const sequelize = require('../config/connection');
// Import models
const { Post, User, Comment } = require('../models');
// Import seed data
const userData = require('./userData.json');
const postData = require('./postData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true
  });

  process.exit(0);
};

seedDatabase();