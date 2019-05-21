// pages/index/allArticle/allArticle.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imaUrl: getApp().data.imgUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 加载文章分类
        wx.request({
            url: `${getApp().data.requestUrl}/cate/2`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        sort: res.data.res,
                    })
                    // 给导航第一个加入选中样式
                    this.setData({
                        _Category: res.data.res[0].id,
                    })
                    this.gatarticleList(res.data.res[0].id);
                }
            }
        })

    },
    // 加载文章列表
    gatarticleList: function(e) {
        this.setData({
            articleData: "",
        })
        //加载文章列表
        wx.request({
            url: `${getApp().data.requestUrl}/article/{"bid":0,"cateId":${e}}`,
            success: res => {
                if (res.data.code == 200) {
                    let dataList = res.data.res
                    let newdataList = [];
                    // 数组反转
                    for (var i = dataList.length - 1; i >= 0; i--) {
                        newdataList.push(dataList[i])
                    }
                    this.setData({
                        articleData: newdataList,
                    })
                }
            }
        })
    },
    goArticle: function(e) { // 进入文章页,查看文章
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/index/article/article?id=${id}`
        })
    },
    clickCategory: function(e) { // 点击类别
        let id = e.currentTarget.dataset.id;
        this.setData({
            _Category: id
        })
        this.gatarticleList(id);
    },
    //分享
    onShareAppMessage: function () {
        let pages = getCurrentPages() //获取加载的页面
        let currentPage = pages[pages.length - 1] //获取当前页面的对象
        let url = currentPage.route //当前页面url
        return {
            title: this.postData.title,
            desc: this.postData.content,
            path: url
        }
    },
    goReturn: function() { // 返回上一页
        wx.navigateBack({
            changed: true
        })
    }
})