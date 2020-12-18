<?php
//模糊搜索
$con = mysqli_connect('localhost','root','123456','nike');
$name=$_GET['name'];

$sql = "SELECT * FROM `goods` WHERE `name` LIKE '%$name%'";

    $res = mysqli_query($con,$sql);

    if(!$res){
        die("数据库的错误：" . mysqli_error($con));
    }

    $arr = array();
    $row = mysqli_fetch_assoc($res);

    while($row){
        array_push($arr,$row);
        $row = mysqli_fetch_assoc($res);
    }
    print_r(json_encode($arr,JSON_UNESCAPED_UNICODE));

?>
