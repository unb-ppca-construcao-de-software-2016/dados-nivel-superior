var app = require('./config/express')();

var http = require('http').Server(app);

//Caso não tenha porta definida na variável de ambiente(definida pelo heroku), usa a 8080
var port = process.env.PORT || 8080;

http.listen(port, function(){
	console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')  + ' >>>> Servidor moendo na porta '+port+'... manda bala! =)');
});