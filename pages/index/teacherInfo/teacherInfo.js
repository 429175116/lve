// pages/classroom/teacherInfo/teacherInfo.js

// 导入转html包
var WxParse = require('../../../wxParse/wxParse.js');
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
        //老师信息加载
        wx.request({
            url: `${getApp().data.requestUrl}/teacher/${options.id}`,
            success: res => {
                if (res.data.code == 200) {
                    var teacher = res.data.res;
                    this.setData({
                        teacherData: res.data.res,
                    })
                    // html转换显示
                    WxParse.wxParse('article', 'html', teacher.content, this, 5);
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
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})