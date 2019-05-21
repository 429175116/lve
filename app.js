//app.js
App({
    data: {
        // 全局变量，接口请求地址
        // requestUrl: "http://www.live.com",//线下
        requestUrl: "https://live.beaconway.cn", //线上
        AppID: "wxfc7a0ffe1fd98ca2",
        AppSecret: "ce1f996b645bd584a1534f6fd17379a9",//你造么，这是假的
        imgUrl: "https://live.beaconway.cn/uploads/"
    },
    globalData: function() {
        //用于存值
    },
    onLaunch: function() {
        // 展示本地存储能力
        let logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },
    // 小程序初始化，只执行一次
    onLaunch: function(options) {},
    // 将用户信息存入全局
    saveUserInfo: function (options) {
        let gatData = options.data.res;
        //如果无会员到期时间，则显示会员名称
        if (gatData.end_time == "0000-00-00") {
            gatData.end_time = gatData.name;
        } else if (!gatData.end_time) {
            gatData.end_time = gatData.name;
        }
        getApp().globalData.birthday = gatData.birthday;//生日
        getApp().globalData.end_time = gatData.end_time;//会员到期时间
        getApp().globalData.userId = gatData.id;//用户ID
        getApp().globalData.navImg = gatData.img;//用户图像
        getApp().globalData.member_id = gatData.member_id;//会员等级
        getApp().globalData.vipName = gatData.name;//会员等级名称
        getApp().globalData.money = gatData.money;//余额
        getApp().globalData.openid = gatData.openid;//用户的openid
        getApp().globalData.phone = gatData.phone;//用户的手机号
        getApp().globalData.sex = gatData.sex;//性别
        getApp().globalData.static = gatData.static;//启用状态
        getApp().globalData.username = gatData.username;//用户名称
        getApp().globalData.wxname = gatData.wxname;//微信名称
        getApp().globalData.weicode = gatData.weicode;//微信号码
    },

})