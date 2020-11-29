$(function () {
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // 渲染模板引擎
                var html = template('tpl-table', res)
                $('tbody').html(html)
            }
        })
    }

    // 导入layer
    var layer = layui.layer
    $('#btnAdd').on('click', function () {
        // 显示添加框架
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });

    })

    // 实现添加文章分类的功能
    var indexAdd
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        // 发送请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                initArtCateList()
                layer.msg(res.message)
                // 关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    // 通过 事件委派 的形式，为 btn-edit 按钮绑定点击事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        var form = layui.form
        // 为修改文章分类的弹出层填充表单数据
        var Id = $(this).attr('data-id')
        $.ajax({
            method: "GET",
            url: '/my/article/cates/' + Id,
            success: function (res) {
                // 渲染
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            // 获取值
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initArtCateList()
                // 重新渲染
                layer.msg(res.message)
                layer.close(indexEdit)
            }
        })
    })

    // 删除功能
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取id
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    initArtCateList()
                    layer.msg(res.message)
                    layer.close(index);
                }
            })
        });
    })
})