$(function () {
    var layer = layui.layer
    var form = layui.form

    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date)
        var y = dt.getFullYear()
        var m = padZero(dt.getMonth())
        var d = padZero(dt.getDate())
        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 获取数据
    initTable()
    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                var html = template('tpl-table', res)
                $('tbody').html(html)
                // 分页
                renderPage(res.total)
            }
        })
    }

    // 发起请求获取并渲染文章分类的下拉选择框
    initCate()
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 渲染
                var hmtl = template('tpl-cate', res)
                $('[name=cate_id]').html(hmtl)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        // 阻止
        e.preventDefault()
        // 获取
        var state = $('[name=state]').val()
        var cate_id = $('[name=cate_id]').val()
        // 赋值
        q.state = state
        q.cate_id = cate_id
        // 初始化文章列表
        initTable()
    })

    // 定义渲染分页的方法，接收一个总数量的参数
    var laypage = layui.laypage
    function renderPage(total) {
        // console.log(total) // 获取分页数量
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页几条
            curr: q.pagenum, // 第几页

            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条

            // 触发jump 
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                q.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    // 重新渲染
                    initTable()
                }
            }
        });
    }

    // 删除功能
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // console.log(len);
        // 获取id
        var id = $(this).attr('data-id')
        // 询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    if (len === 1) {
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // if ($('.btn-delete').length == 1 && q.pagenum > 1) q.pagenum--
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    // 重新渲染
                    initTable()
                }
            })
            // 关闭
            layer.close(index);
        });
    })
})