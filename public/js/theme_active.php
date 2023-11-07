<?php
	$val = $_POST['val'];
	if($val == '1')
	{
		$theme = 'css/theme-default.css';
	}
	elseif($val == '2')
	{
		$theme = 'css/theme-brown.css';
	}
	elseif($val == '3')
	{
		$theme = 'css/theme-blue.css';
	}
	elseif($val == '4')
	{
		$theme = 'css/theme-white.css';
	}
	else
	{
		$theme = 'css/theme-black.css';
	}
	$servername = "localhost";
	$username = "seointec_dev";
	$password = ",&57m,%jT=uV";
	$dbname = "seointec_dev";
	//// Create connection
	$conn = mysqli_connect($servername, $username, $password, $dbname);
	//// Check connection
	if (!$conn)
	{
		die("Connection failed: " . mysqli_connect_error());
	}
	$fetc = "SELECT * FROM `theme_active` WHERE `theme_id` = 1";
	$result = mysqli_query($conn, $fetc);
	$num_rows = mysqli_num_rows($result);
	if($num_rows > 0)
	{
		$sql = "UPDATE `theme_active` SET `theme_name`= '$theme' WHERE `theme_id` = 1";
	}
	else
	{
		$sql = "INSERT INTO `theme_active`(`theme_name`) VALUES ('$theme')";
	}
	if(mysqli_query($conn, $sql))
	{
		echo "Theme inserted Successfully . . . !";
	}
	else
	{
		echo "Error in Theme Saving . . . !";
	}
	mysqli_close($conn);
?>