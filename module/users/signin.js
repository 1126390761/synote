const express = require("express");
const router = express.Router();
const md5 =require('md5')
router.get('/',(req,res)=>{
    res.render('users/signin')


})
router.post('/',(req,res)=>{
    //验证码检测
    let d = req.body;
   if (d.coder.toLowerCase() !=req.session.coder.toLowerCase()) {
       res.json({r:"coder_err"});
       return;
       
   }
   let sql = 'SELECT * FROM users WHERE status = 1 AND username = ? '
   conn.query(sql,d.username,(err,result)=>{
       if (result.length) {
           res.json({r:"hasuser"});
       }
       else{
        let sql = 'INSERT INTO users( username, passwd, loginnum, lasttimes) VALUES (?,?,?,?)';
        let data =[
            d.username,
            md5(d.password),
            0,
            new Date().toLocaleString(),
        ];
        conn.query(sql, data, (err, result)=>{
            if(err){
                res.json({r:'db_err'});
                console.log(err)
                return ;
            }
            //返回成功
            
            res.json({r:'success'});
        });
       }
   })

})
module.exports = router;