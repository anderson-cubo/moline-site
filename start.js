var spawn = require('child_process').spawn

var _spawn = function (what, ar, opt) {
  var ls = spawn(what, ar, opt)
  ls.stdout.on('data', (data) => {
    console.log(data.toString())
  })
  ls.stderr.on('data', (data) => {
    console.log(data.toString())
  })
  ls.on('close', (code) => {
    console.log(`child process exited with code ${code}`)
  })
  return ls
}

var el = [
  _spawn('webpack', ['--watch', '-d']),
  _spawn('lr-http-server', { cwd: __dirname + '/public' })
]
process.on('exit', (code) => {
  el.forEach(function (res) {
    res.exit()
  })
})
