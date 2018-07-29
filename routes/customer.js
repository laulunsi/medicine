var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');

router.get('/selectmedicine',(req,res)=>{
    sql('select storage.mid,mname,marea,type,storagenum,allUnit,instorageDate,pihao,salePrice,memo from storage,medicineinfo where storage.mid = medicineinfo.mid',(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});

//接受前台发送的 购买信息
router.post('/buymedicine',(req,res)=>{
    var buyInfo = req.body.buyInfo;
    var jsonInfo = JSON.parse(buyInfo);
    console.log(jsonInfo);
    console.log(req.session.userid);
    var allPrice = 0;
    for(var key in jsonInfo){
        allPrice = allPrice + (jsonInfo[key]['saleprice']*jsonInfo[key]['saleNum']);
    }
    var date = new Date();
    var yy = date.getFullYear();
    var mm = date.getMonth()+1;
    var dd = date.getDate();
    var saleDate = yy + '-' + mm + '-' + dd;
    var saleDateMonth = yy + '-' + mm;
    var saleDateYear = yy;
    var saleid = ''; //这个保存现在新建的销售单号
    var k = 0; //这个保存销售详细单号的数量
    sql('insert into sale(cid,saleprice,saleDate,saleDateMonth,saleDateYear,saleMemo) values (?,?,?,?,?,?)',[req.session.userid,allPrice,saleDate,saleDateMonth,saleDateYear,jsonInfo[0]['saleMemo']],(err,data)=>{
        if(err) throw err;
        console.log('销售详情单 成功');
        sql('select saleid from sale order by saleid desc limit 0,1',(err1,data1)=>{
            saleid = data1[0]['saleid'];
            console.log(saleid);
            for(var j=0;j<jsonInfo.length;j++){
                sql('insert into saledetails(saleid,mid,saledetailnum,saledetailprice) values(?,?,?,?)',[saleid,jsonInfo[j]['mid'],jsonInfo[j]['saleNum'],(jsonInfo[j]['saleNum']*jsonInfo[j]['saleprice'])],(err,data)=>{
                    if(err) throw err;
                    k++;
                    if(k === jsonInfo.length){//判断那个销售详情单是否完成
                        console.log('销售单是否完成了呢');
                        k = 0; //重新赋值为0
                        for(var j=0;j<jsonInfo.length;j++){
                            sql('insert into outstorage (mid,pihao,storagenum,outstorageDate) values(?,?,?,?)',[jsonInfo[j]['mid'],jsonInfo[j]['salepihao'],jsonInfo[j]['saleNum'],saleDate],(err5,data5)=>{
                                if(err5) throw err5;
                                k++;
                                if(k === jsonInfo.length){ //判断出库表是否完成
                                    k = 0; //重新赋值为0

                                    for(var j=0;j<jsonInfo.length;j++){ //这里让库存数量变化
                                        sql('update storage set storagenum = (storagenum - ?) where mid = ?',[jsonInfo[j]['saleNum'],jsonInfo[j]['mid']],(err6,data6)=>{
                                            if(err6) throw err;
                                            k++;
                                            if(k === jsonInfo.length){
                                                console.log('库存出库成功');
                                                res.send('成功');
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
        });

});

//买货记录
router.get('/buymedicinelog',(req,res)=>{
    sql('select * from sale where cid = ?',[req.session.userid],(err,data)=>{
        res.send(data);
    })
});

//具体的某一次的买货记录
router.get('/selectbuydetail',(req,res)=>{
    var saleid = req.query.saleid;
    console.log(saleid);
    sql('select saledetails.saleid,saledetails.mid,mname,mnors,saledetailnum,saledetailprice,type,memo from saledetails,medicineinfo where saledetails.mid = medicineinfo.mid and saledetails.saleid = ?',[saleid],(err,data)=>{
        if(err) throw err;
        res.send(data);
    })
});




module.exports = router;