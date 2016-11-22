// CSS
require('./style.css')
// JS
var angular = require('angular')
var app = angular.module('home', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'home',
    url: '/home',
    template: require('./index.html'),
    controller: 'homeCtrl'
  })
})

app.controller('homeCtrl', function ($scope, $API) {
  $scope.user = {}
  $API.user().then(function (res) {
    $scope.user = res
  })
})

module.exports = app.name
