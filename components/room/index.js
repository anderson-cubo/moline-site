// JS
require('./style.css')
require('../sdb')
var angular = require('angular')
var app = angular.module('room', [
  require('angular-ui-router'),
  'sdb'
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
  $sdb,
  $API
) {
  var webrtc = null
  $scope.user = {}

  $scope.close = function () {
    if (window.confirm('Tem certeza que deseja fechar a sala?')) {
      $API.room.remove($stateParams.id).then(function () {
        $API.socket.close($stateParams.id)
        webrtc.leaveRoom()
        $state.go('home')
      }).catch(function () {
        alert('Tente novamente!')
      })
    }
  }

  $API.user().then(function (res) {
    $scope.text = ''
    $scope.messages = []
    $scope.user = res
    $scope.kick = function (uid) {
      console.log(uid)
      if (confirm('Você tem certeza que deseja bloquear esse usuário?')) {
        $API.socket.kick($stateParams.id, uid)
      }
    }
    $scope.send = function () {
      if ($scope.text.trim()) {
        var obj = {
          user: $scope.user,
          message: $scope.text,
          time: moment().format('DD/MM/YYYY HH:mm'),
          room_id: $stateParams.id
        }
        $scope.messages.push(obj)
        $API.socket.message($stateParams.id, obj)
        $API.chat.insert(obj)
        $scope.text = ''
      }
    }
  })
  $API.socket.wait(function () {
    $API.socket.join($stateParams.id)
    $API.socket.onMessage(function (res) {
      $scope.messages.push(res)
    })
    $API.socket.onClose(function (res) {
      $API.socket.leave($stateParams.id)
      webrtc.leaveRoom()
      $state.go('home')
    })
    $API.socket.onKicked(function (res) {
      console.log('being kicked', $scope.user._id, res)
      if ($scope.user._id === res) {
        $API.socket.leave($stateParams.id)
        webrtc.leaveRoom()
        $state.go('home')
        $sdb.insert({ kicked: $stateParams.id })
        alert('Você foi bloqueado da sala')
      }
    })
  })
  webrtc = new SimpleWebRTC({
    localVideoEl: 'localVideo',
    remoteVideosEl: 'remotesVideos',
    autoRequestMedia: true
  })
  webrtc.on('readyToCall', function () {
    webrtc.joinRoom($stateParams.id)
  })
})
module.exports = app.name
