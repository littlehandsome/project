// 打开详情页的时候先查看是否有携带id参数
// 如果没有id参数的时候 跳转到列表 
// 如果有id参数的时候 根据id去获取对象的数据 渲染

// http://gz2008.com/day06_code/project/html/detail.html?id=4
let reg = /id=(\d+)/;
if (!reg.test(location.search)) {
    location.href = '../html/list.html'
}
let id = reg.exec(location.search)[1];
let container = document.querySelector('.containers');
// 根据id获取数据
pAjax({
    url: '../api/getDetail.php',
    data: {
        id
    }
}).then(res => {
    console.log(res);
    renderHtml(res.detail)
})


function renderHtml(data) {
    container.innerHTML = `
        <ol class="breadcrumb">
        <li><a href="#">详情</a></li>
    </ol>
    <div class="show">
        <img src="${data.simg}">
        <div class="mask"></div>
        <div class="big"><img src="${data.simg}" alt="" class="bigImg"></div>
    </div>
    <div class="m4" >
        <h4 class="media-heading">${data.name}
        </h4>
        <div class="price">
            <i class="glyphicon glyphicon-yen"></i>
            <span>${data.price}</span>
        </div>
        <div class="btn-group" role="group" aria-label="...">
            <button type="button" class="btn btn-default">38</button>
            <button type="button" class="btn btn-default">39</button>
            <button type="button" class="btn btn-default">40</button>
            <button type="button" class="btn btn-default">41</button>
            <button type="button" class="btn btn-default">42</button>
        </div>

        <div>
            <button class="btn btn-warning btn-lg" id="goCar">立即购买</button>
            <button class="btn btn-danger btn-lg" id="addCar">加入购物车</button>
        </div>
    </div>`



}

container.onclick = function() {
    let e = window.event;
    if (e.target.id == 'goCar') {
        location.href = '../html/car.html'
    }

    if (e.target.id == 'addCar') {
        // 因为添加到购物车按钮 需要把用户名和商品id
        // 所以需要判断是否有登录
        // let login = getCookie('login');
        let login = localStorage.getItem('login')
        if (!login) {
            location.href = '../html/login.html';
            // localStorage.setItem('url', 'http://gz2008.com/nike/html/detail.html?id=' + id)
            return
        }
        pAjax({
            url: '../api/addCarData.php',
            data: {
                username: login,
                goods_id: id
            }
        }).then(res => {
            console.log(res);
        })
    }

}



$('.containers').on('mouseover', '.show', function() {
    $('.containers').find('.mask').show();
    $('.containers').find('.big').show();
})
$('.containers').on('mouseout', '.show', function() {
    $('.containers').find('.mask').hide();
    $('.containers').find('.big').hide();
})
$('.containers').on('mousemove', '.show', function() {
    let e = window.event;
    let x = e.pageX - this.offsetLeft;
    let y = e.pageY - this.offsetTop;

    let maskX = x - $('.containers').find('.mask').width() / 2;
    let maskY = y - $('.containers').find('.mask').height() / 2;
    // (4) 如果x 坐标小于了0 就让他停在0 的位置
    // 遮挡层的最大移动距离
    let maskMaxX = $('.containers').find('.show').width() - $('.containers').find('.mask').width();
    let maskMaxY = $('.containers').find('.show').height() - $('.containers').find('.mask').height();
    if (maskX <= 0) {
        maskX = 0;
    } else if (maskX >= maskMaxX) {
        maskX = maskMaxX;
    }
    if (maskY <= 0) {
        maskY = 0;
    } else if (maskY >= maskMaxY) {
        maskY = maskMaxY;
    }
    $('.containers').find('.mask').css('left', maskX + 'px');
    $('.containers').find('.mask').css('top', maskY + 'px');
    // 3. 大图片的移动距离 = 遮挡层移动距离 * 大图片最大移动距离 / 遮挡层的最大移动距离
    // 大图片最大移动距离
    let bigMaxX = $('.containers').find('.bigImg').width() - $('.containers').find('.big').width();
    let bigMaxY = $('.containers').find('.bigImg').height() - $('.containers').find('.big').height();
    // 大图片的移动距离 X Y
    let bigX = maskX * bigMaxX / maskMaxX;
    let bigY = maskY * bigMaxY / maskMaxY;
    // console.log(bigX)
    $('.containers').find('.bigImg').css('left', -bigX + 'px');
    $('.containers').find('.bigImg').css('top', -bigY + 'px');
})