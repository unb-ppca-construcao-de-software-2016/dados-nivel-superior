var mongoose = require('mongoose');
var db = mongoose.connection;
mongoose.connect('mongodb://ondeestudar:ppca1521@ds023684.mlab.com:23684/ondeestudar?authMechanism=SCRAM-SHA-1');
db.on('error', console.error);
var resultado = undefined
db.once('open', function() {
   	console.log('Conectado ao MongoDB');
	//Schema da collection coordenadas
	var coordSchema = new mongoose.Schema({
		co_municipio_curso: String,
		latitude: String,
		longitude: String
	});
	   //Schema da collection curso
	   var cursoSchema = new mongoose.Schema({
		CO_IES: Number,
		NO_IES: String,
		CO_CATEGORIA_ADMINISTRATIVA: Number,
		DS_CATEGORIA_ADMINISTRATIVA: String,
		CO_ORGANIZACAO_ACADEMICA: Number,
		DS_ORGANIZACAO_ACADEMICA: String,
		CO_MUNICIPIO_CURSO: Number,
		NO_MUNICIPIO_CURSO: String,
		CO_UF_CURSO: Number,
		SGL_UF_CURSO: String,
		NO_REGIAO_CURSO: String,
		IN_CAPITAL_CURSO: Number,
		CO_CURSO: Number,
		NO_CURSO: String,
		CO_SITUACAO_CURSO: Number,
		DS_SITUACAO_CURSO: String,
		CO_OCDE: String,
		NO_OCDE: String,
		CO_OCDE_AREA_GERAL: Number,
		NO_OCDE_AREA_GERAL: String,
		CO_OCDE_AREA_ESPECIFICA: Number,
		NO_OCDE_AREA_ESPECIFICA: String,
		CO_OCDE_AREA_DETALHADA: Number,
		NO_OCDE_AREA_DETALHADA: String,
		CO_GRAU_ACADEMICO: Number,
		DS_GRAU_ACADEMICO: String,
		CO_MODALIDADE_ENSINO: Number,
		DS_MODALIDADE_ENSINO: String,
		CO_NIVEL_ACADEMICO: Number,
		DS_NIVEL_ACADEMICO: String,
		IN_GRATUITO: Number,
		TP_ATRIBUTO_INGRESSO: Number,
		IN_INTEGRAL_CURSO: Number,
		IN_MATUTINO_CURSO: Number,
		IN_VESPERTINO_CURSO: Number,
		IN_NOTURNO_CURSO: Number,
		NU_INTEGRALIZACAO_INTEGRAL: String,
		NU_INTEGRALIZACAO_MATUTINO: String,
		NU_INTEGRALIZACAO_VESPERTINO: Number,
		NU_INTEGRALIZACAO_NOTURNO: String,
		NU_INTEGRALIZACAO_EAD: String,
		IN_POSSUI_LABORATORIO: Number,
		QT_INSC_VAGAS_NOVAS_INT: String,
		QT_INSC_VAGAS_NOVAS_MAT: String,
		QT_INSC_VAGAS_NOVAS_VESP: Number,
		QT_INSC_VAGAS_NOVAS_NOT: String,
		QT_INSC_VAGAS_NOVAS_EAD: String,
		QT_INSC_VAGAS_REMAN_INT: String,
		QT_INSC_VAGAS_REMAN_MAT: String,
		QT_INSC_VAGAS_REMAN_VESP: Number,
		QT_INSC_VAGAS_REMAN_NOT: String,
		QT_INSC_VAGAS_REMAN_EAD: String,
		QT_INSC_VAGAS_PROG_ESP_INT: String,
		QT_INSC_VAGAS_PROG_ESP_MAT: String,
		QT_INSC_VAGAS_PROG_ESP_VESP: Number,
		QT_INSC_VAGAS_PROG_ESP_NOT: String,
		QT_INSC_VAGAS_PROG_ESP_EAD: String,
		QT_VAGAS_NOVAS_INTEGRAL: String,
		QT_VAGAS_NOVAS_MATUTINO: String,
		QT_VAGAS_NOVAS_VESPERTINO: Number,
		QT_VAGAS_NOVAS_NOTURNO: String,
		QT_VAGAS_NOVAS_EAD: String,
		QT_VAGAS_REMANESC_INTEGRAL: String,
		QT_VAGAS_REMANESC_MATUTINO: String,
		QT_VAGAS_REMANESC_VESPERTINO: Number,
		QT_VAGAS_REMANESC_NOTURNO: String,
		QT_VAGAS_REMANESC_EAD: String,
		QT_VAGAS_PROG_ESP_INTEGRAL: String,
		QT_VAGAS_PROG_ESP_MATUTINO: String,
		QT_VAGAS_PROG_ESP_VESPERTINO: Number,
		QT_VAGAS_PROG_ESP_NOTURNO: String,
		QT_VAGAS_PROG_ESP_EAD: String,
		QT_MATRICULA_CURSO: Number,
		QT_CONCLUINTE_CURSO: String,
		QT_INGRESSO_CURSO: Number,
		QT_INGRESSO_VAGAS_NOVAS: Number
	});


	var Curso = mongoose.model('curso', cursoSchema, 'curso');
	var Coordenadas = mongoose.model('coordenadas', coordSchema, 'coordenadas');	
	//Busca um registro para a UnB

	Curso.findOne({NO_IES: /UNIVERSIDADE DE BRAS/}, function(err, instituicaos){
		if(err) return console.err(err);
		//Busca as coordenadas para o municipio
     		Coordenadas.findOne({co_municipio_curso: instituicaos.CO_MUNICIPIO_CURSO}, function(err, coordenadas){
          		if(err) return console.err(err);
                	//console.log('nome:\'%s\', \ncoord: {lat: %s, lng: %s} \ncursos:{nome: %s}', instituicaos.NO_IES, coordenadas.latitude, coordenadas.longitude, instituicaos.NO_CURSO);
			Curso.find({NO_IES: /UNIVERSIDADE DE BRAS/},{NO_CURSO: 1, _id: 0}, function(err, cursos){
				if(err) return console.err(err);
				var resultado = ['{nome: '+instituicaos.NO_IES+', coord: {lat: '+coordenadas.latitude+', lng: '+coordenadas.latitude+'}, cursos: ['+cursos+'}]}']
				//console.log(resultado)
				db.close()
			});
        	});
        });
});


// Wrapper: Feito desta forma para que a inicialização seja tardia da conexão
module.exports = function() {
	return resultado;
	
}



