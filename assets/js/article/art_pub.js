$(function () {

    var layer = layui.layer
    var form = layui.form

    // 定义加载文章分类的方法
    initCate()
    function initCate() {
        // 发送ajax
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var html = template('tpl-option', res)
                $('[name=cate_id]').html(html)
                // 调用 form.render() 方法
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面的按钮，绑定点击事件处理函数
    $('#btn-Add').on("click", function () {
        $('#file').click()
    })

    // 将选择的图片设置到裁剪区域中
    // 监听提交事件
    $('#file').on('change', function (e) {
        // 获取文件列表数组
        var files = e.target.files
        // 判断用户是否选择文件
        if (files.length === 0) {
            return
        }
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 发布文章的实现步骤
    // 定义文章的发布状态
    var art_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })
    // 基于Form表单创建FormData对象
    $('#form-pub').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 创建form对象
        var fd = new FormData(this)
        fd.append('state', art_state)
        // 放入图片
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(fd);
                // 发起请求
                publishArticle(fd)
            })
    })

    // // 发起请求实现功能
    // function publishArticle(fd) {
    //     $.ajax({
    //         method: 'POST',
    //         url: '/my/article/add',
    //         data: fd,
    //         // 注意：如果向服务器提交formData个数的数据
    //         success: function (res) {
    //             if (res.status !== 0) {
    //                 return layer.msg(res.message)
    //             }
    //             layer.msg(res.message)
    //             // 跳转页面
    //             location.href = "/article/art_list.html"
    //         }
    //     })
    // }

    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                // location.href = '/article/art_list.html'
                setTimeout(function () {
                    window.parent.document.getElementById('art_list').click()
                }, 500)
            }
        })
    }
})