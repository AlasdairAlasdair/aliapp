var express = require('express');
var bodyParser = require('body-parser');
var Todo = require('./models/todo');
var mongoose   = require('mongoose');

var app = express();
var port = process.env.PORT || 8080;
var router = express.Router();

mongoose.connect('mongodb://' + process.env.MONGODB_USERNAME + ':' + process.env.MONGODB_PASSWORD + '@ds039281.mongolab.com:39281/scratch');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function (request, response) {
  response.json({ message: 'hello there'});
});

// create a todo (accessed at POST http://localhost:8080/api/v1/todos)
router.route('/todos')
  .post(function (request, response) {
    // create a new instance of the Todo model
    var todo = new Todo();
    todo.title = request.body.title;
    todo.isCompleted = request.body.isCompleted;

    todo.save(function (error) {
      if (error) {
        response.send(error);
      }

      response.json({ message: 'Todo created!' });
    });
  })
  .get(function (request, response) {
    Todo.find(function (error, todos) {
      if (error) {
        response.send(error);
      }
      response.json(todos);
    });
  });

router.route('/todos/:todo_id')
    
    // get todo by id
    .get(function (request, response) {
        Todo.findById(request.params.todo_id, function (error, todo) {
            if (error) response.send(error);
            response.json(todo);
        });
    });

    // update the todo with this id
    .put(function (request, response) {
 
        // use our todo model to find the todo we want
        Todo.findById(request.params.todo_id, function(error, todo) {
            if (error) response.send(error);
 
            // update the todo info
            todo.title = request.body.title;
            todo.isCompleted = request.body.isCompleted;
            
            // save the todo
            todo.save(function(error) {
                if (error) response.send(error);
                response.json({ message: 'Todo updated!' });
            });
        });
    })
    
    // delete the todo with this id
    .delete(function (request, response) {
        Todo.remove({
            _id: request.params.todo_id
        }, function(error, todo) {
            if (error) res.send(err);
 
            response.json({ message: 'Successfully deleted' });
        });
    });

// register routes with prefix
app.use('/api/v1/', router);
app.listen(port);
console.log('Server running on port ' + port);