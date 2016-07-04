/**
 * Rotas relacionadas a pagina inicial
 */

module.exports = function(app){
	
	app.get('/', function(req, res, next){
		
		res.render('home/index', {errosValidacao: {}});
	});
	
	app.post('/search', function(req, res){

		var chaveDaBusca = req.body.chaveDaBusca;	
		console.log('Buscando: ' + chaveDaBusca);
		
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
		
		Curso.find({ $text: { $search: chaveDaBusca }}).sort({ CO_IES: 1, CO_MUNICIPIO_CURSO: 1, NO_CURSO: 1}).exec(function(err, instituicoes){
			if(err) return console.log(err);			

			//Busca as coordenadas para o municipio
     		Coordenadas.find({}, function(err, coordenadas){
				if(err) return console.log(err);
		
				var coIES = null;
				var coMUNICIPIO = null;
				var cursosIES = [];
			
				instituicoes.forEach(function (instituicao) {
					console.log('IES: '+instituicao.CO_IES+' CURSO('+instituicao.CO_CURSO+'): '+instituicao.NO_CURSO);
					
					//controle para construir apenas um objeto por IES/Municipio
					if (coIES == instituicao.CO_IES && coMUNICIPIO == instituicao.CO_MUNICIPIO_CURSO) {
						cursosIES.push({nome: instituicao.NO_CURSO});
					} else {
						coIES = instituicao.CO_IES;
						coMUNICIPIO = instituicao.CO_MUNICIPIO_CURSO;
						if (coMUNICIPIO) {
							cursosIES = [];
							cursosIES.push({nome: instituicao.NO_CURSO});
							var coordenada = getCoordenada(instituicao, coordenadas);
							if (coordenada) {
								var latitude = parseFloat(coordenada.latitude.replace(",","."));
								var longitude = parseFloat(coordenada.longitude.replace(",","."));
								resultado.push({nome: instituicao.NO_IES,
									coord : {lat : latitude, 
											 lng : longitude},
									cursos: cursosIES}
									);
								coordenada.latitude = ''+(latitude-0.005);
								coordenada.longitude = ''+(longitude-0.005);
								//console.log('resultado');
							} else {
								console.log('Coordenada do CO_MUNICIPIO_CURSO nao encontrada: '+instituicao.CO_MUNICIPIO_CURSO);
							}

						} else {
							console.log('IES sem CO_MUNICIPIO_CURSO: '+instituicao.CO_IES);
						}
					}
				});
				//console.log(resultado);
				res.render('dadosnivelsuperior/search', {resultado: resultado});
			});
		});

		/*
		Curso.find({ $text: { $search: chaveDaBusca }}).sort({ CO_IES: 1, NO_CURSO: 1}).exec(function(err, instituicoes){
			if(err) return console.log(err);			
			var coIES = null;
			var cursosIES = [];
			instituicoes.forEach(function (instituicao) {
				console.log('IES: '+instituicao.CO_IES+' CURSO: '+instituicao.NO_CURSO);
				if (coIES == instituicao.CO_IES) {
					cursosIES.push({nome: instituicao.NO_CURSO});
				} else {
					coIES = instituicao.CO_IES;
					if (instituicao.CO_MUNICIPIO_CURSO) {
						cursosIES = [];
						cursosIES.push({nome: instituicao.NO_CURSO});
						//Busca as coordenadas para o municipio
			     		Coordenadas.findOne({co_municipio_curso: instituicao.CO_MUNICIPIO_CURSO}, function(err, coordenadas){
							if(err) return console.log(err);
							if(coordenadas) {
								resultado.push({nome: instituicao.NO_IES,
									coord : {lat : parseFloat(coordenadas.latitude.replace(",",".")), 
											 lng : parseFloat(coordenadas.longitude.replace(",","."))},
									cursos: cursosIES}
									);
								console.log('resultado');
							} else {
								console.log('Coordenada do CO_MUNICIPIO_CURSO nao encontrada: '+instituicao.CO_MUNICIPIO_CURSO);
							}
						});
					} else {
						console.log('IES sem CO_MUNICIPIO_CURSO: '+instituicao.CO_IES);
					}
				}
			});
			console.log('RETORNANDO!');
			console.log(resultado);
			res.render('dadosnivelsuperior/search', {resultado: resultado});
		});
		*/

		/*
		resultado = [{nome:'Universidade de Brasília - UnB',
				coord : {lat : -15.7633, lng : -47.8702},
				cursos: [{nome:'Matematica'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Zootecnia'}]},
				{nome:'Centro Universitario de Brasília - CEUB',
				coord : {lat : -15.7670, lng : -47.8957},
				cursos: [{nome:'Letras'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Processamento de Dados'}]},
				{nome:'Universidade Catolica de Brasília - UCB',
				coord : {lat : -15.8658, lng : -48.0328},
				cursos: [{nome:'Biologia'},{nome:'Medicina'},{nome:'Pedagogia'},{nome:'Terapia Ocupacional'}]}];
		*/
		//res.redirect('/dadosnivelsuperior/search');		
		//res.render('dadosnivelsuperior/search', {resultado: resultado});		
		
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