$(function () {

    // 导入 form 模块
    var form = layui.form
    // 利用 form.verify()  来定义规则
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不重复
        samePwd: function (value) {
            // value 新密码
            // 获取旧密码
            if (value == $('[name=oldPwd]').val()) {
                return '原密码与新密码不能相同'
            }
        },
        // 两次密码必须相同
        rePwd: function (value) {
            // value 确认密码
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        // 阻止表单提交
        e.preventDefault()
        // 发送请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                layui.layer.msg('修改密码成功！', { icon: 6 })
                // 修改后重置表单内容
                $('.layui-form')[0].reset()
            }
        })
    })
})