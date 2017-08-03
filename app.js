const express = require('express')
const app = express()
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const path = require("path")
const validator = require('express-validator')
const session = require('express-session')


let username = "foobar"
let password = "helloworld"



app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(express.static(path.join(__dirname, 'static')));
app.use(validator())
app.use(session({
	secret: 'keyboard cat',
	resave: false, 
	saveUninitialized: true
}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


/////////How many hits////////////////
app.use(function(req, res, next){
	if (req.session.views) {
		req.session.views += 1
	} else {
		req.session.views = 1
	}

	next()
})


//////////if coming to / must check if logged in////////////////////////
app.get("/", function(req, res, next){
  	if (req.session.isloggedIn === true){
    	res.render("index",{username: username, views: req.session.views})
  } else { 
    	res.redirect ("/login")
  }

})

/////////if coming to /login page//////////////////////////////////////
app.get("/login",function(req,res,next){
 	res.render("login")

})


///////////validating username and password////////////////////////////
app.post("/login", function(req, res, next){
	if (req.body.username === username && req.body.password === password){
		req.session.isloggedIn = true
		res.redirect("/")
  } else {
		res.redirect("/login")
  }

})


app.listen(3000, function(){
	console.log("App running on port 3000")
})



////////If I wanted to make sure info entered is within parameters///////////////////

// app.post("/login", function(req, res, next){
// 	req.checkBody("username", "You must enter your username!").notEmpty()
// 	req.checkBody("password", "You must enter your password!").notEmpty()


// 	let errors = req.validationErrors()


// 	if (errors) {
// 		console.log(errors)
// 		res.send("Please enter your login info!")

// 	} else {

// 		users.push({
// 		username: req.body.username,
// 		password: req.body.password
// 	})

// 	console.log(users)
// 	res.redirect("/")

//     }

// })


