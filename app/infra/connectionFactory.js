var mongoose = require('mongoose');

var connectMongoose = function() {
	if (!process.env.NODE_ENV) {
		
		return mongoose.connect('mongodb://localhost/dadosnivelsuperior');
	}

//	if (process.env.NODE_ENV == 'production') {
//		
//		return mongoose.connect('mongodb://localhost/myappdatabase');
//	}

	if (process.env.NODE_ENV == 'test') {
		
		return mongoose.connect('mongodb://localhost/test');
	}
	
}

// Wrapper: Feito desta forma para que a inicialização seja tardia da conexão
module.exports = function() {
	return connectMongoose;
}