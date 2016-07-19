/**
 * Rotas relacionadas a pagina inicial
 */

module.exports = function(app){
	
	app.get('/', function(req, res, next){
		
		res.render('home/index', {errosValidacao: {}});
	});
	
	app.post('/search', function(req, res){

		var chaveDaBusca = req.body.chaveDaBusca.trim().toLowerCase();
		
		var chaveDaBuscaOriginal = chaveDaBusca;
		
		var mapObj = {
           a:"[aáàãâ]",
           e:"[eéê]",
           i:"[ií]",
           o:"[oôóõ]",
           u:"[uú]",
           c:"[cç]"
        };

        var re = new RegExp(Object.keys(mapObj).join("|"),"g");
        
        chaveDaBusca = chaveDaBusca.replace(re, function(matched){
        
        	return mapObj[matched];
        });	

		req.assert('chaveDaBusca', 'Informe algum valor para realizar a pesquisa!').notEmpty();
		
		var erros = req.validationErrors();
		
		if(erros){
			res.format({
				html: function(){	
					
					res.status(400).render('home/',  {errosValidacao: erros, chaveDaBusca: chaveDaBuscaOriginal});
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
		var Igc = schemas.Igc;
		var Enade = schemas.Enade;
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
					var coIES = null;
					var coMUNICIPIO = null;
					var cursosIES = [];
	
					Igc.find({}, function(err, igcs){
						
						if(err) return console.log(err);
						
						Enade.find({}, function(err, enades){
						
							if(err) return console.log(err);
	
							instituicoes.forEach(function (instituicao) {
								
								if(err) return console.log(err);
			
									var igc = 'Índice Geral de Cursos 2014 (IGC): '+getIGC(instituicao, igcs);
			
									var enade = getENADE(instituicao, enades).Conceito_Enade;
									
									if (enade == undefined) enade = 'Não Avaliado';
									
									var ano = getENADE(instituicao, enades).ano;
			
									//controle para construir apenas um objeto por IES/Municipio
									if (coIES == instituicao.CO_IES && coMUNICIPIO == instituicao.CO_MUNICIPIO_CURSO) {
										
										var vagas = getTotalVagas(instituicao);
										
										var inscritos = getTotalInscritos(instituicao);
										
										cursosIES.push({
											nome: instituicao.NO_CURSO, 
											grau: instituicao.DS_GRAU_ACADEMICO,
											vagas: vagas,
											inscritos: inscritos,
											concorrencia: getConcorrencia(vagas, inscritos),
											enade: enade,
											ano: ano
										});
										
									} else {
			
										coIES = instituicao.CO_IES;
									
										coMUNICIPIO = instituicao.CO_MUNICIPIO_CURSO;
									
										if (coMUNICIPIO) {
										
											cursosIES = [];
											var vagas = getTotalVagas(instituicao);
											var inscritos = getTotalInscritos(instituicao);
										
											cursosIES.push({
												nome: instituicao.NO_CURSO, 
												grau: instituicao.DS_GRAU_ACADEMICO,
												vagas: vagas,
												inscritos: inscritos,
												concorrencia: getConcorrencia(vagas, inscritos),
												enade: enade,
												ano: ano
											});
										
											var coordenada = getCoordenada(instituicao, coordenadas);
										
											if (coordenada) {
			
												var latitude = parseFloat(coordenada.latitude.replace(",","."));
												var longitude = parseFloat(coordenada.longitude.replace(",","."));
			
												resultado.push({
																nome: instituicao.NO_IES,
																categoria: instituicao.DS_CATEGORIA_ADMINISTRATIVA,									
																coord : {lat : latitude,  lng : longitude},
																igc: igc,
																cursos: cursosIES}
															);
			
												coordenada.latitude = ''+(latitude-0.005);
												coordenada.longitude = ''+(longitude-0.005);
			
											} 
			
									} 
										
								}
							});
							
							res.render('dadosnivelsuperior/search', {resultado: resultado, chaveDaBusca: chaveDaBuscaOriginal});
				     	
						});
					});
	     		});
		});
				
		
	});
	function getIGC(instituicao, igcs) {
		var igcRet = 'NA';
		for (var i = 0; i < igcs.length; i++) {
			if (instituicao.CO_IES == igcs[i].CO_IES) {
				igcRet = igcs[i].IGC_CONTINUO;
				break;
			}

		}
		return igcRet;
	}

	function getENADE(instituicao, enades) {
		var enadeRet = '';
		for (var i = 0; i < enades.length; i++) {
			if (instituicao.CO_CURSO == enades[i].CO_CURSO) {
				enadeRet = enades[i];
				break;
			}
		}
		return {ano:enadeRet.Ano , Conceito_Enade:enadeRet.Conceito_Enade};
	}

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

	function getTotalVagas(curso) {
		return curso.QT_VAGAS_NOVAS_INTEGRAL +
			curso.QT_VAGAS_NOVAS_MATUTINO +
			curso.QT_VAGAS_NOVAS_VESPERTINO +
			curso.QT_VAGAS_NOVAS_NOTURNO +
			curso.QT_VAGAS_NOVAS_EAD +
			curso.QT_VAGAS_REMANESC_INTEGRAL +
			curso.QT_VAGAS_REMANESC_MATUTINO +
			curso.QT_VAGAS_REMANESC_VESPERTINO +
			curso.QT_VAGAS_REMANESC_NOTURNO +
			curso.QT_VAGAS_REMANESC_EAD +
			curso.QT_VAGAS_PROG_ESP_INTEGRAL +
			curso.QT_VAGAS_PROG_ESP_MATUTINO +
			curso.QT_VAGAS_PROG_ESP_VESPERTINO +
			curso.QT_VAGAS_PROG_ESP_NOTURNO +
			curso.QT_VAGAS_PROG_ESP_EAD;
	}

	function getTotalInscritos(curso) {
		return curso.QT_INSC_VAGAS_NOVAS_INT +
			curso.QT_INSC_VAGAS_NOVAS_MAT +
			curso.QT_INSC_VAGAS_NOVAS_VESP +
			curso.QT_INSC_VAGAS_NOVAS_NOT +
			curso.QT_INSC_VAGAS_NOVAS_EAD +
			curso.QT_INSC_VAGAS_REMAN_INT +
			curso.QT_INSC_VAGAS_REMAN_MAT +
			curso.QT_INSC_VAGAS_REMAN_VESP +
			curso.QT_INSC_VAGAS_REMAN_NOT +
			curso.QT_INSC_VAGAS_REMAN_EAD +
			curso.QT_INSC_VAGAS_PROG_ESP_INT +
			curso.QT_INSC_VAGAS_PROG_ESP_MAT +
			curso.QT_INSC_VAGAS_PROG_ESP_VESP +
			curso.QT_INSC_VAGAS_PROG_ESP_NOT +
			curso.QT_INSC_VAGAS_PROG_ESP_EAD;
	}	

	function getConcorrencia(totalVagas, totalInscritos) {
		var concorrencia = 0;
		if (totalVagas > 0) {
			concorrencia = totalInscritos/totalVagas;
			concorrencia = parseFloat(new Number(concorrencia+'').toFixed(2));
		}
		return concorrencia;
	}
}
