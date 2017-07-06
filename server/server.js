require('./config/config.js');

const _ = require('lodash');
const express = require('express')
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js');
const {Picture} = require('./models/picture');

var app = express();

app.use(bodyParser.json());

// Routes

app.post('/picture', (req, res) =>{

	// Save picture

	var picture = new Picture({
		URL:req.body.URL,
		category:req.body.category,
		description:req.body.description
	});

	picture.save().then((doc)=>{
		res.send(doc);
	}, (e) =>{
		res.status(400).send(e);
	});

});

app.delete('/picture/:id',(req, res)=>{
	var id = req.params.id;

	if(!ObjectID.isValid(id)){
		return res.status(404).send();
	}

	Picture.findByIdAndRemove(id).then((picture)=>{
		if(picture == null){
			return res.status(404).send();
		}
		res.send({picture});
	}).catch((e)=>{
		return res.status(400).send();
	});

});

app.get('/pictures/:category', (req, res) =>{

	// Get pictures by category

	var category = req.params.category;

	Picture.find({category}).then((pictures) =>{
		res.send({pictures})
	}, (e) => {
		res.status(400).send(e);
	})

});

app.get('/pictures', (req, res) =>{

	// Get all pictures

	Picture.find().limit(20).then((pictures) =>{
		res.send({pictures})
	}, (e) => {
		res.status(400).send(e);
	})

});

app.get('/categories', (req, res) =>{

	// Get all categories inside picture collection

	Picture.distinct('category', (error, results) =>{
		if(error){
			return res.status(404).send(e);
		}
		res.send({results})
	}, (e) => {
		res.status(400).send(e);
	})

});



// app.get('/todos', (req, res) =>{

// });

// app.get('/todos/:id', (req, res)=>{


// });

// app.delete('/todos/:id',(req, res)=>{


// });

// app.patch('/todos/:id', (req, res)=>{

// });

if(process.env.NODE_ENV == 'production'){

	process.env.PWD = process.cwd();
	app.set('views', path.join(process.env.PWD, 'public'));
	app.use(express.static(path.join(process.env.PWD, 'public')));
	app.get('*', (req, res) => {
		res.sendFile(path.join(process.env.PWD, 'public/index.html'));
	})

}else{

	app.use(express.static(__dirname + '/public/'));
	app.get('*', (req, res) => {
		res.sendFile(__dirname + '/public/index.html');
	})
	
}


app.listen(process.env.PORT, () => {
	console.log('Started on port ', process.env.PORT);
});

module.exports = {app};