
module.exports = function(app){
	
	
	app.get('/dadosnivelsuperior/search', function(req, res){
		
		res.render('dadosnivelsuperior/search', {chaveDaBusca:{}});
	});
	
	
}
