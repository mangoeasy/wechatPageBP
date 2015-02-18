<?php

/* set the email of the recipient (your email) */
$recipient = "info@proteusthemes.com";


if ( isset($_POST['submit']) ) { // just send the email if the $_POST variable is set
	$name    = $_POST['name'];
	$email   = $_POST['email'];
	$subject = $_POST['subject'];
	$message = $_POST['message'];

	$errors = array(); // empty array of the err

	/*
	 * The fields
	 * 1st param: submitted data
	 * 2nd param: reuqired (TRUE) or not (FALSE)
	 * 3rd param: the name for the error
	*/
	$fields = array(
		'name'    => array($name, TRUE, "Name"),
		'email'   => array($email, TRUE, "E-mail Address"),
		'subject' => array($subject, TRUE, "Subject"),
		'message' => array($message, TRUE, "Your Message"),
	);

	$i=0;
	foreach ($fields as $key => $field) {
		if ( FALSE == test_field( $field[0], $field[1] ) ) {
			$errors[$key] = "The field '".$field[2]."' is required.";
		}
		$i++;
	}

	if (empty($errors)) { // if there is no errors, we can send the mail
		$body = "";
		$body .= "----- Info about the sender -----\n\n";
		$body .= "Name: ".$fields['name'][0]."\n";
		$body .= "Email: ".$fields['email'][0]."\n";
		$body .= "\n\n----- Message -----\n\n";
		$body .= $fields['message'][0];

		if( mail( $recipient, $subject, $body, "FROM: ".$fields['email'][0] ) ) { // try to send the message, if not successful, print out the error
			message_was_sent($fields);

		} else {
			echo "It is not possible to send the email. Check out your PHP settings!";
			print_the_form($errors, $fields);
		}
	} else { // if there are any errors
		print_the_form($errors, $fields);
	}
} else {
	print_the_form();
}

/**
 * prints out the form if necessary
 */
function print_the_form($errors = array(), $fields = null) {
	?>
	<form method="post" action="#" validate>
		<div class="row">
			<div class="col-xs-12  col-sm-4">
				<div class="form-group<?php error_class('name', $errors); ?>">
					<label class="text-dark  control-label" for="name">Name <span class="warning">*</span></label>
					<input type="text" id="name" name="name" class="form-control  form-control--contact" value="<?php inpt_value('name', $fields); ?>" required>
				</div>
				<div class="form-group<?php error_class('email', $errors); ?>">
					<label class="text-dark  control-label" for="email">E-mail <span class="warning">*</span></label>
					<input type="text" id="email" name="email" class="form-control  form-control--contact" value="<?php inpt_value('email', $fields); ?>" required>
				</div>
				<div class="form-group<?php error_class('subject', $errors); ?>">
					<label class="text-dark  control-label" for="subject">Subject <span class="warning">*</span></label>
					<input type="text" id="subject" name="subject" class="form-control  form-control--contact" value="<?php inpt_value('subject', $fields); ?>" required>
				</div>
				<span class="hidden-xs">Fields marked with <span class="warning">*</span> are obligatory</span>
			</div>
			<div class="col-xs-12  col-sm-8">
				<div class="form-group<?php error_class('message', $errors); ?>">
					<label class="text-dark  control-label" for="message">Message <span class="warning">*</span></label>
					<textarea class="form-control  form-control--contact  form-control--big" id="message" name="message" rows="12" required><?php inpt_value('message', $fields); ?></textarea>
				</div>
				<div class="right">
					<input type="hidden" value="1" name="submit" />
					<button type="submit" class="btn  btn-warning">Send now</button>
				</div>
			</div>
		</div>
	</form>
	<?php
}

function message_was_sent($fields) { // notification that sending the mail was successful
	?>
	<p class="text-info">Your message was sent successfully!</p>
	<?php
}

/**
 * Returns TRUE if field is required and OK
 */
function test_field($content, $required) {
	if ( TRUE === $required ) {
		return strlen($content) > 0;

	} else {
		return TRUE;
	}
}

/**
 * Add the appropirate class name to the specified input field
 */
function error_class($name, $errors) {
	if ( array_key_exists( $name, $errors ) ) {
		echo " has-error";
	}
}

/**
 * repopulate the data when the form is submitted and errors returned
 */
function inpt_value($name, $fields) {
	if ( null === $fields ) {
		return;
	} else {
		echo $fields[$name][0];
	}
}

function show_error( $name, $errors ) {
	if ( array_key_exists( $name, $errors ) )
		echo '<div class="help-block"> ' . $errors[$name] . ' </div>';
}
