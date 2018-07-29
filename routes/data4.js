var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');


//查询
/*
router.get('/selectsaleprice',(req,res)=>{
    sql('select * from sale',(err,data)=>{
        if(err) throw err;
        console.log(data);

        var date1 = new Date();
        var yy = date1.getFullYear();
        var mm = date1.getMonth()+1;
        var dd = date1.getDate();
        var arr = [];
        var a;
        var reg = /\d+/g;
        console.log(yy,mm,dd);

        for(var key in data){
            a = data[key]['saleDate'];
            var dataDate = a.match(reg);
            console.log(dataDate);
            //比较是这一天的
            if(yy == dataDate[0] && mm == dataDate[1] && dd == dataDate[2]){
                arr.push(data[key]);
            }
        }
        //console.log(arr);
        res.send(arr);
    })
});
*/
//每日销售情况
router.get('/selectsaleprice',(req,res)=>{
    sql('select saleDate, sum(saleprice) as thedaysaleallprice from sale group by saleDate',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//每月销售情况
router.get('/selectmonthsale',(req,res)=>{
    sql('select saleDateMonth, sum(saleprice) as monthsalePrice from sale group by saleDateMonth',(err,data)=>{
        if(err) throw err;
        console.log(data);

        res.send(data);
    })
});

//年销售情况
router.get('/yearsaleprice',(req,res)=>{
    sql('select saleDateYear,sum(saleprice) as yearsalePrice from sale group by saleDateYear',(err,data)=>{
        if(err) throw err;
        console.log(data);
        res.send(data);
    })
});

//查询销售明细
router.get('/saledetail',(req,res)=>{
    var saleid = req.query.saleid;
    sql('select saledetails.saleid,saledetails.mid,mname,mnors,saledetailnum,saledetailprice,type,memo from saledetails,medicineinfo where saledetails.mid = medicineinfo.mid and saledetails.saleid = ?',[saleid],(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});



module.exports = router;