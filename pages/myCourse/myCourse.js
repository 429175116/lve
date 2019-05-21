// pages/myCourse/myCourse.js

// 控制底部导航选中状态
const navimg = {
    "Home": "homeNone",
    "Classroom": "sort",
    "myCourse": "shopShow",
    "User": "showNone",
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navImg: navimg,
        _Category: "1",
        imaUrl: getApp().data.imgUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 加载文章分类
        wx.request({
            url: `${getApp().data.requestUrl}/cate/1`,
            success: res => {
                if (res.data.code == 200) {
                    this.setData({
                        sort: res.data.res,
                    })
                    let id = res.data.res[0].id;
                    // 给导航第一个加入选中样式
                    this.setData({
                        _Category: id,
                    })
                    this.gatarticleList(id);
                }
            }
        })
    },
    // 加载文章列表
    gatarticleList: function (e) {
        //切换类别时清空原有数据
        this.setData({
            voideListData: "",
        })
        console.log(e);
        let userId = getApp().globalData.userId;
        //加载文章列表
        wx.request({
            url: `${getApp().data.requestUrl}/myclass/{"user_id":${userId},"cate_id":${e}}`,
            success: res => {
                if (res.data.code == 200) {
                    console.log(res.data.res);
                    this.setData({
                        voideListData: res.data.res,
                    })
                }
            }
        })
    },
    clickCategory: function (e) { // 点击分类
        let id = e.currentTarget.dataset.id;
        this.setData({
            _Category: id
        })
        this.gatarticleList(id);
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
    goHome: function () { // 首页
        wx.redirectTo({
            url: "/pages/index/index"
        })
    },
    goClassroom: function () { // 学习课堂
        wx.redirectTo({
            url: "/pages/classroom/classroom"
        })
    },
    myCourse: function () { // 我的课程
        wx.redirectTo({
            url: "/pages/myCourse/myCourse"
        })
    },
    goUser: function () { // 我的会员
        wx.redirectTo({
            url: "/pages/user/user"
        })
    },
    govideo: function (e) { // 进入文章页,查看文章
        // 获取视频ID
        let id = e.currentTarget.dataset.id;
        let typeId = this.data._Category;
        wx.navigateTo({
            url: `/pages/index/video/video?id=${id}&typeId=${typeId}`
        })
    }
})