
module.exports = function(app){
	
	
	app.get('/graficos/candidatovaga/regiao', function(req, res){
		
		res.render('graficos/candidatovaga-por-regiao', {errosValidacao: {}});
	});
	
	app.get('/graficos/notaconceitoenade', function(req, res){
		
		res.render('graficos/nota-conceito-enade', {errosValidacao: {}});
	});
	
	app.get('/graficos/enem', function(req, res){
		
		res.render('graficos/enem', {errosValidacao: {}});
	});
	
	
}
