// pages/index.js

// 控制底部导航选中状态
const navimg = {
    "Home": "homeShow",
    "Classroom": "sort",
    "myCourse": "shop",
    "User": "showNone",
}
const videoListData = [];
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navImg: navimg,
        show: "block",
        imaUrl: getApp().data.imgUrl,
        memberId: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var nickName, avatarUrl, gender;
        // 获取用户信息，登陆
        wx.getUserInfo({
            success: res => {
                getApp().globalData.nickName = res.userInfo.nickName;
                getApp().globalData.avatarUrl = res.userInfo.avatarUrl;
                getApp().globalData.gender = res.userInfo.gender;
                nickName = res.userInfo.nickName
                avatarUrl = res.userInfo.avatarUrl
                gender = res.userInfo.gender
                if (nickName) {
                    if (getApp().globalData.code) {
                        this.setData({
                            show: "none"
                        })
                    }
                    this.onGotUserInfo();
                    return;
                }
            }
        })
        // //加载顶部教师详情
        wx.request({
            url: `${getApp().data.requestUrl}/teacher/0`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        teacherData: res.data.res,
                    })
                }
            }
        })
        //加载视频分类部分，包含icon
        this.getCategory();
        
        //加载文章列表
        wx.request({
            url: `${getApp().data.requestUrl}/article/{"bid":0,"cateId":0}`,
            success: res => {
                if (res.data.code == 200) {
                    let dataList = res.data.res
                    let newdataList = [];
                    // 数组反转
                    for (var i = dataList.length-1; i >= 0; i--) {
                        newdataList.push(dataList[i])
                    }
                    if (newdataList.length > 20) {
                        // 提取前20位数组元素
                        newdataList = newdataList.slice(0, 20)
                    }
                    this.setData({
                        articleData: newdataList,
                    })
                } else {
                    this.setData({
                        articleData: "",
                    })
                }
            }
        })
        //加载直播精选图
        wx.request({
            url: `${getApp().data.requestUrl}/live/0`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        liveData: res.data.res,
                    })
                }
            }
        })

    },
    getCategory: function() { // 视频类别和视频列表请求--函数封装
        wx.request({
            url: `${getApp().data.requestUrl}/cate/1`,
            success: res => {
                if (res.data.code == 200) {
                    var data = res.data.res;
                    var listDataShow = [];
                    for (var i in data) {
                        if (data[i].id <= 20) {
                            listDataShow.push(data[i])
                        }
                    }
                    this.setData({
                        videSort: listDataShow
                    })
                }
            }
        })
    },
    getVideoList: function(selData) { //加载视频列表
        let getid = selData.id; //类型ID
        let selName = selData.cate_name; //类型名称
        wx.request({
            url: `${getApp().data.requestUrl}/video/${getid}`,
            success: res => {
                if (res.data.code == 200) {
                    // 获取该getID类型的视频列表
                    let voideListData = res.data.res;
                    if (voideListData.length > 4) {
                        voideListData = voideListData.slice(0, 4);
                    }
                    let thisVideoListData = {
                        "id": getid,
                        "selName": selName,
                        videoList: voideListData
                    }
                    videoListData.push(thisVideoListData);
                    // 在循环外部set值时，循环未执行完成就会完成set；但放在循环内部set会多次set
                    this.setData({
                        videoList: videoListData
                    })
                }
            }
        })
    },
    onGotUserInfo: function() {
        var that = this;
        var nickName, avatarUrl, gender;
        wx.getUserInfo({
            success: function(res) {
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
                        success: res => {
                            // 将用户ID存入本地
                            if (res.data.code == 200 || res.data.code == 201) {
                                // 存储用户会员等级
                                this.setData({
                                    memberId: res.data.res.member_id
                                })
                                // 用户信息存入全局
                                getApp().saveUserInfo(res);
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
    goHome: function() { // 首页
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.redirectTo({
            url: "/pages/index/index"
        })
    },
    goClassroom: function() { // 学习课堂
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.redirectTo({
            url: "/pages/classroom/classroom"
        })
    },
    myCourse: function() { // 我的课程
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.redirectTo({
            url: "/pages/myCourse/myCourse"
        })
    },
    goUser: function() { // 我的会员
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.redirectTo({
            url: "/pages/user/user"
            // url: "/pages/user/newUser/newUser"
        })
    },
    goTeacherInfo: function(e) { // 进入教师信息描述页
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/index/teacherInfo/teacherInfo?id=${id}`
        })
    },
    goArticleList: function() { // 进入文章列表页(所有文章)
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.navigateTo({
            url: "/pages/index/allArticle/allArticle"
        })
    },
    goArticle: function(e) { // 进入文章页,查看文章
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: `/pages/index/article/article?id=${id}`
        })
    },
    goVideoList: function(e) { // 进入视频列表页
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id;
        let cate_name = e.currentTarget.dataset.name;
        id = parseInt(id);
        if (id == 13) {
            // 视频
            wx.navigateTo({
                url: "/pages/classroom/classroom"
            })
            return
        }
        // >16 文章   <= 16视频
        if (id > 16) {
            // 文章
            wx.navigateTo({
                url: "/pages/index/allArticle/allArticle"
            })
        } else {
            // 视频
            wx.navigateTo({
                url: `/pages/index/videoList/videoList?id=${id}&cate_name=${cate_name}`
            })
        }
    },
    goVideo: function (e) { // 进入视频播放页
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
                content: '会员等级不够，请升级会员',
                showCancel: false
            })
            return
        }
        // 获取视频ID
        let id = e.currentTarget.dataset.id;
        let typeId = e.currentTarget.dataset.type;
        wx.navigateTo({
            url: `/pages/index/video/video?id=${id}&typeId=${typeId}`
        })
    },
    goLive: function(e) { // 进入直播页面
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        let staticData = e.currentTarget.dataset.static;
        if (staticData == "0") {
            wx.showModal({
                title: '',
                content: '直播尚未开启',
                showCancel: false
            })
            return;
        }
        let id = e.currentTarget.dataset.id;
        if (this.data.memberId < 3) {
            wx.showModal({
                title: '',
                content: '直播只有会员可观看',
                showCancel: false
            })
            return
        }
        wx.navigateTo({
            url: `/pages/index/live/live?id=${id}`
        })
    },
    goLiveList: function() { // 进入直播列表
        if (!getApp().globalData.code) {
            wx.showModal({
                title: '',
                content: '请授权',
                showCancel: false
            })
            return;
        }
        wx.navigateTo({
            url: "/pages/index/sortVideo/sortVideo"
        })
    },
    goReturn: function() { // 点击返回上一页
        wx.navigateBack({
            changed: true
        })
    }
})