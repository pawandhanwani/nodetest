const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var mysql = require('mysql');
const PORT = process.env.PORT || 5000;

var con = mysql.createConnection({
	host : "localhost",
	user : "root",
	password : "",
	database : "nodedb",
})

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname, 'public')));
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(cookieParser());
app.use(expressSession({
    secret: 'mYsEcReTkEy',
    resave: true,
    saveUninitialized: true
}));// I haven't used the session store

//setting session

con.connect();

function addUser(email,password)
{
		var sql= 'INSERT INTO users (email,password) VALUES ("'+email+'", "'+password+'");';
		con.query(sql,function(err,res){
		if(err) throw err;
		console.log("It Worked...");
		});
	
}

function authenticate(email,password) {
		var sql= `SELECT id FROM users WHERE email="${email}" AND password = "${password}"`;
		console.log(sql);
		con.query(sql,function(err,res,fields){
			console.log(res);
			if(res.length>0)
			{
				return true;
			}
			else
			{
				return false;
			}
		});
	//console.log("Connected..");*/
}

app.post('/login', function(req,res){
	if(authenticate(req.body.email,req.body.pass))
	{
  		req.session.userId = req.body.email;
  		var id=req.session.userId;
		res.render('dashboard',{
    	message: req.session.userId,
    	});	
    }
    else
    {
    	res.render('login');
    }
});

//getting session

app.get('/login', function(req,res){
	if(req.session.userId)
	{	
		var id=req.session.userId;
		res.render('dashboard',{
    	message: id,
    	});	
	}
	else
	{
		res.render('login');
	}
  /*var id=req.session.userId;
  console.log("Hello",id);
  res.render('login');*/
});

app.get('/logout',function(req,res){
	delete req.session.userId;
	res.render('login');
});

app.get('/signup',function(req,res) {
	res.render('signup');
});

app.post('/signup',function(req,res) {
	addUser(req.body.email,req.body.pass);
	res.render('login');
});

app.listen(PORT , () => console.log('Server Running'));	
