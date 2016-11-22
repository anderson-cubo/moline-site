var Static = require('node-static')
var webpack = require('webpack')
var compiler = webpack({})

compiler.run(function () {
  console.log('compiler', arguments)
})
var file = new Static.Server('./public')
require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume()
}).listen(process.env.PORT || 9800)
