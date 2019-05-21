// pages/user/user.js

// 控制底部导航选中状态
const navimg = {
    "Home": "homeNone",
    "Classroom": "sort",
    "myCourse": "shop",
    "User": "userShow",
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navImg: navimg,
        nickName: getApp().globalData.nickName,
        avatarUrl: getApp().globalData.avatarUrl,
        money: getApp().globalData.money,
        end_time: getApp().globalData.end_time,
        userId: getApp().globalData.userId,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //获取用户信息，会员等级，会员到期时间，账户余额
        this.setData({
            nickName: getApp().globalData.nickName,
            avatarUrl: getApp().globalData.avatarUrl,
            money: getApp().globalData.money,
            end_time: getApp().globalData.end_time,
            userId: getApp().globalData.userId,
            vipName: getApp().globalData.vipName
        })
    },
    goHome: function() { // 首页
        wx.redirectTo({
            url: "/pages/index/index"
        })
    },
    goClassroom: function() { // 学习课堂
        wx.redirectTo({
            url: "/pages/classroom/classroom"
        })
    },
    myCourse: function() { // 我的课程
        wx.redirectTo({
            url: "/pages/myCourse/myCourse"
        })
    },
    goUser: function() { // 我的会员
        wx.redirectTo({
            url: "/pages/user/user"
        })
    },
    goRecharge: function() { // 去充值页
        wx.navigateTo({
            url: "/pages/user/recharge/recharge"
        })
    },
    goUpVip: function () { // 升级会员
        wx.navigateTo({
            url: "/pages/user/upVip/upVip"
        })
    },
    goSetUserInfo: function() { // 去修改信息页或者注册页
        wx.navigateTo({ //去修改信息页
            url: "/pages/user/setUserInfo/setUserInfo"
        })
    },
    goProductInfo: function () { // 产品介绍productInfo
        wx.navigateTo({
            url: "/pages/user/productInfo/productInfo"
        })
    },
    goOutUrl: function() { // 外部链接跳转
        wx.navigateTo({
            url: "/pages/user/out/out"
        })
    },
    publicQR: function() { // 进入小程序二维码页
        wx.navigateTo({
            url: "/pages/user/publicQRCode/publicQRCode"
        })
    }
})