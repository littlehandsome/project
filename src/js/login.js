let username = document.querySelector("#username");
let password = document.querySelector("#password");
let btn = document.querySelector(".btn");

btn.onclick = function() {
    let e = window.event;
    e.preventDefault();
    pAjax({
        type: 'post',
        url: '../api/login.php',
        data: {
            username: username.value,
            password: password.value
        }
    }).then(res => {
        if (res.code == 1) {
            // 登录成功存储 登录的状态
            // setCookie('login', username.value);
            console.log(username.value);
            localStorage.setItem('login', username.value);

            location.href = "./list.html"
        }
    })
}