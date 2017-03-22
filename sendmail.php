<h3>PHP - Sendmail Test Script</h3>
This script tests sending mail using PHP and Sendmail. Choose your to and from address, and the number of emails you wish you send. This can test how quickly email is being send from the shared hosting server.<br />

<FORM METHOD=GET ACTION="sendmail.php">
To:<br /> 
<INPUT TYPE="text" NAME="to"><br />
From: <br />
<INPUT TYPE="text" NAME="from"><br>
how many emails?<br />
<INPUT TYPE="text" NAME="loops" VALUE="1"><br />
<INPUT TYPE="submit">
</FORM>

<?
$now = date("D M j G:i:s T Y");
$emailCount = $_GET['loops'];
$toAddress = $_GET['to'];
$from = $_GET['to'];
$fromAddress = "From: $from\r\n" .
   "Reply-To: webmaster@" . $_SERVER['SERVER_NAME'] . "\r\n" .
   "X-Mailer: PHP/" . phpversion();


if ($toAddress <> ""){

	for ($i = 1; $i <= $emailCount; $i++) {
		$body = "This test mail was generated on $now";
		mail($toAddress, "Test email number $i", $body, $fromAddress);
		echo "email number $i sent!<br>";
		}
}
?>