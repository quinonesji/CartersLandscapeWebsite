<?php
require "mail.php";
class ReviewSubmission {
  protected $dbhost;
  protected $dbuser;
  protected $dbpass;
  protected $dbName;
  public $conn;

  public function __construct($host, $user, $pass, $name)
  {
    $this->dbhost = $host;
    $this->dbuser = $user;
    $this->dbpass = $pass;
    $this->dbName = $name;
    $this->conn = mysqli_connect($this->dbhost, $this->dbuser, $this->dbpass, $this->dbName);

    if(!$this->conn)
    {
      echo 'Database Connection Error ' . mysqli_connect_error($this->conn);
    }
  }
  //function to handle insertion to table in database
  public function insertreview($name, $email, $message, $imageurl)
  {
      $sql = "INSERT INTO customerreview (Name, Email, Message, ImageUrl) VALUES ('$name', '$email', '$message', '$imageurl')";
      if(mysqli_query($this->conn, $sql))
           {
                return true;
           }
           else
           {
                echo mysqli_error($this->conn);
           }
  }

  public function selectreviews() {
    $data = array();
      $query = "SELECT Name, Message, ImageUrl FROM customerreview";
      $result = mysqli_query($this->conn, $query);
      while($row = mysqli_fetch_array($result, MYSQLI_ASSOC))
      {
        $data[] = $row;
      }
      return $data;

  }

  // function post_captcha($user_response, $secretKey) {
  //       $fields_string = '';
  //       $fields = array(
  //           'secret' => $secretKey,
  //           'response' => $user_response
  //       );
  //       foreach($fields as $key=>$value)
  //       $fields_string .= $key . '=' . $value . '&';
  //       $fields_string = rtrim($fields_string, '&');
  //
  //       $ch = curl_init();
  //       curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
  //       curl_setopt($ch, CURLOPT_POST, count($fields));
  //       curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
  //       curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);
  //
  //       $result = curl_exec($ch);
  //       curl_close($ch);
  //
  //       return json_decode($result, true);
  //   }

}
//$db_array = parse_ini_file("config.ini");



if(isset($_POST["reviewcontact"])) {
  $mail = new mailClass;
  $db_array = parse_ini_file("config.ini");
  $review = new ReviewSubmission($db_array["host"], $db_array["user"], $db_array["pass"], $db_array["name"]);
  //$res = $review->post_captcha($_POST['g-recaptcha-response'], $db_array["secretKey"]);
  $name = mysql_real_escape_string($_POST["name"]);
  $email = mysql_real_escape_string($_POST["email"]);
  $message = mysql_real_escape_string($_POST["message"]);

  // if (!$res['success']) {
  //      // What happens when the CAPTCHA wasn't checked
  //     // echo '<p>Please go back and make sure you check the security CAPTCHA box.</p><br>';
  //     try {
  //       throw new Exception("Please verify Recaptcha is checked.");
  //
  //     }
  //     catch(Exception $e)
  //     {
  //       $sapi_type = php_sapi_name();
  //       if (substr($sapi_type, 0, 3) == 'cgi')
  //           header("Status: 400 Something went wrong.");
  //       else
  //           header("HTTP/1.1 400 Something went wrong.");
  //       echo json_encode(array(
  //           'error' => array(
  //               'msg' => $e->getMessage(),
  //               'code' => $e->getCode(),
  //           ),
  //       ));
  //       return;
  //     }
    // } else {
       // If CAPTCHA is successfully completed...

       // Paste mail function or whatever else you want to happen here!
       //echo '<br><p>CAPTCHA was completed successfully!</p><br>';


  //check names are not empty if they are return exception
  try {
    if($name == '' || $email == '' || $message == '')
    {
      throw new Exception("Please file in required fields.");
    }
  }
  catch(Exception $e)
  {
    $sapi_type = php_sapi_name();
    if (substr($sapi_type, 0, 3) == 'cgi')
        header("Status: 404 Not Found");
    else
        header("HTTP/1.1 404 Not Found");
    echo json_encode(array(
        'error' => array(
            'msg' => $e->getMessage(),
            'code' => $e->getCode(),
        ),
    ));
    return;
  }

  // next prep image upload and check if file is an image, if not thrwo exception to user

  $target_dir = "uploads/";
  $target_file = $target_dir . basename($_FILES["fileToUpload"]["name"]);//$target_file variable has the image path to store in table
  $table_target_file = "";
  //check if image is not empty if it is proceed to upload to database
  if($_FILES["fileToUpload"]["name"] != "")
  {

    //$uploadOk = 1;
    $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
    // Check if image file is a actual image or fake image
        $check = getimagesize($_FILES["fileToUpload"]["tmp_name"]);
    try {
      if($check !== false) {
          //echo "File is an image - " . $check["mime"] . ".";
          move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $target_file);
          $table_target_file = mysql_real_escape_string("includes" . "/" . $target_file);//../includes
          //$uploadOk = 1;
      } else {
          throw new Exception("File is not an image.");
          //$uploadOk = 0;
      }
    }
    catch(Exception $e)
    {
      $sapi_type = php_sapi_name();
      if (substr($sapi_type, 0, 3) == 'cgi')
          header("Status: 404 Not Found");
      else
          header("HTTP/1.1 404 Not Found");
      echo json_encode(array(
          'error' => array(
              'msg' => $e->getMessage(),
              'code' => $e->getCode(),
          ),
      ));
      return;
    }
  }


      try {
        //start the insertion process
        //image url to store in table database
        $_POST["Image"] = $table_target_file;
        if($review->insertreview($name, $email, $message, $table_target_file))
        {
          //send email
          $mail->SendEmail('reviewcontact.html.twig', 'Review Submission by Customer');
          //echo "success";
        }
        else {
          throw new Exception("Something went wrong.");
        }
      }
      catch(Exception $e)
      {
        $sapi_type = php_sapi_name();
        if (substr($sapi_type, 0, 3) == 'cgi')
            header("Status: 400 Something went wrong.");
        else
            header("HTTP/1.1 400 Something went wrong.");
        echo json_encode(array(
            'error' => array(
                'msg' => $e->getMessage(),
                'code' => $e->getCode(),
            ),
        ));
        return;
      }
    //}
}

if(isset($_POST)) {
    $db_array = parse_ini_file("config.ini");
    $review = new ReviewSubmission($db_array["host"], $db_array["user"], $db_array["pass"], $db_array["name"]);
    $result = $review->selectreviews();
    echo json_encode($result, JSON_PRETTY_PRINT);
}




 ?>
