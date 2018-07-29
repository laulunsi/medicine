var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');

//检查库存的下限
router.get('/checkstorageless',(req,res)=>{
    sql('select * from storage where storagenum < storageLessNum',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//检查过期的药品
router.get('/checkDate',(req,res)=>{
    sql('select storageid,storage.mid,medicineinfo.mname,pihao,storagenum,inprice,saleprice,canDate from storage,medicineinfo where medicineinfo.mid = storage.mid',(err,data)=>{
        if(err) throw err;

        var date1 = new Date();
        var yy = date1.getFullYear();
        var mm = date1.getMonth()+1;
        var dd = date1.getDate();
        var arr = [];
        var a;
        var reg = /\d+/g;

        for(var key in data){
            a = data[key]['canDate'];
            var dataDate = a.match(reg);
            if(yy > dataDate[0]){ //比较年份
                arr.push(data[key]); //直接过期
            }else if(yy == dataDate[0]){ //年份相等 比较月份
                if(mm > dataDate[1]){
                    arr.push(data[key]); //过期
                }else if(mm == dataDate[1]){
                    //月份相等 再来比较日
                    if(dd > dataDate[2]){
                        arr.push(data[key]);
                    }
                }
            }
        }
        res.send(arr);
    });
});

//从库中删除 并退回供应商
router.get('/deleteselectcanDate',(req,res)=>{
    var info = JSON.parse(req.query.deleteid);
    var arr;
    var k = 0;
    var a = '(';
    for(var j=0;j<info.length;j++){
        if(j === info.length-1){
            a += (info[j] +')');
        }else{
            a += info[j] + ',';
        }
    }
    console.log(a);
    sql('select * from storage where storageid in '+a+'',(err,data)=>{
        arr = data;
        console.log(arr);
        for(var j=0;j<arr.length;j++){
            sql('insert into guoqi (storageid,mid,pihao,storagenum,instorageDate,canDate,inprice,saleprice) values (?,?,?,?,?,?,?,?)',[arr[j]['storageid'],arr[j]['mid'],arr[j]['pihao'],arr[j]['storagenum'],arr[j]['instorageDate'],arr[j]['canDate'],arr[j]['inprice'],arr[j]['salePrice']],(err2,data2)=>{
                k++;
                if(k === arr.length){
                    k = 0;
                    for(var j=0;j<info.length;j++){
                        sql('delete from storage where storageid = ?',[info[j]],(err1,data1)=>{
                            k++;
                            if(k === info.length){
                                res.send('成功');
                            }
                        })
                    }
                }
            })
        }
    })
    //将要删除的数据保存起来

});

//对有问题的药品退回供应商
router.get('/selectguoqi',(req,res)=>{
    sql('select * from guoqi',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});


module.exports = router;