$(function () {
    $('#codeimg').click(function () {
        $(this).attr('src', '/coder?' + new Date());
    });


    //登陆
    var iptuname = $('input[name="username"]');
    var iptpasswd = $('input[name="password"]');
    var inputCode = $('input[name="coder"]');
    var Uname = $('#inputUsername');
    var Pwd = $('#inputPassword');
    var code = $('#inputCode');
    var uerr = $('#uerr');
    var perr = $('#perr');
    var cerr = $('#cerr');
    iptuname.blur(function () {

        if (Uname.val() == '') {
            iptuname.parent().addClass("has-error");
            uerr.html('请输入账号');
            check = false;

        } else {
            iptuname.parent().removeClass("has-error");
        
            uerr.html('')
            check = true;
        };
        console.log(check)
        return check;


    });

    iptpasswd.blur(function () {


        if (Pwd.val() == '') {
            iptpasswd.parent().addClass("has-error");
            perr.html('请输入密码');
            check = false;
        } else {
            iptpasswd.parent().removeClass("has-error");
        
            perr.html('')
            check = true;
        }
        return check;
    });
    inputCode.blur(function () {


        if (code.val() == '') {
            inputCode.parent().addClass("has-error");
            cerr.html('请输入验证码');
            check = false;
        } else {
            inputCode.parent().removeClass("has-error");

            cerr.html('')
        }
        return check;
    });


    $('#login').click(function () {
        if (check = false) {
            return false;
        }

        $.ajax({
            type: "POST",
            url: "/users/login",
            data: $("#userlogin").serialize(),
            dataType: "JSON",
            success: function (result) {


                if (result.r == 'user_not') {
                    iptuname.parent().addClass("has-error");
                    uerr.html('账号错误');
                    return;
                }
                if (result.r == 'passwd_err') {
                    iptpasswd.parent().addClass("has-error");
                    perr.html('密码错误');
                    return;
                }
                if (result.r == 'coder_err') {
                    inputCode.parent().addClass("has-error");
                    cerr.html('验证码错误');
                    return;
                } else {
                    inputCode.parent().removeClass("has-error");
                    cerr.html('')
                    
                }

                if(result.r == 'ok'){
                    window.location.href = '/home';}

            }
        });
    });












})