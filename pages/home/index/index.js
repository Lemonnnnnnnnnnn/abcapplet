// pages/home/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        top: 0,
        city: ['厦门', '福州', '泉州', '苏州'],
        city_index: 0,
        scroll_index: 0,
        show: {
            //模块显示
            business: false,
            type: false,
            price: false
        },
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
        let scroll_index = 0;
        let scroll_left = e.detail.scrollLeft;
        console.log(scroll_left);

        //第一块块滑过一半
        if(scroll_left >= 167) {
            scroll_index = Math.floor((scroll_left-167) / 333) + 1
        }

        this.setData({
            scroll_index: scroll_index
        });
    },

    //商圈筛选显示
    businessClick: function() {
        let self = this;
        self.setData({
            ['show.business']: !self.data.show.business,
            ['show.price']: false,
            ['show.type']: false
        });
    },

    //价格筛选显示
    priceClick: function () {
        let self = this;
        self.setData({
            ['show.business']: false,
            ['show.price']: !self.data.show.price,
            ['show.type']: false
        });
    },

    //户型筛选显示
    typeClick: function () {
        let self = this;
        self.setData({
            ['show.business']: false,
            ['show.price']: false,
            ['show.type']: !self.data.show.type
        });
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