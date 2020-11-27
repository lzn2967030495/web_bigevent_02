$(function () {

    // 获取表单
    var form = layui.form
    // 自定义规则
    form.verify({
        nickname: function (value) { // 获取用户昵称的值
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    // 用户的基本信息调用
    initUserInfo()
    var layer = layui.layer
    // 获取用户的基本信息
    function initUserInfo() {
        // 发起请求
        $.ajax({
            method: "GET",
            url: '/my/userinfo',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!', { icon: 5 })
                }
                // 成功渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 实现表单的重置效果
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        // 重新渲染数据
        initUserInfo()
    })

    // 发起请求更新用户的信息
    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发送ajax数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('用户信息修改成功!', { icon: 5 })
                }
                layer.msg('恭喜您,用户信息修改成功!', { icon: 6 })
                // 调用父页面方法更新用户信息和头像
                window.parent.getUserInfo()
            }
        })
    })

})