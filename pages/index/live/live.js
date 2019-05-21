// pages/index/live/live.js
var refreshChatSetRun;
var giftAnimationRun;
var chatCache = [];
var vipUserListRun;
var vipUserList_1 = []; //游客列表
var vipUserList_2 = []; //普通会员列表
var vipUserList_3 = []; //白银会员列表
var vipUserList_4 = []; //黄金会员列表
var vipUserList_5 = []; //钻石会员列表
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _Category: "1",
        detail: "direction",
        _orientation: "vertical", //1.控制视频方向。2.控制视频大小
        imaUrl: getApp().data.imgUrl,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 页面渲染
        this.setData({
            chatCacheInfo: [],
        })
        this.setData({
            showChat: "show",
            showMemberist: "none",
            showReward: "none",
            liveId: options.id
        })
        //加载直播信息
        wx.request({
            url: `${getApp().data.requestUrl}/live/${options.id}`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        liveData: res.data.res,
                    })
                }
            }
        })
        // 向data中存入原始余额originalMoney,用于离开此页时判断是否提交修改余额请求
        this.setData({
            originalMoney: getApp().globalData.money
        })
        // 获取聊天信息
        this.refreshChatSet();
        // 启动聊天室定时器
        refreshChatSetRun = setInterval(() => {
            // 刷新数据
            this.refreshChatSet();
        }, 500);

        // 上传当前用户信息，并保存至本地数据列表
        wx.request({
            url: `${getApp().data.requestUrl}/member`,
            method: "POST",
            data: {
                member_id: getApp().globalData.member_id,
                username: getApp().globalData.username,
                user_id: getApp().globalData.userId,
                live_id: this.data.liveId
            },
            success: res => {
                if (res.data.code == 200) {

                }
            }
        })
    },
    //加载会员列表数据，并存入本地
    pushUserList: function() {
        wx.request({
            url: `${getApp().data.requestUrl}/member/{"live_id":${this.data.liveId},"user_id":${0}}`,
            success: res => {
                if (res.data.code == 200) {
                    let userInfo = res.data.res;
                    let userLv = undefined;
                    for (let i = 0; i < userInfo.length; i++) {
                        userLv = userInfo[i].id;
                        // 将自己的信息加入用户列表
                        if (userLv == 1) {
                            vipUserList_1.push(userInfo[i]); //游客列表
                        } else if (userLv == 2) {
                            vipUserList_2.push(userInfo[i]); //普通会员列表
                        } else if (userLv == 3) {
                            vipUserList_3.push(userInfo[i]); //白银会员列表
                        } else if (userLv == 4) {
                            vipUserList_4.push(userInfo[i]); //黄金会员列表
                        } else if (userLv == 5) {
                            vipUserList_5.push(userInfo[i]); //钻石会员列表
                        }
                    }
                }
            }
        })
    },
    //根据获取到的用户信息删除当前数组中的用户信息
    // delUserInfo: function(userInfo, vipUserList) {
    //     let userId = ""; //数组中的Id
    //     let delId = userInfo.id; //需要删除的数据Id
    //     for (let i = 0; i < vipUserList.length; i++) {
    //         // 获取每条数据的ID
    //         userId = vipUserList[i].id;
    //         // 如果id相等
    //         if (userId == delId) {
    //             // 删除该条数据
    //             vipUserList.splice(i, 1);
    //             break;
    //         }
    //     }
    //     // 返回新的数组
    //     return vipUserList;
    // },
    //删除退出用户信息
    delUserInfo: function (userInfo, vipUserList) {
        // 删除退出用户信息
        wx.request({
            url: `${getApp().data.requestUrl}/member/{"live_id":${this.data.liveId},"user_id":${getApp().globalData.userId}}`,
            success: res => {}
        })
    },
    //显示会员等级列表
    getVipLv: function() {
        // 加载会员等级
        wx.request({
            url: `${getApp().data.requestUrl}/vip`,
            success: res => {
                if (res.data.code == 200) {
                    let Tourist = {
                        id: 1,
                        name: "游客",
                        rule: 0
                    }
                    let freePlayer = {
                        id: 2,
                        name: "普通会员",
                        rule: 0
                    }
                    let vipPlayer = res.data.res;
                    vipPlayer.push(freePlayer)
                    vipPlayer.push(Tourist)
                    for (let i = 0; i < vipPlayer.length; i++) {
                        vipPlayer[i].click = "true"
                    }
                    this.setData({
                        vipLvData: vipPlayer,
                    })
                }
            }
        })
    },

    //显示增在看直播个用户列表,根据会员等级划分
    showVipList: function(e) {
        let click = e.currentTarget.dataset.onclick;
        if (click != "true") {
            return
        }
        let vioLv = e.currentTarget.dataset.id;
        let showListData = null;
        if (vioLv == 1) {
            showListData = vipUserList_1; //游客列表
        } else if (vioLv == 2) {
            showListData = vipUserList_2; //普通会员列表
        } else if (vioLv == 3) {
            showListData = vipUserList_3; //白银会员列表
        } else if (vioLv == 4) {
            showListData = vipUserList_4; //黄金会员列表
        } else if (vioLv == 5) {
            showListData = vipUserList_5; //钻石会员列表
        }
        // 此处只做列表的显示
        if (showListData.length != 0) {
            this.setData({
                vipLvData: showListData,
            })
        } else {
            this.setData({
                vipLvData: "",
            })
        }
        
    },
    // 请求聊天室消息
    refreshChatSet: function() {
        let chatInfo = "noMessage"
        //获取聊天信息
        wx.request({
            url: `${getApp().data.requestUrl}/chat`,
            method: "POST",
            data: {
                username: getApp().globalData.username,
                member_id: getApp().globalData.member_id,
                message: chatInfo,
                live_id: this.data.liveId
            },
            success: res => {
                if (res.data.code == 200) {
                    // noMessage代表空值
                    if (res.data.res.message != "noMessage") {
                        chatCache.push(res.data.res)
                    }
                    // 页面渲染
                    this.setData({
                        chatCacheInfo: chatCache,
                    })
                    // 聊天室部分显示最底部，不用下滑产看新消息
                    this.setData({
                        scrollTop: 180 * chatCache.length //计算高度
                    })
                    //删除聊天信息后端缓存
                    wx.request({
                        url: `${getApp().data.requestUrl}/chat/${this.data.liveId}`,
                        success: res => {}
                    })
                }
            }
        })
    },
    //提交聊天信息
    chatSet: function(e) {
        let chatInfo = e.detail.value.chatContent;
        if (chatInfo == "") {
            return
        }

        //提交聊天信息
        wx.request({
            url: `${getApp().data.requestUrl}/chat`,
            method: "POST",
            data: {
                username: getApp().globalData.username,
                member_id: getApp().globalData.member_id,
                message: chatInfo,
                live_id: this.data.liveId
            },
            success: res => {
                if (res.data.code == 200) {
                    // 此处不提交聊天信息后不在此函数中渲染，需要请求后端显示
                    // 清空聊天框
                    this.setData({
                        chatContent: "",
                    })
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady(res) {
        this.ctx = wx.createLivePlayerContext('live')
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {
        // 保存余额
        this.setMoney();
        // 用户退出时，删除他在会员列表中的数据
        this.delUserInfo();
        // 清理聊天室定时器
        clearInterval(refreshChatSetRun);
        // 清理--会员列表--定时器
        clearInterval(vipUserListRun);
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // 保存余额
        this.setMoney();
        // 用户退出时，删除他在会员列表中的数据
        this.delUserInfo();
        // 清理--聊天室--定时器
        clearInterval(refreshChatSetRun);
        // 清理--会员列表--定时器
        clearInterval(vipUserListRun);
    },
    statechange(e) {
        // console.log('live-player code:', e.detail.code)
    },
    error(e) {
        // console.error('live-player error:', e.detail.errMsg)
    },
    showChat: function(e) { //显示聊天部分
        // 清理--会员列表--定时器
        clearInterval(vipUserListRun);
        // 清理--聊天室--定时器
        clearInterval(refreshChatSetRun);
        this.setData({
            _Category: e.currentTarget.dataset.sel,
            showChat: "show",
            showMemberist: "none",
            showReward: "none"
        })
        
        // 启动聊天室定时器
        refreshChatSetRun = setInterval(() => {
            // 刷新数据
            this.refreshChatSet();
        }, 500);
    },
    showMemberist: function(e) { //显示会员列表
        // 清理--聊天室--定时器
        clearInterval(refreshChatSetRun);
        // 清空个各级别的会员列表数据
        vipUserList_1 = []; //游客列表
        vipUserList_2 = []; //普通会员列表
        vipUserList_3 = []; //白银会员列表
        vipUserList_4 = []; //黄金会员列表
        vipUserList_5 = []; //钻石会员列表
        this.setData({
            _Category: e.currentTarget.dataset.sel,
            showChat: "none",
            showMemberist: "show",
            showReward: "none"
        })
        //显示会员级别
        this.getVipLv();
        // 会员列表数据显示，获取初始数据
        this.pushUserList();
        
        // 启动--会员列表--定时器
        // vipUserListRun = setInterval(() => {
        //     // 数据刷新
        //     this.pushUserList();
        // }, 50000);
    },
    showReward: function(e) { //显示礼物列表
        // 清理--会员列表--定时器
        clearInterval(vipUserListRun);
        // 清理--聊天室--定时器
        clearInterval(refreshChatSetRun);
        this.setData({
            _Category: e.currentTarget.dataset.sel,
            showChat: "none",
            showMemberist: "none",
            showReward: "show"
        })
        //获取礼物列表
        wx.request({
            url: `${getApp().data.requestUrl}/gift`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        giftData: res.data.res,
                    })
                } else {
                    this.setData({
                        giftData: "",
                    })
                }
            }
        })
    },
    goAllArticle: function (e) { //进入文章页列表
        wx.navigateTo({
            url: "/pages/index/allArticle/allArticle"
        })
    },
    sendOut: function(e) { //送出礼物
        let price = e.currentTarget.dataset.money; //礼物价格
        let Balance = getApp().globalData.money; //余额
        price = Number.parseFloat(price)
        Balance = Number.parseFloat(Balance)
        if (Balance >= price) {
            Balance -= price;
            getApp().globalData.money = Balance;
            this.giftAnimation(e);
        } else {
            wx.showModal({
                title: '',
                content: '余额不足',
                showCancel: false
            })
        }
    },
    setMoney: function(e) { //向后端请求，保存余额(离开页面或者销毁页面时执行)
        let originalMoney = this.data.originalMoney;
        let nowMoney = getApp().globalData.money;
        // 如果价格没有改变，则不执行请求
        if (originalMoney == nowMoney) {
            return
        }
        wx.request({
            url: `${getApp().data.requestUrl}/gift`,
            data: {
                id: getApp().globalData.userId,
                money: getApp().globalData.money
            },
            method: "POST",
            success: res => {
                if (res.data.code == 201) {
                    // 保存返回的用户信息
                    getApp().saveUserInfo(res);
                }
            }
        })
    },
    giftAnimation: function(e) { //礼物动画
        // 获取当前点击元素的位置
        let position_x = e.detail.x;
        let position_y = e.detail.y;
        let giftimgUrl = e.currentTarget.dataset.giftimg; //礼物图片
        this.setData({
            position_x: position_x,
            position_y: position_y,
            opacity: "1", //元素初始透明度
            display: "block", //元素显示
            giftAnimationImg: giftimgUrl //礼物图片
        })
        let timeOpacity = 1; //初始透明度
        let that = this;
        clearInterval(giftAnimationRun)
        giftAnimationRun = setInterval(function() {
            timeOpacity -= 0.01; //计算透明
            position_y -= 5; //计算高度
            // 填充样式值
            that.setData({
                position_x: position_x,
                position_y: position_y,
                opacity: timeOpacity
            })
        }, 10); //10毫秒执行一次
        setTimeout(function() {
            that.setData({
                display: "none" //隐藏图
            })
            // 清理定时器
            clearInterval(giftAnimationRun)
        }, 400); //200毫秒后执行

    },
    onReady(res) {
        this.ctx = wx.createLivePlayerContext('player')
    },
    statechange(e) {
        // console.log('live-player code:', e.detail.code)
        // console.log('live-player code:', e.detail)
    },
    error(e) {
        // console.error('live-player error:', e.detail.errMsg)
    },
    fullscreenchangee(e) {
        // console.log('---------:', e.detail.fullScreen)
    },
    fullScreen: function(e) { //控制直播是否全屏
        let orientation = this.data._orientation;
        // horizontal 横向，全屏
        // vertical 竖向，半屏
        if (orientation == "horizontal") { //当前为全屏，执行半平
            this.setData({
                _orientation: "vertical"
            })
        } else if (orientation == "vertical") { //当前为半平，执行全屏
            this.setData({
                _orientation: "horizontal"
            })
        }
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
        // 清理--聊天室--定时器
        clearInterval(refreshChatSetRun);
        // 清理--会员列表--定时器
        clearInterval(vipUserListRun);
        wx.navigateBack({
            changed: true
        })
    }
})