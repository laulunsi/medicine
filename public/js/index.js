$('#login-button').on('click',function () {
    var username = $('.username').val();
    var password = $('.password').val();
    var $type = $('#select option:selected');

    var data = {};
    data.username = username;
    data.password = password;
    data.type = $type.val();
    $.ajax({
        type:'post',
        url:'/login',
        data:data,
        success:function (res) {
            if(res === '客户登录'){
                window.location.href = 'http://localhost:3000/customer.html';
            }else if(res == '员工登录'){
                window.location.href = 'http://localhost:3000/main.html';
            }else if(res == '登录失败'){
                alert('登录失败,请检查用户名和密码是否输入正确');
            }
        }
    })
});