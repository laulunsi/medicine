var app = {};
var first = true;

function fn(data) {
    var arr = [];
    for(arr[arr.length] in data[0]);
    //console.log(arr);
    if(first){
        app = new Vue({
            el: '#app',
            data:{
                title:arr,
                data:data,
                show:false,
                buy:false,
                buydetail:false
            }
        });
        first = false;
    }
    app.title = arr;
    app.data = data;
}

//点击导航栏显示详细信息
var clickThis;
(function () {
    var $ah3 = $('.main_left_ul li h3');
    var $aDataDetail = $('.datadetail');
    $ah3.on('click',function () {
        //当前的h3是第几个
        var index = $ah3.index($(this));
        $($aDataDetail[index]).toggleClass('show');
    })
})();

//点击每个按钮清除上一个颜色 自己加上yanse
(function () {
    $('.main_left_ul').on('click',function (e) {
        var target = e.target;
        if($(target).hasClass('selectitem')){
            if(clickThis){//如果存在
                $(clickThis).removeClass('active');
                clickThis = target;
            }else{//不存在
                clickThis = target;
            }
            $(target).addClass('active');
        }
    })
})();



//点击购买药品
(function () {
    //查看药品
    $('.selectmedicine').on('click',function () {
        $.ajax({
            type:'get',
            url:'/customer/selectmedicine',
            success:function (data) {
                fn(data);
                showView('show');

                var $aNumLess = $('.num--');
                var $aNumInput = $('.buy_medicine_num');
                var $aNumMore = $('.numMore');

                $aNumLess.on('click',function () {
                    var index = $aNumLess.index(this);
                    var num = $aNumInput.eq(index).val();
                    if(num == 0){
                        alert('购买数量不能少于0')
                    }else{
                        $aNumInput.eq(index).val(--num);
                    }
                });

                $aNumMore.on('click',function () {
                    var index = $aNumMore.index(this);
                    var num = $aNumInput.eq(index).val();
                    $aNumInput.eq(index).val(++num);
                });
                
                //确认购买按钮点击
                $('.submit_buy_button').on('click',function () {
                    var arr = [];
                    for(var i=0;i<$aNumInput.length;i++){
                        if($aNumInput.eq(i).val() != 0){
                            //出库 需要 -------> 药品编号 批号 数量 出库时间
                            //药品销售单 ----->  客户id 销售总额 销售时间 销售备注
                            //销售详情单 -------> 药品id  这个药品销售数量 销售价格
                            //库存量信息表 ------->  库存量信息

                            arr[arr.length] = {
                                mid:data[i].mid,
                                saleprice:data[i].salePrice,
                                salepihao:data[i].pihao,
                                saleNum:$aNumInput.eq(i).val(),
                                saleMemo:$('.buy_memo').val()
                            };
                        }
                    }
                    $.ajax({
                        type:'post',
                        url:'/customer/buymedicine',
                        data:{
                            buyInfo:JSON.stringify(arr)
                        },
                        success:function (data) {
                            if(data == '成功'){
                                alert('购买成功');
                            }
                        }
                    })
                })
            },
            error:function (data) {
                console.log(data);
            }
        });






    });


    //买货记录
    $('.buymedicinelog').on('click',function () {
        $.ajax({
            type:'get',
            url:'/customer/buymedicinelog',
            success:function (data) {
                console.log(data);
                fn(data);
                showView('buy');

                var $abuyButton = $('.buy_detail');
                $abuyButton.on('click',function () {
                    var index = $abuyButton.index(this);
                    $.ajax({
                        type:'get',
                        url:'/customer/selectbuydetail',
                        data:{
                            saleid:data[index]['saleid']
                        },
                        success:function (data) {
                            fn(data);
                            showView('buydetail');
                        }
                    })
                })
            }
        })
    });
    //点击查看本次购买药品的详细信息
})();

//选择要展示的页面 其他的都改为false
function showView(key) {
    app.show = false;
    app.buy = false;
    app.buydetail = false;
    app[key] = true;
}









































