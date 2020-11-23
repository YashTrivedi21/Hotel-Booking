const express = require('express');
const router = express.Router();
const Campground = require("../models/Campground");
const Comment = require("../models/comment");

router.get('/campgrounds/:id/comments/new', isLoggedIn, (req,res) => {
    Campground.findById(req.params.id, (err,campground) => {
        if (!err) {
            res.render('comnew', {campground: campground, user : req.user})
            // console.log(campground)
        } else console.log(err)
    })

    router.post('/campgrounds/:id/comments', isLoggedIn, (req,res) => {
        Campground.findById(req.params.id, (err,campground) => {
            if (!err) {
                let text = req.body.text
                let author = req.body.author
                Comment.create({text:text,author:author}, (err,comment) => {
                    if (!err) {
                        comment.author.username = req.user.username
                        comment.author.id = req.user._id
                        comment.save()
                        campground.comments.push(comment)
                        campground.save()
                        res.redirect('/campgrounds/' + campground._id)
                    } else console.log(err)
                })
            } else console.log(err)
        })
    })
})

router.get('/campgrounds/:id/comments/:com_id/edit', auth, (req, res) => {
    Comment.findById(req.params.com_id, (err, comment) => {
        Campground.findById(req.params.id, (err, campground) => {
            if(!err) res.render('editComm', {comment : comment, user : req.user, campground : campground})
            else console.log(err)
        })
    })
})

router.post('/campgrounds/:id/commentsUpd/:com_id', auth, (req,res) => {
    Comment.findByIdAndUpdate(req.params.com_id,{text : req.body.text}, (err,camp) => {
        if(!err) {
            console.log(camp)
            res.redirect('http://localhost:8080/campgrounds/' + req.params.id)
        } else console.log(err)
    })
})

router.get('/campgrounds/:id/comments/:com_id/delete', auth,  (req,res) => {
    Comment.findByIdAndDelete(req.params.com_id,  (err,comm) => {
        if(!err) console.log("Deleted:",comm)
        else console.log(err)
        res.redirect('http://localhost:8080/campgrounds/' + req.params.id)
    })
})

function auth(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.com_id, (err, comm) => {
            console.log(req.params.id)
            console.log(req.params.com_id)
            if(err) res.redirect('back')
            if(comm.author.id.equals(req.user._id)) return next()
            else res.redirect('back')
        })
    } else res.redirect('back')
}


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) return next()
    res.redirect('/login')
}

module.exports = router