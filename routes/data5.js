var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');


//查询药品的信息
router.get('/selectmedicine',(req,res)=>{
   sql('select * from medicineinfo',(err,data)=>{
       if(err) throw err;
       res.send(data);
   })
});

//查询库存的情况
router.get('/selectstorage',(req,res)=>{
    sql('select * from storage',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//查询退回供应商的信息
router.get('/selectguoqi',(req,res)=>{
    sql('select * from guoqi',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});


//查询供应商的信息
router.get('/selectsupplier',(req,res)=>{
    sql('select * from supplier',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//与供应商往来账目查询
router.get('/selectsupplierprice',(req,res)=>{
    sql('select instorageid,mid,pihao,(inprice*instoragenum) as payprice,instorageDate,allUnit,oneUnit from instorage',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});



module.exports = router;