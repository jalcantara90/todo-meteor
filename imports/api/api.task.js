import { Mongo } from 'meteor/mongo';
Lists = new Meteor.Collection('lists');

Router.route('/register');
Router.route('/login');

Router.route('/', {
    name: 'home',
    template: 'home',
    waitOn: function(){
        return Meteor.subscribe('lists');
    }
});

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/list/:_id', {
    name: 'listPage',
    template: 'listPage',
    data: function(){
        var currentList = this.params._id;
        var currentUser = Meteor.userId();
        return Lists.findOne({ _id: currentList, createdBy: currentUser });
    },
    onBeforeAction: function(){
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.render("login");
        }
    },
    waitOn: function(){
        var currentList = this.params._id;
        return Meteor.subscribe('todos', currentList);
    }
});


Router.configure({
    layoutTemplate: 'main',
    loadingTemplate: 'loading'
});

export const Todos = new Mongo.Collection('todos');


if(Meteor.isServer){
    Meteor.publish('lists', function(){
        var currentUser = this.userId;
        return Lists.find({ createdBy: currentUser });
    });
    Meteor.publish('todos', function(currentList){
        var currentUser = this.userId;
        return Todos.find({ createdBy: currentUser, listId: currentList })
    });
}

if(Meteor.isClient){
    Meteor.subscribe('lists');
    Meteor.subscribe('todos');
}