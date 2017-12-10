/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200, 'response should be 200');
        const parsedRes = JSON.parse(res.text);
        assert.isArray(parsedRes, 'response should be an array');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        const title = "newTitle!!";
        chai.request(server)
        .post('/api/books')
        .send({ title: title })
        .end(function(err, res){
          assert.equal(res.status, 200);
          const data = JSON.parse(res.text);
          assert.equal(data.title, title, 'Books in array should contain title');
          assert.exists(data._id,'Book should contain _id');
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        const title = "newTitle!!";
        chai.request(server)
        .post('/api/books')
        .send({})
        .end(function(err, res){
          assert.equal(res.status, 400);
          assert.equal(res.text, 'title needed');
          done();
        });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end(function(err, res){
          assert.equal(res.status, 200, 'response should be 200');
          const parsedRes = JSON.parse(res.text);
          assert.isArray(parsedRes, 'response should be an array');
          assert.exists(parsedRes[0].commentCount, 'Books in array should contain commentcount');
          assert.exists(parsedRes[0].title, 'Books in array should contain title');
          assert.exists(parsedRes[0]._id, 'Books in array should contain _id');
          done();
        });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const idTarget = 'NOTID?';
        chai.request(server)
        .get('/api/books/'+idTarget)
        .end(function(err, res) {
          assert.equal(res.status, 400);
          assert.equal(res.text,'no book exists');
          done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        const title = "BOOK_TITLE"
        chai.request(server)
        .post('/api/books')
        .send({ title: title })
        .end(function(err, res){
          const data = JSON.parse(res.text);
          const idTarget = data._id;
          
          chai.request(server)
          .get('/api/books/'+idTarget)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            const data = JSON.parse(res.text);
            assert.equal(data.title, title, 'Books in array should contain title');
            assert.exists(data._id,'Book should contain _id');
            done();
          });
        });        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const title = "BOOK_TITLE";
        const comment = "MY_COMMENT";
        chai.request(server)
        .post('/api/books')
        .send({ title: title })
        .end(function(err, res){
          const data = JSON.parse(res.text);
          const idTarget = data._id;
          
          chai.request(server)
          .post('/api/books/'+idTarget)
          .send({comment: comment})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            const data = JSON.parse(res.text);
            assert.equal(data.title, title, 'Books in array should contain title');
            assert.exists(data._id,'Book should contain _id');
            assert.isArray(data.comments);
            assert.equal(data.comments[0], comment);
            done();
          });
        });
      });
      
    });

  });

});
