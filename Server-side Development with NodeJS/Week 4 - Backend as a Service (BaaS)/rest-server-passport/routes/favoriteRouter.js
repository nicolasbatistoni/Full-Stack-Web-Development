var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var favoriteRouter = express.Router();

var Favorites = require('../models/favorites');

module.exports = favoriteRouter;
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')

.get(Verify.verifyOrdinaryUser, function(req,res,next) {
  Favorites.find({postedBy:req.decoded._doc._id})
    .populate('dishes')
    .exec(function (err, favorite) {
    if (err) throw err;
    res.json(favorite);
  });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({postedBy:req.decoded._doc._id}, function(err, favorite) {
    if (err) {
      throw err;
    }
    if (!favorite) {
      favorite = new Favorites();
      favorite.postedBy = req.decoded._doc._id;
    }
    if (!favorite.dishes) {
      favorite.dishes = [];
    }
    if (req.body._id) {
      var isIn = false;
      for (var i=0; (i<favorite.dishes.length) && (!isIn); i++) {
        if (favorite.dishes[i] == req.body._id) {
          isIn = true;
        }
      }
      if (!isIn) {
        favorite.dishes.push(req.body._id);
        favorite.save(function(err) {
          if (err) throw err;
        });
      }
      res.json(favorite);
    } else {
      res.json(favorite);
    }
  });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({postedBy:req.decoded._doc._id}, function(err, favorite){
    if (err) {
      throw err;
    }
    if (!favorite) {
      res.json({});
      return;
    }
    if (!favorite.dishes) {
      res.json(favorite);
      return;
    }
    favorite.dishes = [];
    res.json(favorite);
    favorite.save(function(err){
      if (err) throw err;
    });
  });
});

favoriteRouter.route('/:favoriteId')

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
  Favorites.findOne({postedBy:req.decoded._doc._id}, function(err, favorite){
    if (err) {
      throw err;
    }
    if (!favorite) {
      res.json({});
      return;
    }
    if (!favorite.dishes) {
      res.json(favorite);
      return;
    }
    for (var i=0; i<favorite.dishes.length; i++){
      var index = favorite.dishes.indexOf(req.body._id);
      if (index > -1){
        favorite.dishes.splice(index, 1);
      }
    }
    res.json(favorite);
    favorite.save(function(err){
      if (err) throw err;
    });
  });
});
