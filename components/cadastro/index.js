// JS
var angular = require('angular')
var app = angular.module('cadastro', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'cadastro',
    url: '/cadastro',
    template: require('./index.html') // ,
    // controller: ctrl || (name + 'Ctrl')
  })
})

module.exports = app.name
