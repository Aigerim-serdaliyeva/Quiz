<?php

$method = $_SERVER['REQUEST_METHOD'];

$project_name = "DreamТОРГ (мини-тест)";
$admin_email  = "info@dreamtorg.kz, client@marketing-time.kz";
$server_mail = "<info@dreamtorg.kz>";
$form_subject = "Заявка";

$c = true;
if ( $method === 'POST' ) {

	foreach ( $_POST as $key => $value ) {
		if ( $value != "") {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
}

$message = "<table style='width: 100%;'>$message</table>";

function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: '.$project_name.' '.$server_mail. PHP_EOL .
'Reply-To: '.$admin_email.'' . PHP_EOL;

if(mail($admin_email, adopt($form_subject), $message, $headers)) {
  if($_POST['info'] == "CheckList") {
    $path = "./files/CheckList.pdf";
    $filename = "CheckList.pdf";
  
    if (file_exists($path)) {
      header('Content-Description: File Transfer');
      header('Content-Type: application/octet-stream');
      header('Content-Disposition: attachment; filename="'.$filename.'"');
      header('Expires: 0');
      header('Cache-Control: must-revalidate');
      header('Pragma: public');
      header('Content-Length: ' . filesize($path));
      readfile($path);
      exit;
    }
  } else {
    header("Location: thanks.html");
  }
}


