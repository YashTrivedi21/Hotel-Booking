const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title : 'YelpCamp', user : req.user});
});

router.get('/register', (req,res) =>   res.render('register'))

router.post('/register', (req,res) => {
  User.register(new User({username: req.body.username}), req.body.password, (err,user) => {
    if(err) {
      console.log(err)
      res.redirect('/register')
    } else {
      passport.authenticate('local')(req, res, () => res.redirect('http://localhost:8080/campgrounds'))
    }
  })
})

router.get('/login', (req,res) => {
  req.flash('success', 'logged in!!!')
  res.render('login')
})

router.post('/login',passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login'
}), (req,res) => {
  req.flash('success', 'logged in!!!')

})

router.get('/logout', (req,res) => {
  req.logout()
  req.flash('error', 'logged out!!!')
  res.redirect("http://localhost:8080")
})

module.exports = router;
