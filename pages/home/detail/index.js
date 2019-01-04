// pages/home/detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_dialog: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    //打开户型弹框
    openDialog: function() {
        this.setData({
            show_dialog: true
        });
    },

    //关闭户型弹框
    closeDialog: function() {
        this.setData({
            show_dialog: false
        });
    },

    //自定义返回
    back: function() {
        wx.navigateBack();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})