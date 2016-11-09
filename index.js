// CSS
require('bulma/css/bulma.css')

// JS
var angular = require('angular')
var app = angular.module('app', [
  require('angular-ui-router'),
  require('./components/login'),
  require('./components/cadastro'),
  require('./components/aluno')
])

app.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')
})
