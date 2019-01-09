// pages/home/detail/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getApartmentUrl: 'apartment/getpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,   //公寓id
        show_dialog: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if(options.id) {
            self.setData({
                id: options.id
            });    
        }
        //获取公寓详情
        self.getApartment();
    },

    //自定义返回
    back: function () {
        wx.navigateBack();
    },

    //获取公寓详情
    getApartment: function() {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.getApartmentUrl, postData).then(res => {
            let data = res.data;
            console.log(data);
        });
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