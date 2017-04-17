// warmUp.js

var net = require('net');
var HOST = '127.0.0.1';
var PORT = 8080;

Object.assign(global, require('./evenWarmer.js'));

var server = net.createServer(function(sock) {

	sock.on('data', function(data) {

		var reqString = data + '';
		var req = new Request(reqString);

		if (req.path === "/") {
			sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n\r\n<link rel=\"stylesheet\" type=\"text/css\" href=\"/foo.css\"\><h2>this is a red header!</h2><em>Hello</em> <strong>World</strong>'); 

		}
		else if (req.path === "/foo.css") {
			sock.write('HTTP/1.1 200 OK\r\nContent-Type: text/css\r\n\r\nh2 {color:red;}'); 

		}
		else {
			sock.write('HTTP/1.1 404 Not Found\r\nContent-Type: text/plain\r\n\r\nuh oh... 404 page not found!'); 

		}

		sock.end();

	});
});

server.listen(PORT, HOST);

















