/**
 * http://usejsdoc.org/
 */

var express = require('../config/express')();
var request = require('supertest')(express);

describe('#Test para funcionalidades de Curso', function() {


	it('#buscando listagem para o curso medicina', function(done) {
		request.post('/search').send({
			chaveDaBusca : 'medicina'
		}).expect(200, done);
	});

});