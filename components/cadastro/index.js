// CSS
require('./style.css')
// JS

var angular = require('angular')
var _ = require('lodash')

var app = angular.module('cadastro', [
  require('angular-ui-router')
])

app.config(function ($stateProvider) {
  $stateProvider.state({
    name: 'cadastro',
    url: '/cadastro',
    template: require('./index.html'),
    controller: 'cadastroCtrl'
  })
})
app.controller('cadastroCtrl', function (
  $scope,
  $state,
  $API
) {
  var _submiting = false
  $scope.coursesList = require('../../misc/lista_de_cursos.json')
  $scope.user = {
    is_teacher: false
  }
  $scope.send = function () {
    if (_submiting) return void (0)
    _submiting = true
    $scope.notif = false
    $API.register(_.clone($scope.user)).then(function (res) {
      _submiting = false
      $state.go('home')
    }).catch(function (err) {
      $scope.notif = err.error
      _submiting = false
    })
  }
})

module.exports = app.name
