var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var favoriteRouter = express.Router();

var Favorites = require('../models/favorites');

module.exports = favoriteRouter;
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next){
  Favorites.find({postedBy:req.decoded._doc._id})
    .populate('dishes')
    .exec(function (err, favorite) {
    if (err) throw err;
    res.json(favorite);
  });
})
