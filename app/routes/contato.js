
module.exports = function(app){
	
	
	app.get('/contato', function(req, res){
		
		res.render('outros/contato', {errosValidacaoContato: {}, errosValidacao: {}, email:{}});
	});
	
	app.post('/contato', function(req, res){

		var nodemailer = require('nodemailer');
		
		var email = req.body;
		
		req.assert('nome', 'Nome é obrigatória').notEmpty();
		req.assert('assunto', 'Assunto é obrigatória').notEmpty();
		req.assert('email', 'Email é obrigatória').notEmpty();
		req.assert('mensagem', 'Mensagem é obrigatória').notEmpty();
		
		var erros = req.validationErrors();
		
		if(erros){
			
			res.format({
			
				html: function(){			
					res.status(400).render('outros/contato', 
							{errosValidacaoContato: erros, errosValidacao: {}, email: email});
				}
			});

			return;
		}
		
		var mensagem = "<b>Nome:</b> "+email.nome+"<br><b>Email:</b> "+email.email+"<br><br><b>Mensagem:</b><br>";
		mensagem = mensagem + "---------------------------------------<br>";
		mensagem = mensagem + email.mensagem.replace(/\n/g, '<br>');
		
		

		if (!process.env.NODE_ENV) {
			var mailOptions = {
					from: '"Onde Estudar" <'+email.email+'>', // sender address 
					to: 'ondeestudarppca2016@gmail.com', // list of receivers 
					subject: '[DEV-CONTATO] '+email.assunto, // Subject line 
					text: mensagem, // plaintext body 
					html: mensagem // html body 
			};
			
			var transporter = nodemailer.createTransport('smtps://seuemail@gmail.com:suasenha@smtp.gmail.com');
			console.log("Conectando no servidor SMTP de DESENVOLVIMENTO");
		}else if (process.env.NODE_ENV == 'production') {
			
			var mailOptions = {
					from: '"Onde Estudar" <'+email.email+'>', // sender address 
					to: 'ondeestudarppca2016@gmail.com', // list of receivers 
					subject: '[CONTATO] '+email.assunto, // Subject line 
					text: mensagem, // plaintext body 
					html: mensagem // html body 
			};
			
			console.log("Conectando no servidor SMTP de PRODUÇÃO. URL: "+process.env.SMTP_URL);
			var transporter = nodemailer.createTransport(process.env.SMTP_URL);
		}else{
			
			res.render('outros/contato', {errosValidacaoContato: [ { param: 'Erro', msg: 'Mensagem não enviada por não ter servidor SMTP configurado neste ambiente!' } ], errosValidacao: {}, email:{}});
		}
		
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Mensagem Enviada: ' + info.response);
		});
		
		res.render('outros/contato', {errosValidacaoContato: [ { param: 'Sucesso', msg: 'Sua mensagem foi enviada com sucesso!', value: 'SUCESS' } ], errosValidacao: {}, email:{}});
	});
	
	
}
