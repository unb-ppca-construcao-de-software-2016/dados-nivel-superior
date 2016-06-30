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

		// Alterar definicao estatica de array por chamada de consulta ao banco
		var resultado = [{nome:'Universidade de Brasília - UnB',
				coord : {lat : -15.7633, lng : -47.8702},
				cursos: [{nome:'Matematica'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Zootecnia'}]},
				{nome:'Centro Universitario de Brasília - CEUB',
				coord : {lat : -15.7670, lng : -47.8957},
				cursos: [{nome:'Letras'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Processamento de Dados'}]},
				{nome:'Universidade Catolica de Brasília - UCB',
				coord : {lat : -15.8658, lng : -48.0328},
				cursos: [{nome:'Biologia'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Terapia Ocupacional'}]}];
		
		//res.redirect('/dadosnivelsuperior/search');		
		res.render('dadosnivelsuperior/search', {resultado: resultado});		
		
	});
}