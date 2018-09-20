const express = require("express");
const md5 = require("md5");
const router = express.Router();

router.get('/', (req, res) => {
    res.render('users/login')


});
router.post('/', (req, res) => {
    let d= req.body;
    //验证验证码
    console.log(d);
    
    if(d.coder.toLowerCase() != req.session.coder.toLowerCase()){
        res.json({r:'coder_err'});
        return ;
    }
    //查询字段
    let sql = 'SELECT * FROM users WHERE status = 1 AND username = ? ';
    //验证账户
    conn.query(sql, d.username, (err, result) => {
        if (!result.length) {
            res.json({ r: 'user_not' });
            return;
        };
        if (md5(d.password) != result[0].passwd) {
            res.json({ r: 'passwd_err' });
            return;
        };
        req.session.uid = result[0].uid;
        req.session.username = result[0].username;
        let sql = 'UPDATE SET users loginnum = loginnum + 1, lasttimes = ? WHERE aid = ?';
        conn.query(sql, [new Date().toLocaleString(), result[0].aid], (err, result) => {
            res.json({ r: 'ok' });
        });

    });

});
module.exports = router 