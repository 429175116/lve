// pages/user/setUserInfo/setUserInfo.js
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
        this.setData({
            username: getApp().globalData.username,
            avatarUrl: getApp().globalData.avatarUrl,
            userId: getApp().globalData.userId,
            weicode: getApp().globalData.weicode,
            phone: getApp().globalData.phone,
            birthday: getApp().globalData.birthday
        })
    },
    onTabsItemTap: function(e) { //用户注册
        // 获取信息
        let username = e.detail.value.username;
        let phone = e.detail.value.phone;
        let weicode = e.detail.value.weicode;
        let birthday = e.detail.value.birthday;
        let id = this.data.userId;
        if (username == "" || phone == "" || weicode == "" || birthday == "") {
            wx.showModal({
                content: '请输入信息',
                showCancel: false
            })
            return
        }
        //修改用户信息
        wx.request({
            url: `${getApp().data.requestUrl}/cinfo/`,
            method: "POST",
            data: {
                username: username,
                phone: phone,
                weicode: weicode,
                birthday: birthday,
                id: id
            },
            success: function(res) {
                // 将用户ID存入本地
                if (res.data.code == 201) {
                    // 用户信息存入全局
                    getApp().saveUserInfo(res);
                    wx.showModal({
                        content: `修改成功`,
                        showCancel: false
                    })
                    setTimeout(function () {
                        wx.redirectTo({
                            url: "/pages/user/user"
                        })
                    }, 3000)
                }
            }
        })
    },
    //  点击时间组件确定事件  
    bindTimeChange: function(e) {
        this.setData({
            times: e.detail.value
        })
    },
    //  点击日期组件确定事件  
    bindDateChange: function(e) {
        this.setData({
            birthday: e.detail.value
        })
    },
    //  点击城市组件确定事件  
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    },
    goReturn: function() { // 返回上一页
        wx.navigateBack({
            changed: true
        })
    }
})