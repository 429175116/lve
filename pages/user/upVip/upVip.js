// pages/user/recharge/recharge.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            userId: getApp().globalData.userId,
            avatarUrl: getApp().globalData.avatarUrl,
            nickName: getApp().globalData.nickName
        })
        // 加载会员等级
        wx.request({
            url: `${getApp().data.requestUrl}/vip`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        vipLvData: res.data.res,
                    })
                }
            }
        })
    },
    vipSel: function (e) {
        let vipLv = this.data.vipLvData[e.detail.value]
        let member_id = vipLv.id;//等级ID
        let name = vipLv.name;//等级名称
        let rule = vipLv.rule;//等级价格
        this.setData({
            member_id:member_id,
            vipName: name,
            vipRule: `￥${rule}`,
            member_name: name,
            member_price: rule
        })
    },
    upVip: function (e) {
        let vipName = e.detail.value.vipName;
        let vipRule = e.detail.value.vipRule;
        //必须选中一个会员等级
        if (vipName == "" || vipRule == "￥") {
            wx.showModal({
                content: '请选择会员等级',
                showCancel: false
            })
            return
        }
        vipRule = vipRule.split("￥").pop();
        // 将金额转为int类型
        vipRule = parseInt(vipRule);
        let money =  getApp().globalData.money;
        // 判断余额是否充足
        if (vipRule > money) {
            wx.showModal({
                content: '余额不足',
                showCancel: false
            })
            return
        }
        vipRule = money - vipRule;
        let id = this.data.userId;
        //升级VIP
        wx.request({
            url: `${getApp().data.requestUrl}/vip/`,
            method: "POST",
            data: {
                member_id: this.data.member_id,
                money: vipRule,
                id: id,
                member_name: this.data.member_name,
                member_price: this.data.member_price
            },
            success: function (res) {
                // 将用户ID存入本地
                if (res.data.code == 201) {
                    // 用户信息存入全局
                    getApp().saveUserInfo(res);
                    let gatData = res.data.res;
                    wx.showModal({
                        content: `已升级至${gatData.name}`,
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
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})