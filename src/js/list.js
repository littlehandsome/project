let list = document.querySelector(".list");
let page = document.querySelector('.page');

let defaultInfo = {
    len: 20,
    num: 1
}
pAjax({
    url: '../api/gotData.php',
    data: {
        start: defaultInfo.num,
        len: defaultInfo.len
    }
}).then((res) => {
    new Pagination(page, {
        pageInfo: {
            pagenum: 1,
            pagesize: defaultInfo.len,
            total: res.total,
            totalpage: Math.ceil(res.total / defaultInfo.len)
        },
        textInfo: {
            first: '首页',
            prev: '上一页',
            list: '',
            next: '下一页',
            last: '最后一页'
        },
        change: function(num) {
            defaultInfo.num = num;
            getData();
            scrollTo(0, 0)
        }
    });
})

async function getData() {
    let res = await pAjax({
        url: '../api/gotData.php',
        data: {
            start: defaultInfo.num,
            len: defaultInfo.len
        }
    });
    console.log(res);
    console.log(res.list);
    renderHtml(res.list);
    pai(res.list);

}

function renderHtml(data) {
    let str = '';

    data.forEach((item, index) => {
        str += ` <li class="list-item">
        
        <div class="row">
            <div>
                <div class="thumbnail">
                    <img src="${item.img}"
                        alt="...">
                    <div class="caption">
                        <h3>${item.name}</h3>
                        <div class="price">
                            <i class="glyphicon glyphicon-yen"></i>
                            <span>${item.price}</span>
                        </div>
                        <p>
                            <a href="./car.html" class="btn btn-primary" role="button">查看购物车</a>
                            <a href="./detail.html?id=${item.pid}" class="btn btn-info" role="button">查看商品详情</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </li>`;
    })

    list.innerHTML = str;
}


function pai(num) {
    //价格降序排序
    $('#jiagedown').on('click', function() {
        num.sort(function(a, b) {
            return b.price - a.price
        })
        renderHtml(num); //重新渲染
    })

    $('#jiageup').on('click', function() {
        num.sort(function(a, b) {
            return a.price - b.price;
        })
        renderHtml(num);
    })

}

$('#an').on('click', function() {
    $.get('../api/sousuo.php', {
        name: $('#sousuo').val()
    }, function(res) {
        console.log(res);
        renderHtml(res);
    }, 'json');

})