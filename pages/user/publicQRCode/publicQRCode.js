// pages/user/publicQRCode/publicQRCode.js
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
        // 默认显示图片   "最好用网络图[本地图片有时候不能预览]"
        var imgUrl = getApp().data.requestUrl
        this.setData({
            imgalist: [`${imgUrl}/gzh.jpg`]
        })
    },

    // 点击图片放大，长按后可操作
    previewImage: function (e) {
      console.log(this.data.imgalist)
        wx.previewImage({
            current: this.data.imgalist, // 当前显示图片的http链接   
            urls: this.data.imgalist // 需要预览的图片http链接列表   
        })
        // wx.getImageInfo({// 获取图片信息（此处可不要）
        //     src: 'url',//图片路径
        //     success: function (res) {
        //         console.log(res.width)
        //         console.log(res.height)
        //     }
        // })
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