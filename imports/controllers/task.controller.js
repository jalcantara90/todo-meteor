import { Template } from 'meteor/templating';

import { Todos } from '../api/api.task.js';

import '../templates/task.html';

Template.todos.helpers({
    todo() {
        return Todos.find({}, {sort: {createdAt: -1}});
    },
});

Template.todoItem.helpers({
    'checked': function(){
        var isCompleted = this.completed;
        if(isCompleted){
            return "checked";
        } else {
            return "";
        }
    }
});

Template.todosCount.helpers({
    'totalTodos': function(){
        return Todos.find().count();
    },
    'completedTodos': function(){
        return Todos.find({ completed: true }).count();
    }
});

Template.addTodo.events({
  'submit form': function(event){
    event.preventDefault();
    var todoName = event.target.todoName.value;
    Todos.insert({
        name: todoName,
        completed: false,
        createdAt: new Date()
    });
    event.target.todoName.value = "";
  },
});

Template.todoItem.events({
  'click .delete-todo': function(event){
    event.preventDefault();
    var documentId = this._id;
    var confirm = window.confirm("Delete this task?");
    if(confirm){
        Todos.remove({ _id: documentId });
    }
  },
  'keyup [name=todoItem]': function(event){
      if(event.which == 13 || event.which == 27){
         console.log("You tapped the Return or Escape key");
         event.target.blur();
       } else {
         var documentId = this._id;
         var todoItem = event.target.value;
         Todos.update({ _id: documentId }, {$set: { name: todoItem }});
         console.log("Task changed to: " + todoItem);
       }
  },
  'keydown [name=todoItem]': function(){
    if(event.which == 13 || event.which == 27){
       console.log("You tapped the Return or Escape key");
       event.target.blur();
     } else {
       var documentId = this._id;
       var todoItem = event.target.value;
       Todos.update({ _id: documentId }, {$set: { name: todoItem }});
       console.log("Task changed to: " + todoItem);
     }
  },
  'keypress [name=todoItem]': function(){
      if(event.which == 13 || event.which == 27){
         console.log("You tapped the Return or Escape key");
         event.target.blur();
       } else {
         var documentId = this._id;
         var todoItem = event.target.value;
         Todos.update({ _id: documentId }, {$set: { name: todoItem }});
         console.log("Task changed to: " + todoItem);
       }
  },
    'change [type=checkbox]': function(){
      var documentId = this._id;
      var isCompleted = this.completed;
      if(isCompleted){
          Todos.update({ _id: documentId }, {$set: { completed: false }});
          console.log("Task marked as incomplete.");
      } else {
          Todos.update({ _id: documentId }, {$set: { completed: true }});
          console.log("Task marked as complete.");
      }
  }
});
