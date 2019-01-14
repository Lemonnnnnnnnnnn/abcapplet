// pages/auth/index.js
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

    },

    //跳转首页
    onGotUserInfo: function (e) {
        //允许首页数据可请求
        wx.setStorageSync('interrupt', 0);
        wx.reLaunch({
            url: '/pages/home/index/index'
        })
    }
})