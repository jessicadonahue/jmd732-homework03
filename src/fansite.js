// fansite.js
// create your own fansite using your miniWeb framework

var App = require('./miniWeb.js').App;
var app = new App();

//Home page that has an image and uses a stylesheet (link to "/css/base.css")
app.get("/", function(req, res) {

	res.setHeader("Content-Type", "text/html");
	res.send(200, '<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/base.css\"\><h1>Welcome to my Harry Potter Fan Site</h1> <a href="/home">Home</a> <a href="/about">About</a> <a href="/rando">Rando</a> <img src="/harryHome.jpg" alt="Harry" height="300" width="500">');

})

app.get("/harryHome.jpg", function(req, res) {

	res.sendFile('/harryHome.jpg');

})

//A page that has an h1 header somewhere in the markup
app.get("/about", function(req, res) {

	res.setHeader("Content-Type", "text/html");
	res.send(200, '<link rel=\"stylesheet\" type=\"text/css\" href=\"/css/base.css\"\><h1>About Harry Potter</h1> <a href="/home">Home</a> <a href="/about">About</a> <a href="/rando">Rando</a> <h4>This site is all about Harry Potter, the central character in the series "Harry Potter." Harry is not an oridinary boy, he\'s a wizard! He begins to discover at the young age of eleven that he has special powers, something his "Muggle" peers lack. </h4>');

})

//The css that the homepage should use
app.get("/css/base.css", function(req, res) {

	res.setHeader("Content-Type", "text/css");
	res.send(200, 'h4 { width: 500px; margin: auto; text-align: center; padding: 30px; }a:hover { color: red;  }  a { color: white; text-decoration: none; margin: 0 auto; display:block; text-align: center; }img { display: block; margin: auto; padding: 30px;}h1 { color: white; text-align: center; border-style: solid; border-width: 5px; border-color: white; padding: 20px;} body { color: white; font-family: "Gill Sans", "Times New Roman", Times, serif; background: black;}');

})

//A page that displays a random image - the server will geerate a random image url
app.get("/rando", function(req, res) {
	
	res.sendFile("/rando.html")

})

//display image
app.get("/image1.jpg", function(req, res) {


	res.sendFile('/image1.jpg');

})

//display image
app.get("/image2.png", function(req, res) {

	res.sendFile('/image2.png');

})


//display image
app.get("/image3.gif", function(req, res) {

	res.sendFile('/image3.gif');


})


// "/home" gets redirected (301) to "/"
app.get("/home", function(req, res) {

	res.redirect(301, "/")

})

//redirect trailing slashes 
// "/home" gets redirected (301) to "/"
app.get("/home/", function(req, res) {

	res.redirect(301, "/")

})

// "/home" gets redirected (301) to "/"
app.get("/about/", function(req, res) {

	res.redirect(301, "/about")

})

// "/home" gets redirected (301) to "/"
app.get("/rando/", function(req, res) {

	res.redirect(301, "/rando")

})


app.listen(8080, '127.0.0.1');








