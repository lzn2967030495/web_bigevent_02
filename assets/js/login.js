// 入口函数
$(function () {
    // 点击去注册，隐藏登录区域，显示注册区域
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    // 点击去登录，显示登录区域，隐藏注册区域
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    // 自定义校验规则
    var form = layui.form
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 确认密码规则
        repwd: function (value) { // value 密码值
            // 获取注册再次确认密码值
            var pwd = $('.reg-box input[name=password]').val()
            if (pwd !== value) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 注册
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                // 提交成功后
                layer.msg(res.message, { icon: 6 })
                // 手动切换到登录表单
                $("#link_login").click()
                // 回车
                $('#zhuce').on('keyup', function () {
                    if (keyCode === 13) {
                        $("#link_login").click()
                    }
                })
                // 重置form表单
                $('#form_reg')[0].reset()
            }
        })
    })

    // 发起登录的Ajax请求
    // 监听登录表单的提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                layer.msg(res.message, { icon: 6 })
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})