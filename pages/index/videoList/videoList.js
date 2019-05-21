// pages/index/videoList/videoList.js
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
        let listName = options.cate_name;
        this.setData({
            listName: listName,
            _Category: options.id
        })
        wx.request({
            url: `${getApp().data.requestUrl}/video/${options.id}`,
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
                        voideListData: "",
                    })
                }
            }
        })
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
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})