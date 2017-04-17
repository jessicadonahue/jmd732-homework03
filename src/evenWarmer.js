// evenWarmer.js
// create Request and Response constructors...

var fs = require('fs');


//Request object - takes http request string and parses out path
//param httpRequest - http request as string
function Request(httpRequest) {

	//Example Request:
	//GET /foo/bar.baz HTTP/1.1\r\nX-Header:Qux\r\n\r\n

	//Parse the httpRequest string
  	var requestParts = httpRequest.split(' ');

    // (1) get the path
    var path = requestParts[1];
    this.path = path;

    // (2) get the method
    var method = requestParts[0];
    this.method = method;

    // (3) get headers 
    var splitByLine = httpRequest.split("\r\n");
    var headersArray = splitByLine.slice(1, -2);

    //create header object
    var headers = {};
    this.headers = headers;

    for (var i = 0; i < headersArray.length; i++) {
        var miniArray = headersArray[i].split(": ");
        var headerName = miniArray[0];
        var headerValue = miniArray[1];
        headers[headerName] = headerValue;        
    }


    // (4) get body
    var body = splitByLine[splitByLine.length - 1];
    this.body = body;

    // (5) toString method
    this.toString = function () {
       
       var h = "";
        for (property in this.headers) {
            h+= property + ": " + this.headers[property] + "\r\n";
        }

        var reqString = this.method + " " + this.path + " HTTP/1.1\r\n" + h + "\r\n" + this.body;

        return reqString;
    }
	
}
                    

//var req = new Request(s);
//console.log(req.path);
//console.log(req.method);
//console.log(req.headers);
//console.log(req.body);
//console.log(req.toString());


//Response object - creates a new response object 
//using the socket passed in as an argument to send data to the client.
function Response(httpRequest) {

    //sock
    this.sock = httpRequest;

    //headers
    var headers = {};
    this.headers = headers;

    //body
    var body = "";
    this.body = body;

    //statusCode
    var statusCode;
    this.statusCode = statusCode;


    this.setHeader = function (name, value) {
        headers[name] = value;
    }

    this.write = function(data) {
        this.sock.write(data);

    }

    this.end = function(s) {
        this.sock.end(s);
    }

    this.send = function(statusCode, body) {
        this.statusCode = statusCode;
        this.body = body;

        var h = "";
        for (property in this.headers) {
            h+= property + ": " + this.headers[property] + "\r\n";
        }

        var s = "HTTP/1.1 " + statusCode + "\r\n" + h + "\r\n" + this.body;  
        this.end(s);

    }

    this.writeHead = function(statusCode) {
        this.statusCode = statusCode;

        var h = "";
        for (property in this.headers) {
            h+= property + ": " + this.headers[property] + "\r\n";
        }

        var s = "HTTP/1.1 " + statusCode + "\r\n" + h + "\r\n"; 
        this.write(s); 

    }

    this.redirect = function(statusCode, url) {
    	if (arguments.length === 1) {
    		this.statusCode = 301;
    		url = arguments[0];
    	}
    	else {
    		this.statusCode = statusCode;
    	}

    	this.setHeader("Location", url);
    	this.send(this.statusCode, this.body);

    }

    Response.prototype.sendFile = function(fileName) {
		// (1) Determine absolute path to the file
		var publicRoot = '/Users/fjdseven/Documents/github/jmd732-homework03/public';
		var filePath =  publicRoot + fileName;

		// (2) Use the extension of the file to determine: 
			// if its an image
			// figure out its Content-Type

		//get the extension ==> ["/css/base", "css"]
		var extArray = fileName.split(".");
		var extension = extArray[1]; // ==> "css"

		var contentType;
		this.contentType = contentType;


		if (extension === "jpeg" || extension === "jpg") {
			this.contentType = "image/jpeg";
		}
		else if (extension === "png") {
			this.contentType = "image/png";
		}
		else if (extension === "gif") {
			this.contentType = "image/gif";
		}
		else if (extension === "html") {
			this.contentType = "text/html";
		}
		else if (extension === "css") {
			this.contentType = "text/css";
		}
		else if (extension === "txt") {
			this.contentType = "text/plain";
		}

		
		var config;

		//readfile for an image
		if (extension === "jpeg" || extension === "jpg" || extension === "png" || extension === "gif") {
			config = {};
		}

		//readfile for text
		if (extension === "html" || extension === "css" || extension === "txt") {
			config = {encoding:'utf8'};
		}

		fs.readFile(filePath, config, this.handleRead.bind(this, contentType));

	}

	//callback for send file
	Response.prototype.handleRead = function(contentType, err, data) {

		if (err) {
			console.log(data);
			this.send(500, this.body);
		}
		else {
	    	this.setHeader("Content-Type", contentType);

	    	this.writeHead(200);
	    	this.write(data);
	    	this.end();
			
		}//endElse - no error
	}

    this.toString = function() {
    	var statusDescription = "";
    	if (this.statusCode === 200) {
    		statusDescription += "200 OK";
    	}
    	else if (this.statusCode === 404) {
    		statusDescription += "404 Not Found";

    	}
    	else if (this.statusCode === 500) {
    		statusDescription += "500 Internal Server Error";

    	}
    	else if (this.statusCode === 400) {
    		statusDescription += "400 Bad Request";

    	}
    	else if (this.statusCode === 301) {
    		statusDescription += "301 Moved Permanently";

    	}
    	else if (this.statusCode === 302) {
      		statusDescription += "302 Found";

    	}
    	else if (this.statusCode === 303) {
    		statusDescription += "303 See Other";

    	}

    	 var h = "";
        for (property in this.headers) {
            h+= property + ": " + this.headers[property] + "\r\n";
        }

        var s = "HTTP/1.1 " + statusDescription + "\r\n" + h + "\r\n" + this.body; 
        return s;
    	
    }

}

function App() {

	//Properties
	var server;
	this.server = net.createServer(this.handleConnection.bind(this));

	var routes = {};
	this.routes = routes;

	//Methods
	this.get = function(path, cb) {

		routes[path] = cb;
	}

	this.listen = function(port, host) {
		this.server.listen(port, host);
	}

	this.handleConnection = function(sock) {


	}

	this.handleRequestData = function(sock, binaryData) {

	}

	this.logResponse = function(req, res) {

	}



}

module.exports = {

    Request:Request,
    Response: Response
    


}

var net = require('net');
var HOST = '127.0.0.1';
var PORT = 8080;

//Object.assign(global, require('./evenWarmer.js'));

var server = net.createServer(function(sock) {

	sock.on('data', function(data) {

		var reqString = data + '';
		var req = new Request(reqString);

		var res = new Response(sock);

		if (req.path === "/") {

			res.setHeader("Content-Type", "text/html");
			res.send(200, '<link rel=\"stylesheet\" type=\"text/css\" href=\"/foo.css\"\><h2>this is a red header!</h2><em>Hello</em> <strong>World</strong>');

		}
		else if (req.path === "/foo.css") {
			res.setHeader("Content-Type", "text/css");
			res.send(200, 'h2 {color:red;}');

		}
		else if (req.path === "/test") {
			res.sendFile("/html/test.html")
		}
		else if (req.path === "/bmo1.gif") {
			res.sendFile("/img/bmo1.gif");
		}
		else {

			res.setHeader("Content-Type", "text/plain");
			res.send(404, 'uh oh... 404 page not found!');

		}

		//res.end();


	});
});

server.listen(PORT, HOST);
























