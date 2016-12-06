// CSS
require('./style.css')
require('angular-moment-picker/dist/angular-moment-picker.css')
require('angular-moment-picker/dist/angular-moment-picker.js')
// JS
var angular = require('angular')
var moment = require('moment-timezone')
window.moment = moment
var _ = require('lodash')
var app = angular.module('home', [
  require('angular-ui-router'),
  'moment-picker'
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
  $scope.day = moment()
  $scope.user = {}
  $scope.filters = {
    which: 'today',
    date: moment().format('DD/MM/YYYY')
  }
  $scope.room = {
    name: null,
    desc: null,
    course: null,
    date: null,
    quantity: null
  }
  $scope.rooms = []
  $scope.coursesList = require('../../misc/lista_de_cursos.json')
  $scope.filter = function (which, what) {
    if (which) {
      $scope.filters[which] = what
    }
    $scope.load()
  }
  $scope.createRoom = function () {
    var _room = _.clone($scope.room)
    if (_room.error !== void (0)) delete _room.error
    for (var key in _room) {
      if (!_room[key]) {
        $scope.room.error = 'Preencha todos os campos!'
        return void (0)
      }
    }
    _room.user = _.clone($scope.user)
    _room.date = moment(_room.date, 'DD/MM/YYYY HH:mm').toDate()
    _room.user.password = void (0)
    $API.room.create(_room).then(function (res) {
      alert('Sucesso sua sala foi criada!')
      for (var key in $scope.room) {
        $scope.room[key] = null
        $scope.load()
      }
    })
  }
  $scope.removeRoom =  function (id) {
    $API.room.remove(id).then(function () {
      alert('Sucesso sua sala foi excluida!')
      $scope.load()
    }).catch(function () {
      alert('Oops houve algum erro.')
    })
  }

  $scope.join = function (val) {
    $API.joined.create({
      room_id: val._id
    })
    val.joined = true
  }

  $scope.load = function () {
    var filters = _.clone($scope.filters)
    if (filters.which) {
      if (filters.which === 'course') {
        filters.filterCourse = $scope.user.course
      } else if (filters.which === 'today') {
        filters.filterDate = moment().format('DD/MM/YYYY')
      } else if (filters.which === 'date') {
        filters.filterDate = moment(filters.date).format('DD/MM/YYYY')
      } else if (filters.which === 'mine') {
        if ($scope.user.is_teacher) {
          filters.filterUserId = $scope.user._id
        } else {
          $API.joined.get(null, {
            filterUserId: $scope.user._id
          }).then(function (data) {
            $scope.rooms = []
            data.forEach(function (data) {
              $API.room.get(data.room_id).then(function (data) {
                data.joined = true
                data.today = moment(data.date).isSame(moment(), 'day')
                $scope.rooms.push(data)
              })
            })
          })
          return void (0)
        }
      }
      delete filters.which
      delete filters.date
    }
    $API.room.get(null, filters).then(function (data) {
      $scope.rooms = data
      $scope.rooms.forEach(function (data, i) {
        $scope.rooms[i].today = moment(data.date).isSame(moment(), 'day')
        $API.joined.get(null, {
          filterUserId: $scope.user._id,
          filterRoomId: data._id
        }).then(function (data) {
          $scope.rooms[i].joined = !!data.length
        })
        $API.joined.get(null, {
          filterRoomId: data._id
        }).then(function (data) {
          $scope.rooms[i]._quantity = data.length
        })
      })
    })
  }
  $API.user().then(function (res) {
    $scope.user = res
  })
  $scope.load()
})

module.exports = app.name
