<?php

$username = $_GET['uname'];
$password = $_GET['password'];
$phone=$_GET['phone'];

$con=mysqli_connect('localhost','root','123456','nike');
$sql = "SELECT * FROM `users` WHERE `username`='$username'";//连接数据库的id匹配
$res=mysqli_query($con,$sql);

if(!$res){
    die('报错'.mysqli_error($con));
}
$row = mysqli_fetch_assoc($res);
if($row){
    echo json_encode(array(
        "code" => 0,
        "message" => "注册失败，该用户已存在"
    ));
}else{
    $sqlt="INSERT INTO `users` (`id`, `username`,`password`,`phone`) VALUES (NULL,'$username','$password','$phone')";
    $res2=mysqli_query($con,$sqlt);
        if($res2){
            echo json_encode(array(
                "code" => 1,
                "message" => "注册成功"
                ));
        }
}       
?>
