let container = document.querySelector('.containers');
// 判断是否有登录
// let login = getCookie('login');
let login = localStorage.getItem('login')
if (!login) {
    location.href = '../html/login.html';
    // setCookie('url', 'http://gz2008.com/nike/html/car.html')
    // localStorage.setItem('url', 'http://gz2008.com/nike/html/car.html');

}

// 获取用户购物车中的数据
pAjax({
    url: '../api/getCarData.php',
    data: { username: login }
}).then(res => {
    // 先把数据存放到本地
    localStorage.setItem('nike', JSON.stringify(res));
    render(res);
    console.log(res);
})

function render(data) {
    // data 请求出来的数据 有可能一条数据都没有
    if (!data.length) {
        container.innerHTML = `<div class="jumbotron">
            <h1>亲爱的用户</h1>
            <p>您购物空空如也，请到列表页选购你商品</p>
            <p><a class="btn btn-primary btn-lg" href="../html/list.html" role="button">点击去到列表页</a></p>
        </div>`;
        return
    }
    let allChecked = data.every(item => {
        return item.is_select == 1;
    });

    let total = shopNum(data);


    let str = `<div class="panel panel-default">
        <div class="panel-heading">
            <div class="content">
                <label for="" class="checkbox">
                    <input type="checkbox" id="all" ${allChecked?'checked' :''}>
                    <span>全选</span>
                </label>
                <label for="" class="type">
                    <span>商品种类：</span>
                    <span>${data.length}</span>
                </label>
                <label for="" class="qty">
                    <span>所选商品数量：</span>
                    <span>${total.totalNum}</span>
                </label>
                <label for="" class="price">
                    <span>所选商品价格：</span>
                    <span>${total.totalPrice}</span>
                </label>
                <label for="">
                    <button class="btn btn-warning btn-xs count">结算</button>
                    <button class="btn btn-info btn-xs clear">清空购物车</button>
                </label>
            </div>
        </div>`;

    str += `<div class="panel-body"><ul>`;

    data.forEach(item => {
        str += ` <li>
                <div class="media">
                    <div class="media-left media-middle">
                        <input type="checkbox" class="check" ${item.is_select==1 ?'checked':''} goods_id="${item.pid}">
                        <a href="#">
                            <img class="media-object"
                                src="${item.simg}"
                                alt="">
                        </a>
                    </div>
                    <div class="media-body">
                        <h4 class="media-heading">${item.name}</h4>
                        <div class="price">
                            <i class="glyphicon glyphicon-yen"></i>
                            <span>${item.price}</span>
                        </div>
                        <div class="btn">
                            <p>
                                <butto class="btn btn-danger del" goods_id="${item.pid}">删除商品</butto>
                            </p>
                            <div class="btn-group" goods_id="${item.pid}" role="group" aria-label="...">
                                <button class="btn btn-default cut">-</button>
                                <button class="btn btn-default">${item.cart_number}</button>
                                <button class="btn btn-default add">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            </li>`
    })

    str += ` </ul></div></div> `;

    container.innerHTML = str;

}

container.onclick = function() {
    let e = window.event;
    // 全选
    if (e.target.id == 'all') {
        let data = JSON.parse(localStorage.getItem('nike'));
        data.forEach(item => {
            e.target.checked ? item.is_select = 1 : item.is_select = 0
        });
        localStorage.setItem('nike', JSON.stringify(data));
        render(data);
    }

    // 单选
    if (e.target.className == 'check') {
        let id = e.target.getAttribute('goods_id');
        let data = JSON.parse(localStorage.getItem('nike'));
        data.forEach(item => {
                if (item.pid == id) {
                    item.is_select = e.target.checked ? 1 : 0;
                }
            })
            // 需要把 修改够的数据存储本地存储中
        localStorage.setItem('nike', JSON.stringify(data));
        render(data);
    }

    if (e.target.classList.contains('del')) {
        // 删除数据库中 和 本地存储中对应的数据 
        let id = e.target.getAttribute('goods_id');
        pAjax({
            url: '../api/removeCarData.php',
            data: {
                username: login,
                goods_id: id
            }
        }).then(res => {
            if (res.code) {
                // 先获取本地存储中的数据
                let data = JSON.parse(localStorage.getItem('nike'));
                let res = data.filter(item => {
                    return item.pid != id;
                });

                localStorage.setItem('nike', JSON.stringify(res));
                render(res);
            }
        })
    }

    // 更新商品的数量

    if (e.target.classList.contains('cut')) {
        // 进行数量减法
        let data = JSON.parse(localStorage.getItem('nike'));
        let id = e.target.parentNode.getAttribute('goods_id');

        let obj = data.filter(item => {
            return item.pid == id
        })[0];
        let num = obj.cart_number * 1;
        if (num <= 1) {
            num = 1
        } else {
            num--
        }
        pAjax({
            url: '../api/updCarData.php',
            data: {
                username: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('nike', JSON.stringify(data));
                render(data);
            }
        })
    }


    if (e.target.classList.contains('add')) {
        let data = JSON.parse(localStorage.getItem('nike'));
        let id = e.target.parentNode.getAttribute('goods_id');

        let obj = data.filter(item => {
            return item.pid == id;
        })[0];

        let num = obj.cart_number * 1;

        num++;

        pAjax({
            url: '../api/addCarData.php',
            data: {
                username: login,
                goods_id: id,
                goods_num: num
            }
        }).then(res => {
            if (res.code) {
                obj.cart_number = num;
                localStorage.setItem('nike', JSON.stringify(data));
                render(data);
            }
        })
    }


    if (e.target.classList.contains('count')) {

        pAjax({
            url: '../api/removeCarData.php',
            data: {
                username: login,
                is_select: 1
            }
        }).then(res => {
            if (res.code) {
                let data = JSON.parse(localStorage.getItem('nike'));
                let res = data.filter(item => {
                    return item.is_select != 1;
                });
                localStorage.setItem('nike', JSON.stringify(res));
                render(res);
            }
        })
    }



    if (e.target.classList.contains('clear')) {

        pAjax({
            url: '../api/removeCarData.php',
            data: {
                username: login,
                is_select: 1,
                is_select: 0
            }


        }).then(res => {
            if (res.code) {
                let data = JSON.parse(localStorage.getItem('nike'));
                let obj = data.filter(item => {
                    if (item.is_select == 1 || item.is_select == 0) {
                        return item.is_select == 1 || item.is_select == 0
                    }
                })

                localStorage.setItem('nike', JSON.stringify(res));
                render(res);
            }

        })

    }
}



function shopNum(goods) {
    let res = goods.filter(item => {
        return item.is_select == 1
    })

    // 计算选中商品的数量
    let totalNum = res.reduce((pre, item) => {
        return pre + item.cart_number * 1
    }, 0);

    // 计算选中商品的总价格
    let totalPrice = res.reduce((pre, item) => {
        return pre + item.price * item.cart_number
    }, 0);

    return {
        totalNum,
        totalPrice
    }
}