var mongoose = require('mongoose');


if (!process.env.NODE_ENV) {
	
	mongoose.connect('mongodb://127.0.0.1/test');
	console.log("Conectando no ambiente de DESENVOLVIMENTO");
}else if (process.env.NODE_ENV == 'production') {
	
	console.log("Conectando no ambiente de PRODUÇÃO. URL: "+process.env.MONGODB_URL);
	mongoose.connect(process.env.MONGODB_URL);
}



var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
	
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
		CO_LOCAL_OFERTA: Number,
		NU_CARGA_HORARIA: Number,
		DT_INICIO_FUNCIONAMENTO: Date,
		DT_AUTORIZACAO_CURSO: Number,
		IN_AJUDA_DEFICIENTE: Number,
		IN_MATERIAL_DIGITAL: Number,
		IN_MATERIAL_AMPLIADO: Number,
		IN_MATERIAL_TATIL: Number,
		IN_MATERIAL_IMPRESSO: Number,
		IN_MATERIAL_AUDIO: Number,
		IN_MATERIAL_BRAILLE: Number,
		IN_MATERIAL_LIBRAS: Number,
		IN_DISCIPLINA_LIBRAS: Number,
		IN_TRADUTOR_LIBRAS: Number,
		IN_GUIA_INTERPRETE: Number,
		IN_RECURSOS_COMUNICACAO: Number,
		IN_RECURSOS_INFORMATICA: Number,
		IN_INTEGRAL_CURSO: Number,
		IN_MATUTINO_CURSO: Number,
		IN_VESPERTINO_CURSO: Number,
		IN_NOTURNO_CURSO: Number,
		NU_INTEGRALIZACAO_INTEGRAL: Number,
		NU_INTEGRALIZACAO_MATUTINO: Number,
		NU_INTEGRALIZACAO_VESPERTINO: Number,
		NU_INTEGRALIZACAO_NOTURNO: Number,
		NU_INTEGRALIZACAO_EAD: Number,
		IN_OFERECE_DISC_SEMI_PRES: Number,
		NU_PERC_CAR_HOR_SEMI_PRES: Number,
		IN_POSSUI_LABORATORIO: Number,
		QT_INSC_VAGAS_NOVAS_INT: Number,
		QT_INSC_VAGAS_NOVAS_MAT: Number,
		QT_INSC_VAGAS_NOVAS_VESP: Number,
		QT_INSC_VAGAS_NOVAS_NOT: Number,
		QT_INSC_VAGAS_NOVAS_EAD: Number,
		QT_INSC_VAGAS_REMAN_INT: Number,
		QT_INSC_VAGAS_REMAN_MAT: Number,
		QT_INSC_VAGAS_REMAN_VESP: Number,
		QT_INSC_VAGAS_REMAN_NOT: Number,
		QT_INSC_VAGAS_REMAN_EAD: Number,
		QT_INSC_VAGAS_PROG_ESP_INT: Number,
		QT_INSC_VAGAS_PROG_ESP_MAT: Number,
		QT_INSC_VAGAS_PROG_ESP_VESP: Number,
		QT_INSC_VAGAS_PROG_ESP_NOT: Number,
		QT_INSC_VAGAS_PROG_ESP_EAD: Number,
		QT_VAGAS_NOVAS_INTEGRAL: Number,
		QT_VAGAS_NOVAS_MATUTINO: Number,
		QT_VAGAS_NOVAS_VESPERTINO: Number,
		QT_VAGAS_NOVAS_NOTURNO: Number,
		QT_VAGAS_NOVAS_EAD: Number,
		QT_VAGAS_REMANESC_INTEGRAL: Number,
		QT_VAGAS_REMANESC_MATUTINO: Number,
		QT_VAGAS_REMANESC_VESPERTINO: Number,
		QT_VAGAS_REMANESC_NOTURNO: Number,
		QT_VAGAS_REMANESC_EAD: Number,
		QT_VAGAS_PROG_ESP_INTEGRAL: Number,
		QT_VAGAS_PROG_ESP_MATUTINO: Number,
		QT_VAGAS_PROG_ESP_VESPERTINO: Number,
		QT_VAGAS_PROG_ESP_NOTURNO: Number,
		QT_VAGAS_PROG_ESP_EAD: Number,
		QT_MATRICULA_CURSO: Number,
		QT_CONCLUINTE_CURSO: Number,
		QT_INGRESSO_CURSO: Number,
		QT_INGRESSO_VAGAS_NOVAS: Number
	});
	
	var igcSchema = new mongoose.Schema({
		CO_IES: Number,
		IGC_CONTINUO: Number,
		IGC_FAIXA: Number
	});
	
	var enadeSchema = new mongoose.Schema({
		CO_CURSO: Number,
		Conceito_Enade: Number,
		Enade_Faixa: Number,
		Ano: Number
	});



	var Curso = mongoose.model('curso', cursoSchema, 'curso');
	
	var Coordenadas = mongoose.model('coordenadas', coordSchema, 'coordenadas');
	
	var Igc = mongoose.model('igc', igcSchema, 'igc');
	
	var Enade = mongoose.model('enade', enadeSchema, 'enade');
	
	var my_schemas = {'Curso' : Curso, 'Coordenadas': Coordenadas, 'Igc':Igc, 'Enade': Enade};
	
	module.exports = my_schemas;
});
