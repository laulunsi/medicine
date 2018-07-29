var app = {};
var first = true;

function fn(data) {
    //console.log(data);
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
                instorageTable:false,
                outstorageTable:false,
                selectBuyInput:false,
                selectcanDate:false
            }
        });
        first = false;
    }
    app.title = arr;
    app.data = data;
}


(function () {
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

//************************************************************
    //基础数据维护的页面
    (function () {
        //用户和权限管理
        $('.selectcustomer').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data1/selectuser',
                data:'data1',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });


        //药品信息管理
        $('.selectmedicineinfo').on('click',function () {
            $.ajax({
                type:'get',
                url:'data1/selectmedicineInfo',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });


        //员工信息管理
        $('.selectemployees').on('click',function () {
            $.ajax({
                type:'get',
                url:'data1/selectemployees',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });

        //供应商信息管理
        $('.selectsupplier').on('click',function () {
            $.ajax({
                type:'get',
                url:'data1/selectsupplier',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });

        //登记入库的药品
        $('.selectinstorage').on('click',function () {
            showView('instorageTable');
            var data = {};
            $('.submit_instorage').on('click',function () {
                data.mid = $('.ins_mid').val();
                data.pihao = $('.ins_pihao').val();
                data.inprice = $('.ins_inprice').val();
                data.sid = $('.ins_sid').val();
                data.instorageDate = $('.ins_instorageDate').val();
                data.failDate = $('.ins_failDate').val();
                data.instoragenum = $('.ins_instoragenum').val();
                data.allUnit = $('.ins_allUnit').val();
                data.oneUnit = $('.ins_oneUnit').val();
                console.log('1111');
                $.ajax({
                    type:'post',
                    url:'/data1/insertinstorage',
                    data:data,
                    success:function (data) {
                        if(data === '成功'){
                            alert('插入成功');
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }
                })
            });
        });


        //登记出库的药品
        $('.selectoutstorage').on('click',function () {
            showView('outstorageTable');
            $('.submit_outstorage').on('click',function () {
                var data = {};
                data.mid = $('.outs_mid').val();
                data.pihao = $('.outs_pihao').val();
                data.outstoragenum = $('.outs_outstoragenum').val();
                data.outstorageDate = $('.outs_outstorageDate').val();
                $.ajax({
                    type:'post',
                    url:'/data1/insertoutstorage',
                    data:data,
                    success:function (data) {
                        if(data === '成功'){
                            alert('出货成功');
                        }
                    },
                    error:function (err) {
                        console.log(err);
                    }
                })
            })
        })

    })();





//***********************************************
    //库存管理的页面
    (function () {
        //检查库存的下限
        $('.checkStorageLess').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data2/checkstorageless',
                success:function (data) {
                    fn(data);
                    showView('show');
                },
                error:function (err) {
                    console.log(err);
                }
            })
        });

        //检查过期的药品 报警并做退回销毁处理
        $('.checkStorageDate').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data2/checkDate',
                success:function (data) {
                    fn(data);
                    showView('selectcanDate');
                    $('#submitDeleteCanDate').on('click',function () {
                        var arr = [];
                        for(var key in data){
                            arr[arr.length] = data[key]['storageid'];
                        }
                        $.ajax({
                            type:'get',
                            url:'/data2/deleteselectcanDate',
                            data:{
                                deleteid:JSON.stringify(arr)
                            },
                            success:function (data) {
                                if(data === '成功'){
                                    alert('删除成功，请刷新浏览器查看');
                                }
                            }
                        })
                    })
                }
            })
        });

        //对有问题的药品退回供应商
        $('.checkStorageProblem').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data2/selectguoqi',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        })


    })();



//******************************************************
    //销售管理
    $('.buymedicinelog').on('click',function () {
        $.ajax({
            type:'get',
            url:'/data3/selectbuymedicinelog',
            success:function (data) {
                fn(data);
                showView('show');
            }
        })
    });



//*****************************************************
    //汇总和统计
    (function () {
        //每日销售情况 生成报表
        $('.d4_selectsaleprice').on('click',function () {
            console.log('11111');
            $.ajax({
                type:'get',
                url:'/data4/selectsaleprice',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });


        //月终
        (function () {
            $('.d4_monthsaleprice').on('click',function () {
                console.log('22222');
                $.ajax({
                    type:'get',
                    url:'/data4/selectmonthsale',
                    success:function (data) {
                        fn(data);
                        showView('show');
                    }
                })
            })
        })();

        //年终
        (function () {
            $('.d4_yearsaleprice').on('click',function () {
                console.log('33333');
                $.ajax({
                    type:'get',
                    url:'/data4/yearsaleprice',
                    success:function (data) {
                        fn(data);
                        showView('show');
                    }
                })
            });
        })();


        //查询销售明细
        $('.d4_saledetail').on('click',function () {
            showView('selectBuyInput');
            $('#submitBuyInput').on('click',function () {
                $.ajax({
                    type:'get',
                    url:'/data4/saledetail',
                    data:{
                      saleid:$('#buyInput').val()
                    },
                    success:function (data) {
                        fn(data);
                        showView('show');
                    }
                })
            });

        })


    })();




//***********************************************************
    //查询

    (function () {
        //查询药品的基本信息
        $('.d5_selectmedcine').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data5/selectmedicine',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });

        //查询库存情况
        $('.d5_selectstorage').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data5/selectstorage',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });

        $('.d5_seleceguoqi').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data5/selectguoqi',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });

        //查询供应商的信息
        $('.d5_selectsupplier').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data5/selectsupplier',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        });
        //查询与供应商往来账目
        $('.d5_selectsupplierprice').on('click',function () {
            $.ajax({
                type:'get',
                url:'/data5/selectsupplierprice',
                success:function (data) {
                    fn(data);
                    showView('show');
                }
            })
        })

    })();




    //选择要展示的页面 其他的都改为false
    function showView(key) {
        app.show = false;
        app.instorageTable = false;
        app.outstorageTable = false;
        app.selectBuyInput = false;
        app.selectcanDate = false;
        app[key] = true;
    }

})();










