var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');

//查询用户信息
router.get('/selectuser',(req,res)=>{
    sql('select * from customer',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//查询药品信息
router.get('/selectmedicineInfo',(req,res)=>{
   sql('select * from medicineinfo',(err,data)=>{
       if(err) throw err;
       res.send(data);
   })
});

//查询员工信息
router.get('/selectemployees',(req,res)=>{
    sql('select * from employees',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//查询供应商信息
router.get('/selectsupplier',(req,res)=>{
    sql('select * from supplier',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});


//增加入库信息
router.post('/insertinstorage',(req,res)=>{
    var da = req.body;
    sql('insert into instorage (mid,pihao,inprice,sid,instorageDate,failDate,instoragenum,allUnit,oneUnit) values (?,?,?,?,?,?,?,?,?)',[da.mid,da.pihao,da.inprice,da.sid,da.instorageDate,da.failDate,da.instoragenum,da.allUnit,da.oneUnit],(err,data)=>{
        if(err) throw err;
        sql('update storage set storagenum = (storagenum + ?) where mid = ?',[da.instoragenum,da.mid],(err1,data1)=>{
            if(err1) throw err1;
            res.send('成功');
        });

    })
});

//增加出库信息
router.post('/insertoutstorage',(req,res)=>{
   var da = req.body;
   sql('insert into outstorage (mid,pihao,storagenum,outstorageDate) values (?,?,?,?)',[da.mid,da.pihao,da.outstoragenum,da.outstorageDate],(err,data)=>{
       if(err) throw err;
       sql('update storage set storagenum = (storagenum - ?) where mid = ?',[da.outstoragenum,da.mid],(err1,data1)=>{
           if(err1) throw err1;
           res.send('成功');
       });
   })
});














//查询入库信息表
router.get('/selectinstorage',(req,res)=>{
    sql('select * from instorage',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});
//查询出库信息表
router.get('/selectoutstorage',(req,res)=>{
    sql('select * from outstorage',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});








module.exports = router;
