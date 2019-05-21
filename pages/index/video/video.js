// pages/index/video/video.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let cateId = options.id;
        let typeId = options.typeId;
        let userId = getApp().globalData.userId;
        wx.request({
            url: `${getApp().data.requestUrl}/videoplayer/{"user_id":${userId},"video":${cateId},"cate_id":${typeId}}`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        videoData: res.data.res,
                    })
                }
            }
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
    videoErrorCallback: function(e) {
        console.log('视频错误信息:' + e.detail.errMsg);
    },
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})