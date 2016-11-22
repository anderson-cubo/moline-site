var Static = require('node-static')
var file = new Static.Server('./public')
require('http').createServer(function (request, response) {
  request.addListener('end', function () {
    file.serve(request, response)
  }).resume()
}).listen(process.env.PORT || 9800)
