<?php
require "vendor/autoload.php";
require "vendor/swiftmailer/swiftmailer/lib/swift_required.php";


//class to send emails // Crear el mensaje
class mailClass {


	function SendEmail($template, $subject)
	{
		$ini_array = parse_ini_file("config.ini");
	// Configuraci�n
	$transport = Swift_SmtpTransport::newInstance()
	->setHost('smtp.gmail.com')
	->setPort('587')
	->setEncryption('tls')
	->setUsername($ini_array["username"])
	->setPassword($ini_array["password"]);
	$mailer = Swift_Mailer::newInstance($transport);
	$loader = new Twig_Loader_FileSystem('Emails');//C:\xampp\htdocs\test\
	$twig = new Twig_Environment($loader);
	$message = Swift_Message::newInstance()
	  // Asunto
	  ->setSubject($subject)//'General Contact Request Form'
	  // Remitente
	  ->setFrom(array('noreply@cartersqualitylawnservice.com' => 'noreply@cartersqualitylawnservice.com'))
	  // Destinatario/s
	  ->setTo(array($ini_array["email"] => 'owner'))
	  // Body del mensaje
	  ->setBody($twig->render(
	                //Emails/generalcontact.html.twig 'generalcontact.html.twig'
	                $template,
	                $_POST
	            ), 'text/html');
	$mailer->send($message);
	// Enviar el mensaje //TODO get rid of echo statements
	// if ($mailer->send($message))
	// {
	//     echo "$section Mensaje enviado correctamente";
	// }
	// else
	// {
	//     echo "Mensaje fallido";
	// }
	}
}


// Si el formulario es enviado
if (isset($_POST["irrigationcontact"]))
{
	$mail = new mailClass;
	$mail->SendEmail('irrigation.html.twig', 'Irrigation Request Form');
}

if(isset($_POST["generalcontact"]))
{
	$mail = new mailClass;
	$mail->SendEmail('generalcontact.html.twig', 'General Contact Request Form');
}





?>
