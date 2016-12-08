// JS
var angular = require('angular')
var $ = require('jquery')
var app = angular.module('API', [
  require('angular-ui-router')
])
var _initialUrl = process.env.URL_API
var socket = null
app.factory('$API', function ($q, $http, $timeout, Upload) {
  var _api = {
    initialUrl: function (_set) {
      if (_set) _initialUrl = _set
      return _initialUrl
    },
    socket: {
      start: function () {
        $.getScript(_api.initialUrl() + '/socket.io/socket.io.js')
        .done(function () {
          socket = io(_api.initialUrl())
        })
      },
      wait: function (done) {
        if (socket == null) {
          setTimeout(function () {
            _api.socket.wait(done)
          }, 400)
        } else {
          done()
        }
      },
      join: function (room) {
        socket.emit('join', room)
      },
      leave: function (room) {
        socket.emit('leave', room)
      },
      close: function (room) {
        socket.emit('close', room)
      },
      message: function (room, obj) {
        socket.emit('message', room, obj)
      },
      kick: function (room, userID) {
        socket.emit('kick', room, userID)
      },
      onMessage: function (cback) {
        socket.on('message', function (obj) {
          $timeout(function () {
            cback(obj)
          })
        })
      },
      onClose: function (cback) {
        socket.on('close', function (obj) {
          $timeout(function () {
            cback(obj)
          })
        })
      },
      onKicked: function (cback) {
        socket.on('kicked', function (obj) {
          $timeout(function () {
            cback(obj)
          })
        })
      }
    },
    crud: function (url, id, data, params, toDelete) {
      return $q(function (resolve, reject) {
        $http({
          url: _api.initialUrl() + url + (id ? ('/' + id) : ''),
          method: toDelete ? 'DELETE' : (data && id) ? 'PUT' : (data ? 'POST' : 'GET'),
          data: JSON.stringify(data),
          params: params,
          withCredentials: true
        }).then(function (res) {
          if (res.data.error) {
            reject(res.data)
          } else {
            resolve(res.data)
          }
        }).catch(function (err) {
          reject(err)
        })
      })
    },
    upload: function (file) {
      return Upload.upload({
        url: _api.initialUrl() + '/upload',
        withCredentials: true,
        data: { file: file }
      })
    },
    login: function (email, password) {
      return _api.crud('/user/login', null, {
        email: email,
        password: password
      })
    },
    register: function (obj) {
      return _api.crud('/user/register', null, obj)
    },
    user: function (id, data) {
      return _api.crud('/user', id, data)
    },
    room: {
      create: function (obj) { return _api.crud('/room', null, obj) },
      get: function (id, params) { return _api.crud('/room', id, null, params) },
      remove: function (id) { return _api.crud('/room', id, null, null, true) }
    },
    joined: {
      create: function (obj) { return _api.crud('/joined', null, obj) },
      get: function (id, params) { return _api.crud('/joined', id, null, params) },
      remove: function (id) { return _api.crud('/joined', id, null, null, true) }
    },
    chat: {
      insert: function (obj) { return _api.crud('/chat', null, obj) }
    }
  }
  return _api
})
module.exports = app.name
