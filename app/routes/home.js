/**
 * Rotas relacionadas a pagina inicial
 */

module.exports = function(app){
	
	app.get('/', function(req, res, next){
		
		res.render('home/index', {errosValidacao: {}});
	});
	
	app.post('/search', function(req, res){

		var chaveDaBusca = req.body.chaveDaBusca;	
				
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

		var schemas = require('../infra/connectionFactory');
		var Curso = schemas.Curso;
		var Coordenadas = schemas.Coordenadas;
		var resultado = [];
		var paramRegex = new RegExp(chaveDaBusca, 'i');

		//Busca cursos com a expressao de busca que sejam de GRADUACAO e ATIVOS
		//Consulta por indice comentada por apresentar limitacao na busca de resultados
		//Curso.find({ $text: { $search: chaveDaBusca }, CO_NIVEL_ACADEMICO: 1, CO_SITUACAO_CURSO: 1}).sort({ CO_IES: 1, CO_MUNICIPIO_CURSO: 1, NO_CURSO: 1}).exec(function(err, instituicoes){	
		Curso.find().and([
							{CO_NIVEL_ACADEMICO: 1}, 
							{CO_SITUACAO_CURSO: 1}, 
							{
								$or: [
										{NO_IES: {$regex: paramRegex}}, 
										{NO_CURSO: {$regex: paramRegex}}, 
										{NO_MUNICIPIO_CURSO: {$regex: paramRegex}}
									]
							}
						])
			.sort({ 
						CO_IES: 1, 
						CO_MUNICIPIO_CURSO: 1, 
						NO_CURSO: 1
					})
			.exec(function(err, instituicoes){

			if(err) return console.log(err);			

			//Busca as coordenadas para o municipio
     		Coordenadas.find({}, function(err, coordenadas){
				if(err) return console.log(err);
		
				var coIES = null;
				var coMUNICIPIO = null;
				var cursosIES = [];
			
				instituicoes.forEach(function (instituicao) {
					//console.log('IES: '+instituicao.CO_IES+' CURSO('+instituicao.CO_CURSO+'): '+instituicao.NO_CURSO);
					
					//controle para construir apenas um objeto por IES/Municipio
					if (coIES == instituicao.CO_IES && coMUNICIPIO == instituicao.CO_MUNICIPIO_CURSO) {

						cursosIES.push({nome: instituicao.NO_CURSO, grau: instituicao.DS_GRAU_ACADEMICO});
					} else {

						coIES = instituicao.CO_IES;
						
						coMUNICIPIO = instituicao.CO_MUNICIPIO_CURSO;
						
						if (coMUNICIPIO) {
							
							cursosIES = [];
							
							cursosIES.push({nome: instituicao.NO_CURSO, grau: instituicao.DS_GRAU_ACADEMICO});
							
							var coordenada = getCoordenada(instituicao, coordenadas);
							
							if (coordenada) {

								var latitude = parseFloat(coordenada.latitude.replace(",","."));
								var longitude = parseFloat(coordenada.longitude.replace(",","."));

								resultado.push({
													nome: instituicao.NO_IES,
													categoria: instituicao.DS_CATEGORIA_ADMINISTRATIVA,									
													coord : {lat : latitude,  lng : longitude},
													cursos: cursosIES}
												);

								coordenada.latitude = ''+(latitude-0.005);
								coordenada.longitude = ''+(longitude-0.005);

							} else {

								console.log('Coordenada do CO_MUNICIPIO_CURSO nao encontrada: '+instituicao.CO_MUNICIPIO_CURSO);
							}

						} else {

							console.log('IES sem CO_MUNICIPIO_CURSO: '+instituicao.CO_IES);
						}
					}
				});
				
				res.render('dadosnivelsuperior/search', {resultado: resultado});
			});
		});
				
		
	});

	function getCoordenada(instituicao, coordenadas) {
		var coordenadaRet = null;
		for (var i = 0; i < coordenadas.length; i++) {
			if (instituicao.CO_MUNICIPIO_CURSO == coordenadas[i].co_municipio_curso) {
				coordenadaRet = coordenadas[i];
				break;
			}

		}
		return coordenadaRet;
	}
}