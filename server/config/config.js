var env = process.env.NODE_ENV || 'development';

if(env === 'development'){
	process.env.PORT = 3000;
	process.env.dbURI = 'mongodb://localhost:27017/PictureSaveApp';
}else if(env === 'test'){
	process.env.PORT = 3000;
	process.env.dbURI = 'mongodb://localhost:27017/PictureSaveAppTest';
}