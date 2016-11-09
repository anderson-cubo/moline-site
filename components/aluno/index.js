// CSS
require('./style.css')
// JS
var angular = require('angular')
var app = angular.module('aluno', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'aluno',
    url: '/aluno',
    template: require('./index.html') // ,
    // controller: ctrl || (name + 'Ctrl')
  })
})

module.exports = app.name
