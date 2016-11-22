// CSS
require('bulma/css/bulma.css')

// JS
var angular = require('angular')
var app = angular.module('app', [
  require('angular-ui-router'),
  require('./api'),
  require('./components/login'),
  require('./components/cadastro'),
  require('./components/home')
])

app.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')
})
