/**
 * Rotas relacionadas a pagina inicial
 */

module.exports = function(app){
	
	app.get('/', function(req, res, next){
		
		res.render('home/index', {errosValidacao: {}});
	});
	
	app.post('/search', function(req, res){
		
		var chaveDaBusca = req.body;	
		
		req.assert('chaveDaBusca', 'Informe algum valor para realizar a pesquisa!').notEmpty();
		
		var erros = req.validationErrors();
		
		if(erros){
			res.format({
				html: function(){	
					
					res.status(400).render('home/',  {errosValidacao: erros});
				}, 
				
				json: function(){
					res.status(400).json(erros);
				}
			});

			return;
		}
		
		res.redirect('/dadosnivelsuperior/search');		

		
	});
}