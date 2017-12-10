/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
const MONGODB_CONNECTION_STRING = process.env.DB;
//Example connection: MongoClient.connect(MONGODB_CONNECTION_STRING, function(err, db) {});

var Book = require('../models/book');


module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        res.send( books.map( (book) => {
          return {
            _id: book._id,
            title: book.title,
            commentCount: book.comments.length
          }
        }))
      })
    })
    
    .post(function (req, res){
      var title = req.body.title;
      if (!title) return res.status(400).send('title needed');
      const book = new Book({ title: title });
      book.save( (err) => {
        if(err) return res.status(400).send(err.message);
        res.send({
          title: book.title,
          _id: book._id
        });
      })
    })
    
    .delete(function(req, res){
      Book.remove({}, (err) => {
        if(err) return res.status(400).send(err.message);
        res.send('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
      if( !bookid ) return res.status(400).send('no book exists');
      Book.findOne({_id: bookid}, (err, book) => {
        if( err ) return res.status(400).send('no book exists');
        res.send(book);
      })
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      if( !bookid ) return res.status(400).send('no book exists');
      Book.findOne({_id: bookid}, (err, book) => {
        if( err ) return res.status(400).send(err.message);
        book.comments.push(comment);
        book.save( (err) => {
          if( err ) return res.status(400).send(err.message);
          res.send(book);
        })
      })
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      if( !bookid ) return res.status(400).send('no book exists');
      Book.remove({_id: bookid}, (err) => {
        if( err ) return res.status(400).send(err.message);
        res.send('delete successful');
      })
    });
  
};
