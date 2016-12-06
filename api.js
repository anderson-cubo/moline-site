// JS
var angular = require('angular')
var app = angular.module('API', [
  require('angular-ui-router')
])
var _initialUrl = process.env.URL_API

app.factory('$API', function ($q, $http) {
  var _api = {
    initialUrl: function (_set) {
      if (_set) _initialUrl = _set
      return _initialUrl
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
    login: function (email, password) {
      return _api.crud('/user/login', null, {
        email: email,
        password: password
      })
    },
    register: function (obj) {
      return _api.crud('/user/register', null, obj)
    },
    user: function () {
      return _api.crud('/user')
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
    }
  }
  return _api
})
module.exports = app.name
