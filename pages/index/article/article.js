// pages/index/article/article.js
// 导入转html包
var WxParse = require('../../../wxParse/wxParse.js');
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
        //加载文章
        wx.request({
            url: `${getApp().data.requestUrl}/article/${options.id}`,
            success: res=> {
                if (res.data.code == 200) {
                    let article = res.data.res;
                    this.setData({
                        articleData: res.data.res,
                        id: options.id
                    })
                    // html转换显示
                    WxParse.wxParse('article', 'html', article.content, this, 5);
                }
            }
        })
        // 加载评论
        this.getCommentInfo(options.id);
    },
    getCommentInfo: function (e) { //加载评论
        //加载评论
        wx.request({
            url: `${getApp().data.requestUrl}/message/${e}`,
            success: res => {
                if (res.data.code == 200) {
                    let article = res.data.res;
                    this.setData({
                        commentInfo: res.data.res,
                    })
                } else {
                    this.setData({
                        commentInfo: "",
                    })
                }
            }
        })
    },
    setCommentInfo: function (e) { //提交评论信息
        // 获取信息
        let commentContent = e.detail.value.commentContent;
        console.log(commentContent);
        if (commentContent == "") {
            wx.showModal({
                content: '请输入信息',
                showCancel: false
            })
            return
        }
        // //提交评论信息
        wx.request({
            url: `${getApp().data.requestUrl}/message/`,
            method: "POST",
            data: {
                content : commentContent,
                user_id: getApp().globalData.userId,
                article_id: this.data.id
            },
            success: res => {
                // 将用户ID存入本地
                if (res.data.code == 201) {
                    this.setData({
                        commentContent: "",
                    })
                    // 加载评论
                    this.getCommentInfo(this.data.id);
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
    goReturn: function () { // 返回上一页
        wx.navigateBack({ changed: true })
    }
})