// pages/index/sortVideo/sortVideo.js
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
        //加载直播列表
        wx.request({
            url: `${getApp().data.requestUrl}/live/0`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        liveData: res.data.res,
                    })
                }
            }
        })
    },
    goLive: function (e) { // 进入直播页面
        let staticData = e.currentTarget.dataset.static;
        if (staticData == "0") {
            wx.showModal({
                title: '',
                content: '直播尚未开启',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: `/pages/index/live/live?id=${id}`
        })
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
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})