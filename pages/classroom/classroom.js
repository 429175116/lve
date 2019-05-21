// pages/classroom/classroom.js

// 控制底部导航选中状态
const navimg = {
    "Home": "homeNone",
    "Classroom": "sortShow",
    "myCourse": "shop",
    "User": "showNone",
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navImg: navimg,
        _Switch: "1",
        imaUrl: getApp().data.imgUrl
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //加载类别
        //加载默认列别的视频列表
        this.getCategory();
    },
    showSwitch: function(e) { // 点击直播回放，精选课堂，且换显示
        this.setData({
            _Switch: e.currentTarget.dataset.sel
        })
    },
    clickCategory: function(e) { // 点击类别
        let id = e.currentTarget.dataset.id;
        this.setData({
            _Category: id
        })
        this.getVideoList(id);
    },
    getCategory: function() { // 视频类别和视频列表请求--函数封装
        // //加载类别
        wx.request({
            url: `${getApp().data.requestUrl}/cate/1`,
            success: res => {
                if (res.data.code == 200) {
                    var data = res.data.res;
                    var listDataShow = [];
                    for (var i in data) {
                        if (data[i].id > 20 || data[i].id <= 16) {
                            listDataShow.push(data[i])
                        }
                    }
                    this.setData({
                        sort: listDataShow
                    })
                    // 给导航第一个加入选中样式
                    this.setData({
                        _Category: listDataShow[0].id,
                    })
                    //加载视频列表
                    this.getVideoList(this.data._Category);
                }
            }
        })
    },
    getVideoList: function(e) { //加载视频列表
        //清空原有数据
        this.setData({
            voideListData: "",
        })
        wx.request({
            url: `${getApp().data.requestUrl}/video/${e}`,
            success: res => {
                if (res.data.code == 200) {
                    let voideListData = res.data.res;
                    let vipName = "";
                    for (let i = 0; i < voideListData.length; i++) {
                        vipName = voideListData[i].name;
                        vipName = vipName.split("会")[0];
                        voideListData[i].name = vipName;
                    }
                    this.setData({
                        voideListData: voideListData,
                    })
                } else {
                    this.setData({
                        articleData: "",
                    })
                }
            }
        })
    },
    //进入视频页
    goVideo: function(e) { // 进入视频播放页
        // member_id和userMember_id数据类型为number
        // 获取用户会员等级
        let userMember_id = getApp().globalData.member_id;
        // 游客无权限观看视频，需要注册
        if (userMember_id == 1) {
            wx.showModal({
                title: '',
                content: '游客无观看权限，请在个人中心注册',
                showCancel: false
            })
            return
        }
        let member_id = e.currentTarget.dataset.member_id;
        // 不可观看高于自己会员等级的视频
        if (userMember_id < member_id) {
            wx.showModal({
                title: '',
                content: '会员等级不够，无观看权限',
                showCancel: false
            })
            return
        }
        // 获取视频ID
        let id = e.currentTarget.dataset.id;
        let typeId = this.data._Category;
        wx.navigateTo({
            url: `/pages/index/video/video?id=${id}&typeId=${typeId}`
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
    }
})