<?php
//======================================
// 函数: send_email
// 功能: 发送Email
// 参数: $name          收件人名字
// 参数: $email         收件人Email地址
// 参数: $title         邮件标题
// 参数: $body          邮件内容
// 返回: true           邮件发送成功
// 返回: false          邮件发送失败
//======================================
function send_email($name='', $email, $title, $body)
{
  require_once('class.phpmailer.php');
  $json = file_get_contents(__DIR__.'/email_config.json');
  $arr = json_decode($json,true);
  $mail = new PHPMailer();
  $mail->IsSMTP();
  $mail->SMTPAuth   = true;
  $mail->SMTPSecure = 'ssl';
  $mail->Host       = $arr["Host"];
  $mail->Port       = 465;
  $mail->Username   = $arr["Username"];
  $mail->Password   = $arr["Password"];
  $mail->CharSet    = "utf-8";
  $mail->SetFrom($arr["address"], $arr["name"]);
  $mail->Subject    = $title;
  $mail->MsgHTML($body);
  $mail->AddAddress($email, $name);
  if ($mail->Send())
    return true;
  return false;
}
?>
