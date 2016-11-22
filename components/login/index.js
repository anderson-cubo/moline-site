// JS
var angular = require('angular')
var app = angular.module('login', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'login',
    url: '/login',
    template: require('./index.html'),
    controller: 'loginCtrl'
  })
})
app.controller('loginCtrl', function (
  $scope,
  $state,
  $API
) {
  var _submiting = false
  $scope.user = {}
  $scope.send = function () {
    if (_submiting) return void (0)
    _submiting = true
    $scope.notif = false
    $API.login($scope.user.email, $scope.user.password).then(function (res) {
      _submiting = false
      $state.go('home')
    }).catch(function (err) {
      $scope.notif = err.error
      _submiting = false
    })
    // window.alert(JSON.stringify($scope.user))
  }
})
module.exports = app.name
