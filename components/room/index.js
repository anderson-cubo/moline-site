// JS
require('./style.css')
require('webcam/dist/webcam.min.js')
var angular = require('angular')
var app = angular.module('room', [
  require('angular-ui-router'),
  'webcam'
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'room',
    url: '/room/:id',
    template: require('./index.html'),
    controller: 'roomCtrl'
  })
})
app.controller('roomCtrl', function (
  $scope,
  $state,
  $stateParams,
  $API
) {
  $scope.user = {}
  $API.user().then(function (res) {
    $scope.text = ''
    $scope.messages = []
    $scope.user = res
    $scope.send = function () {
      $scope.messages.push({user: $scope.user, message: $scope.text, time: moment().format('DD/MM/YYYY HH:mm')})
      $scope.text = ''
    }
  })
})
module.exports = app.name
