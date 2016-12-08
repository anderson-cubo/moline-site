// CSS
require('bulma/css/bulma.css')
// JS
var angular = require('angular')

require('ng-file-upload')

var app = angular.module('app', [
  'ngFileUpload',
  require('angular-ui-router'),
  require('./api'),
  require('./components/calendar'),
  require('./components/login'),
  require('./components/cadastro'),
  require('./components/home'),
  require('./components/room')
])
app.run(function ($API) {
  $API.socket.start()
})
app.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/login')
})
