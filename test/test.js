/*var schemas = require('../app/infra/connectionFactory');
var curso = schemas.Curso;
var rslt = [];
var prmrgx = new RegExp('ciencia da computacao', 'i');

var assert = require('chai').assert;

describe('Curso', function() {
	describe('find', function() {
		it('deve retornar objeto curso com a expressao buscada que sejam de graduacao e ativos', function(){
			assert.equal(curso.find().and([
				{CO_NIVEL_ACADEMICO: 1},
				{CO_SITUACAO_CURSO: 1},
				{$or:[
					{NO_IES: {$regex: prmrgx}},
					{NO_CURSO: {$regex: prmrgx}},
					{NO_MUNICIPIO_CURSO: {$regex: prmrgx}}
				]}
			]).sort({
				CO_IES: 1,
				CO_MUNICIPIO_CURSO: 1,
				NO_CURSO: 1
			}), !null)
		});
	});
	describe('naprem', function(){
		it('deve substituir nao aplicavel no texto do resultado por Area basica de ingresso', function(){
			assert.equal(naprem('qualquer coisa(Nâo Aplicável)'), 'qualquer coisa, área básica de ingresso')}
		)}
	);
});
*/