// pages/user/recharge/recharge.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        avatarUrl: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            avatarUrl: getApp().globalData.avatarUrl,
            nickName: getApp().globalData.nickName
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    //充值
    recharge: function(e) {
        var that = this;
        var recharge = e.detail.value.recharge;
        if (!recharge) { //数据未空
            wx.showModal({
                title: '金额不能未空',
            })
            return
        }
        wx.request({
            url: `${getApp().data.requestUrl}/pay`,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
                "body": "充值",
                "id": getApp().globalData.userId,
                "openid": getApp().globalData.openid,
                "oldMoney": getApp().globalData.money,
                "total": recharge,
            },
            success: function(res) {
                wx.requestPayment({
                    'timeStamp': res.data.timeStamp,
                    'nonceStr': res.data.nonceStr,
                    'package': res.data.package,
                    'signType': res.data.signType,
                    'paySign': res.data.paySign,
                    'success': function(res) {
                        //跳转至首页，获取用户所哟信息-->用于刷新余额数量
                        wx.redirectTo({
                            url: "/pages/index/index"
                        })
                    },
                    'fail': function(res) {
                        wx.showModal({
                            title: '支付失败',
                        })
                    }
                })
            }
        })
    },
    onGotUserInfo: function () {
        var that = this;
        var nickName, avatarUrl, gender;
        wx.getUserInfo({
            success: function (res) {
                getApp().globalData.nickName = res.userInfo.nickName;
                getApp().globalData.avatarUrl = res.userInfo.avatarUrl;
                getApp().globalData.gender = res.userInfo.gender;
                nickName = res.userInfo.nickName
                avatarUrl = res.userInfo.avatarUrl
                gender = res.userInfo.gender
            }
        })
        wx.login({
            success: res => {
                if (res.code) {
                    // code存入全局
                    getApp().globalData.code = res.code;
                    if (getApp().globalData.code) {
                        that.setData({
                            show: "none"
                        })
                    }
                    // 登录请求
                    wx.request({
                        url: `${getApp().data.requestUrl}/login/`,
                        data: {
                            code: res.code,
                            nick: nickName,
                            avaurl: avatarUrl,
                            sex: gender,
                        },
                        success: function (res) {
                            // 将用户ID存入本地
                            if (res.data.code == 200 || res.data.code == 201) {
                                // 用户信息存入全局
                                getApp().saveUserInfo(res);
                                wx.navigateBack({
                                    changed: true
                                })
                            }
                        }
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
    goReturn: function() { // 返回上一页
        wx.navigateBack({
            changed: true
        })
    }
})