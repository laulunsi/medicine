(function () {
    //验证的正则表达式
    var reg = {
        "user":/^.{1,8}$/,
        "email" : /^[1-9A-Za-z]\w{5,19}@[1-9a-z]{2,7}\.[a-z]{2,5}$/,
        "password" : /^[\w!@#$%^&*()_+\-=/{}\[\]:";',.\/]{6,20}$/
    };

    var ishasUser;
    //检查用户名是否存在
    (function () {
        $('.user').on('blur',function () {
            var data = {};
            data.username = this.value;
            //此时去数据库去查询有没有相同的用户名返回数据
            $.ajax({
                type:'get',
                url:'/checkusername',
                data:data,
                success:function (data) {
                    if(data.length == 0){
                        //未被注册
                        $('.user_info').removeClass('show');
                        ishasUser = true;
                    }else{
                        //已经被注册
                        $('.user_info').addClass('show');
                        ishasUser = false;
                    }
                },
                error:function (err) {
                    console.log(err);
                }
            })
        });
    })();


    //注册用户
    (function () {

        $('.reg_a').on('click',function () {
            //检查一下所有的信息是否都被填写完成
            var data = {};
            data.userid = $('.user').val();
            data.username = $('.username').val();
            data.usercity = $('.usercity').val();
            data.userphone = $('.userphone').val();
            data.userpass1 = $('.userpass1').val();
            data.userpass2 = $('.userpass2').val();

            console.log(data);

            if(!data.userid){
                alert('用户名账号不能为空');
                return ;
            }
            var reg = /\W/;
            if(reg.test(data.userid)){
                console.log('1111');
                alert('账号只能是英文和数字');
                return ;
            }

            if(!ishasUser){
                //被注册
                alert('请修改一个用户账号，用户账号已经存在');
                return ;
            }
            if(!data.username){
                alert('用户名不能为空');
                return ;
            }
            if(!data.usercity){
                alert('用户城市不能为空');
                return ;
            }
            if(!data.userphone){
                alert('用户电话不能为空');
                return ;
            }
            if(!data.userpass1){
                alert('用户密码不能为空');
                return ;
            }
            if(!data.userpass2){
                alert('请再次确认密码');
                return ;
            };
            console.log(data.userpass1 === data.userpass2);
            if(!(data.userpass1 === data.userpass2)){
                console.log('1111111')
                //两次密码不一致
                alert('两次密码必须保持一致，请修改确认');
                return ;
            }
            
            $.ajax({
                type:'post',
                url:'/reg',
                data:data,
                success:function (data) {
                    if(data === '成功'){
                        alert('注册成功');
                    }
                },
                error:function (err) {
                    console.log(err);
                }
            })
        })




    })();


})();




















