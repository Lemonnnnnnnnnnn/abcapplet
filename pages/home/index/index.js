// pages/home/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        top: 0,
        city: ['厦门', '福州', '泉州', '苏州'],
        city_index: 0,
        scroll_index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    //城市切换
    cityChange: function(e) {
        this.setData({
            city_index: e.detail.value
        })
    },

    //轮播切换
    scrollChange: function(e) {
        console.log(e.detail);
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

    },

    scrollTopFun(e) {
        let self = this;

        self.setData({
            top: e.detail.scrollTop
        });
    }
})