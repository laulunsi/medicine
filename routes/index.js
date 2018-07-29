var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


//检查用户名是否存在
router.get('/checkusername',(req,res)=>{
  var username = req.query.username;
  sql('select * from customer where cid = ?',[username],(err,data)=>{
    if(err) throw err;
    res.send(data);
  })
});

//注册用户
router.post('/reg',(req,res)=>{
  console.log(req.body);
  var data = req.body;
  sql('insert into customer(cid,cpeople,ccity,cphone,cpass) values (?,?,?,?,?)',[data.userid,data.username,data.usercity,data.userphone,data.userpass1],(err,data)=>{
    if(err) throw err;
    if(data){
      res.send('成功');
    }
  })
});

//用户登录
router.post('/login',(req,res)=>{
  var loginInfo = req.body;
  if(loginInfo.type == 'customer'){
    //如果是客户登录
    sql('select * from customer where cid = ? and cpass = ?',[loginInfo.username,loginInfo.password],(err,data)=>{
      console.log(data);
      if(err) throw err;
      if(data.length){
        req.session.userid = loginInfo.username;
        res.send('客户登录');
      }else{
        res.send('登录失败');
      }
    })
  }else if(loginInfo.type == 'admin'){
    //这里是员工登录
      sql('select * from employees where eid=? and epass=?',[loginInfo.username,loginInfo.password],(err,data)=>{
          if(data.length){
              req.session.userid = loginInfo.username;
              res.send('员工登录');
          }else{
              res.send('登录失败');
          }
      })
  }

});


router.use('/data1',require('./data1'));
router.use('/data2',require('./data2'));
router.use('/data3',require('./data3'));
router.use('/data4',require('./data4'));
router.use('/data5',require('./data5'));
router.use('/customer',require('./customer'));

module.exports = router;
