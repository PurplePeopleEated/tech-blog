const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../helpers/auth');

// * GET all posts * //
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });
    // Serialize data so the template can read it
    const posts = postData.map((post) => post.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', {
      posts: posts,
      logged_in: req.session.logged_in
    })
} catch (err) {
    res.status(500).json(err);
  }
});

// * GET login page * //
router.get('/login', async (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;