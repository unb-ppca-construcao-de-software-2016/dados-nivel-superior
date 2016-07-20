/**
 * http://usejsdoc.org/
 */

var express = require('../config/express')();
var request = require('supertest')(express);

describe('#Test para funcionalidades de Curso', function() {


	it('#buscando listagem para o curso ciências da computação', function(done) {
		request.post('/search').send({
			chaveDaBusca : 'ciências da computação'
		}).expect(200, done);
	});
	
	it('#teste com falha de busca de curso sem informar parâmetro de consulta', function(done) {
		request.post('/search').send({
			chaveDaBusca : ''
		}).expect(400, done);
	});
	
	it('#Verificando retorno da página principal da funcionalidade com parametros', function(done) {
		request.get('/contato').send({
			errosValidacaoContato: {}, 
			errosValidacao: {}, 
			email:{}
		}).expect(200, done);
	});
	
	it('#Verificando retorno da página principal da funcionalidade sem parametros', function(done) {
		request.get('/contato').send({}).expect(200, done);
	});
	
	it('#Enviando mensagem de contato sem informar nome', function(done) {
		request.post('/contato').send({
			assunto: "TDD",
			email: "testmail@mail.com",
			mensagem : "Test Mensagem"
		}).expect(400, done);
	});
	
	it('#Enviando mensagem de contato sem informar assunto', function(done) {
		request.post('/contato').send({
			nome : "Test Nome",
			email: "testmail@mail.com",
			mensagem : "Test Mensagem"
		}).expect(400, done);
	});

	it('#Enviando mensagem de contato sem informar email', function(done) {
		request.post('/contato').send({
			nome : "Test Nome",
			assunto: "TDD",
			mensagem : "Test Mensagem"
		}).expect(400, done);
	});
	
	it('#Enviando mensagem de contato sem informar mensagem', function(done) {
		request.post('/contato').send({
			nome : "Test Nome",
			assunto: "TDD",
			email: "testmail@mail.com"
		}).expect(400, done);
	});
	
	it('#Enviando mensagem de contato com sucesso', function(done) {
		request.post('/contato').send({
			nome : "Test Nome",
			assunto: "TDD",
			email: "testmail@mail.com",
			mensagem : "Test Mensagem"
		}).expect(200, done);
	});

});