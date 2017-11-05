const Server = require('server')
const { get, socket } = require('server/router')
const { render } = require('server/reply')

Server([get('/', _context => render('public/index.html'))])
