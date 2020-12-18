let username = document.querySelector("#uname");
let password = document.querySelector("#password");
let phone = document.querySelector("#phone");
let btn = document.querySelector(".box");


// btn.onclick = function() {
//     console.log(phone.value);
// }


btn.onclick = function() {
    console.log(1);
    let e = window.event;
    e.preventDefault();
    pAjax({
        type: 'get',
        url: '../api/register.php',
        data: {
            username: username.value,
            password: password.value,
            phone: phone.value
        }
    }).then(res => {
        console.log(res);
        if (res.code == 1) {
            console.log(username.value);
            location.href = "./login.html"
        }
    })
}