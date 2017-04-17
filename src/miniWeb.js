// miniWeb.js
// define your Request, Response and App objects here

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
}//end request object 

// (5) toString method
Request.prototype.toString = function () {
   
   var h = "";
    for (property in this.headers) {
        h+= property + ": " + this.headers[property] + "\r\n";
    }

    var reqString = this.method + " " + this.path + " HTTP/1.1\r\n" + h + "\r\n" + this.body;

    return reqString;
}
                    

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
}//end Response object


Response.prototype.setHeader = function (name, value) {
    this.headers[name] = value;
}

Response.prototype.write = function(data) {
    this.sock.write(data);

}

Response.prototype.end = function(s) {
    this.sock.end(s);
}

Response.prototype.send = function(statusCode, body) {
    this.statusCode = statusCode;
    this.body = body;

    var h = "";
    for (property in this.headers) {
        h+= property + ": " + this.headers[property] + "\r\n";
    }

    var s = "HTTP/1.1 " + statusCode + "\r\n" + h + "\r\n" + this.body;  
    this.end(s);

}

Response.prototype.writeHead = function(statusCode) {
    this.statusCode = statusCode;

    var h = "";
    for (property in this.headers) {
        h+= property + ": " + this.headers[property] + "\r\n";
    }

    var s = "HTTP/1.1 " + statusCode + "\r\n" + h + "\r\n"; 
    this.write(s); 

}

Response.prototype.redirect = function(statusCode, url) {
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

	fs.readFile(filePath, config, this.handleRead.bind(this, this.contentType));

}

//callback for send file
Response.prototype.handleRead = function(contentType, err, data) {

	if (err) {
		//console.log(data);
		this.send(500, this.body);
	}
	else {
    	this.setHeader("Content-Type", contentType);

    	this.writeHead(200);
    	this.write(data);
    	this.end();
		
	}//endElse - no error
}

Response.prototype.toString = function() {
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

function App() {

	//Properties
	this.server = net.createServer(this.handleConnection.bind(this));

	this.routes = {};
}

//Methods
App.prototype.get = function(path, cb) {

	this.routes[path] = cb;
}

App.prototype.listen = function(port, host) {
	this.server.listen(port, host);
}

App.prototype.handleConnection = function(sock) {
	sock.on('data', this.handleRequestData.bind(this, sock));
}

App.prototype.handleRequestData = function(sock, binaryData) {

	// 1. convert incoming data to a string
	var reqString = binaryData + '';

	// 2. create a new Request object based on that string
	var req = new Request(reqString);

	// 3. create a new Response
	var res = new Response(sock);

	// 4. sets a callback for when the connection is closed -> logResponse
	sock.on('close', this.logResponse.bind(this, req, res));

	// 5. determine if the request is valid by checking for a host header
	//    --> if it doesnt have a Host then return 400
	if (req.headers.hasOwnProperty("Host")) {

	} 
	else {
		res.send(400, "Bad Request");
	}

	if (this.routes.hasOwnProperty(req.path)) {
		// 6. look up the function to call in this.routes
		var functionRoutes = this.routes[req.path];
		// 7. call that^ function passing in the request and response objects
		functionRoutes(req, res);

	}
	else {

		// 8. if the path doesn't exist in this.routes -> send 404
		res.send(404, "404 Not found");
	}




}

App.prototype.logResponse = function(req, res) {
	
	var statusDescription = "";
	if (res.statusCode === 200) {
		statusDescription += "200 OK";
	}
	else if (res.statusCode === 404) {
		statusDescription += "404 Not Found";

	}
	else if (res.statusCode === 500) {
		statusDescription += "500 Internal Server Error";

	}
	else if (res.statusCode === 400) {
		statusDescription += "400 Bad Request";

	}
	else if (res.statusCode === 301) {
		statusDescription += "301 Moved Permanently";

	}
	else if (res.statusCode === 302) {
  		statusDescription += "302 Found";

	}
	else if (res.statusCode === 303) {
		statusDescription += "303 See Other";

	} 
	var s = req.method + " " + req.path + " - "+ statusDescription; 
	console.log(s);

}




var net = require('net');


module.exports = {

    Request:Request,
    Response: Response,
    App: App
    
}

























