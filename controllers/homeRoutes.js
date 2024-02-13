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
    });

} catch (err) {
    res.status(500).json(err);
  }
});

// * GET single post by id * //
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ['username']
            }
          ]
        }
      ]
    });
    console.log(postData);
    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// * GET comments for single post * //
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    const commentData = await Comment.findAll({
      where: {
        post_id: req.params.id
      },
      include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
    });

    const post = postData.get({ plain: true });
    const comments = commentData.map((comment) => comment.get({ plain: true }));
    const authorComments = comments.filter((comment) => {
      return {
        is_author: comment.user_id === req.session.user_id, 
        ...comment
      };
    });

    res.render('post', {
      ...post,
      comments: authorComments,
      logged_in: req.session.logged_in,
      is_author: post.user_id === req.session.user_id
    });

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

// * GET profile page * //
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Post }]
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;