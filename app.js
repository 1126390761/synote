const express= require("express");
const mysql=require('mysql');
const bodyParser=require('body-parser');
const async=require('async');
const cookieParser= require('cookie-parser');
const session= require('express-session');
const ejs=require('ejs');
const svgCaptcha=require('svg-captcha');
const multer = require('multer');



const app = express();
//定义各种参数
let hostname = 'http://lulaoshi:81/';
let secret = 'sports.app.myweb.www';
// 启用中间件
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(secret));
//模板引擎设置
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', './views');
//数据库连接
global.conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'123456',
    port:3306,
    database:'synote'
});
conn.connect();
//启用session
app.use(session({
    secret:secret,
    resave:true,
    saveUninitialized: true,
    cookie: {maxAge:30*24*3600*1000}
}));

//文件上传
const diskstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `./uploads/${new Date().getFullYear()}/${(new Date().getMonth()+1).toString().padStart(2, '0')}`);
    },
    filename: function (req, file, cb) {
        let filename = new Date().valueOf() + '_' +  Math.random().toString().substr(2, 8) + '.' + file.originalname.split('.').pop();
        cb(null, filename)
    }
});
const upload = multer({storage: diskstorage});
// 验证码图片
app.get('/coder', (req, res) => {
    var captcha = svgCaptcha.create({noise:4,ignoreChars: '0o1i', size:1,background: '#cc9966',height:38, width:90});
	req.session.coder = captcha.text;
	
	res.type('svg'); // 使用ejs等模板时如果报错 res.type('html')
	res.status(200).send(captcha.data);
    
});

// 上传图片接口
app.post('/uploads', upload.array('images', 1000), (req ,res)=>{
    console.log(req.files);
    let data = [];
    for (const ad of req.files) {
        //把反斜线转成斜线，防止各种转义引起的路径错误
        let path = hostname +  ad.path.replace(/\\/g, '/');
        data.push(path);
    }
    res.json({
        "errno": 0,
        "data": data
    });
});
//方便测试---后面要删除
// app.use(function(req ,res, next){
//     req.session.aid = 1;
//     req.session.username = '管理员';
//     next();
// });

//子路由
//管理员登录
app.use('/admin/login', require('./module/admin/login'));
//管理员管理子路由
app.use('/admin', require('./module/admin/index'));


//前台用户子路由
//app.use('/', require('./module/user/'));
//试题部分
//app.use('/questions', require('./module/user/questions'));


//静态资源托管
app.use('/uploads', express.static('uploads'));
app.use(express.static('static'));

app.listen(81, () => {
    console.log('成功启动...');
});