const express = require('express');
const router = express.Router();
const Campground = require("../models/Campground");
const sanitizer = require('express-sanitizer')


router.get('/campgrounds', (req,res) => {
    Campground.find({}, (err,campgrounds) => {
        if (!err) {
            res.render('campgrounds',{title:"EHC!",campgrounds:campgrounds, user : req.user})
        } else console.log(err)
    })
})

router.post('/campgrounds', isLoggedIn, (req,res) => {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCamp = {name : name, image : image, description : description, author : author}
    Campground.create(newCamp, (err,camp) => {
        if(!err){
            console.log("new campground added",camp)
            res.redirect('/campgrounds')
        }  else console.log(err)
    })
})

router.get('/campgrounds/new', isLoggedIn, (req,res) => {
    res.render('new',{user : req.user});
})

router.get('/campgrounds/:id', (req,res) => {
    Campground.findById(req.params.id).populate('comments').exec( (err,camp) => {
        if(!err) {
            console.log(camp)
            res.render('show',({campground:camp,user : req.user}))
        } else console.log(err)
    })
})

router.get('/campgrounds/:id/edit', auth, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if (!err) res.render('editCamp',{campground : campground, user : req.user})
    })
})

router.post('/campgroundsUpd/:id', auth, (req,res) => {
    Campground.findByIdAndUpdate(req.params.id,{name : req.body.name, image : req.body.image, description : req.body.description}, (err,camp) => {
        if(!err) {
            console.log(camp)
            res.redirect('http://localhost:8080/campgrounds/' + req.params.id)
        } else console.log(err)
    })
})

router.get('/campgrounds/:id/delete', auth, (req,res) => {
    Campground.findByIdAndDelete(req.params.id,  (err,camp) => {
        if(!err) console.log("Deleted:",camp)
        else console.log(err)
        res.redirect('http://localhost:8080/campgrounds')
    })
})

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

function auth(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, camp) => {
            if(err) res.redirect('back')
            if(camp.author.id.equals(req.user._id)) return next()
            else res.redirect('back')
        })
    } else res.redirect('back')
}

module.exports = router