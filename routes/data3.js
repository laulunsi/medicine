var express = require('express');
var router = express.Router();
var sql = require('../module/mysql');

//记录每次的销售行为
router.get('/selectbuymedicinelog',(req,res)=>{
   sql('select * from sale',(err,data)=>{
       res.send(data);
   })
});


module.exports = router;