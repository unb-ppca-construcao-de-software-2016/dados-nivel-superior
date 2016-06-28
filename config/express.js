/**
 * Este arquivo contem as configuracoes globais do projeto referente ao contexto
 * do Express
 */

var express = require('express');
var load = require('express-load');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

module.exports = function() {
	var app = express();

	app.use(express.static('./app/public'));
	// Adicionando configuração para o express
	app.set('view engine', 'ejs')
	app.set('views', './app/views');

	// Ajustando para que o body-parser faça o parser entre (node <-> html)
	// basicamente.
	// Esta parte se comporta como middleware para alterar as requests, por
	// exenplo[Voce do java, lembre-se dos interceptors].
	app.use(bodyParser.urlencoded({
		extended : true
	}));

	// Ajustando para receber dados em JSON. Mais um middleware adicionado.
	// hahaha
	app.use(bodyParser.json());

	// Adicionando validação do Express
	app.use(expressValidator());

	// Carregamento de modulos a partir do diretorio APP
	load('routes', {
		cwd : 'app'
	}).then('infra').into(app);

	// Middlewares para tratar redirecionamento para páginas de erro
	app.use(function(req, res, next) {
		res.status(404).render('erros/404');
		next();
	});
	app.use(function(error, req, res, next) {
		if (process.env.NODE_ENV == 'production') {
			res.status(500).render('erros/500');
			return;
		}

		next(error);
	});

	return app;
}