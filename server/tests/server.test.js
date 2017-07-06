const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Picture} = require('./../models/picture');

const pictures = [{
	_id: new ObjectID(),
	URL: 'http://i.imgur.com/SxXlEbB.jpg',
	description:'A bird.',
	category:'Birds'
}, {
	_id: new ObjectID(),
	URL: 'http://i.imgur.com/LRoLTlK.jpg',
	description: 'Dog on couch with piles of money.',
	category: 'Dogs'
}
];

beforeEach((done)=>{
	Picture.remove({}).then(()=> {
		return Picture.insertMany(pictures);
	}).then(()=>done());
});

describe('POST /picture', () =>{

	it('Single picture', (done) => {

		var newPicture = {
			URL: 'http://i.imgur.com/H37kxPH.jpg',
			description: 'Army dog',
			category: 'Dogs'
		};

		request(app)
		.post('/picture')
		.send(newPicture)
		.expect(200)
		.expect((res) =>{
			expect(res.body.URL).toBe(newPicture.URL);
		})
		.end(done);

	});

});

describe('DELETE /picture', () =>{

	it('Single picture deletion', (done) => {
		var hexID = pictures[1]._id.toHexString();
		request(app)
		.delete(`/picture/${hexID}`)
		.expect(200)
		.expect((res) =>{
			expect(res.body.picture._id).toBe(hexID);
		})
		.end((err, res)=>{
			if(err){
				return done(err);
			}
			Picture.findById(hexID).then((picture) => {
				expect(picture).toNotExist();
				done();
			}).catch((e) => done(e));
		})
	});

});

describe('Get /pictures', () =>{

	it('All pictures', (done) =>{
		request(app)
		.get('/pictures')
		.expect(200)
		.expect((res) =>{
			expect(res.body.pictures.length).toBe(2);
		})
		.end(done);
	});

});

describe('Get /pictures/:category', () =>{

	it('Picture by category', (done) =>{
		request(app)
		.get(`/pictures/${pictures[0].category}`)
		.expect(200)
		.expect((res) =>{
			expect(res.body.pictures[0].description).toBe(pictures[0].description);
		})
		.end(done);
	});

});

describe('Get /categories', () =>{

	it('All categories', (done) =>{
		request(app)
		.get('/categories')
		.expect(200)
		.expect((res) =>{
			expect(res.body.results.length).toBe(2);
		})
		.end(done);
	});

});

