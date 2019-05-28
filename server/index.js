const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const morgan = require('morgan');
const User = require('./models/Users');
const {authenticate} = require('./services')

//Basic auth
const basicAuth = require('./basic');
//JWT
const {verifyToken,createToken} = require('./JWT');


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

mongoose.connect('mongodb://db:27017/resthub',{useNewUrlParser: true });


app.get('/', (req, res) => res.send('Hello World wit Express'));

app.post('/signup',(req,res) => {
	User.create(req.body).then(user => res.status(200).json(user))
						.catch(err => res.status(400).json(err));
	
});

app.post('/login/jwt',async (req,res) => {

	const user = await authenticate(req.body).catch((err) => res.status(400).json(err))
	const token = createToken(user);
	res.status(200).json({token});

});


app.get('/users/basic',basicAuth,async(req,res) => {
	const users =  await User.find();
	res.status(200).json(users);
});

app.get('/users/jwt',verifyToken,async(req,res) => {
	const users =  await User.find();
	res.status(200).json(users);
});





module.exports =  app;