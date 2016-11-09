// JS
var angular = require('angular')
var app = angular.module('login', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  console.log('start run')
  $stateProvider.state({
    name: 'login',
    url: '/login',
    template: require('./index.html') // ,
    // controller: ctrl || (name + 'Ctrl')
  })
})

module.exports = app.name
