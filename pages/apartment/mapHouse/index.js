// pages/apartment/mapHouse/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
const app = getApp();
const apiUrl = {
    findInMapUrl: 'apartment/findinmappost'
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        location: {
            latitude: '',
            longitude: ''
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        //数据初始化
        self.initData();
    },

    //数据初始化
    initData: function () {
        let self = this;

        //获取用户所在地址
        self.getLocation();
    },

    //获取用户所在地址
    getLocation: function () {
        let self = this;

        wx.getLocation({
            type: 'wgs84',
            success: res => {
                self.setData({
                    ['location.longitude']: res.longitude,
                    ['location.latitude']: res.latitude
                });
                //通勤找房
                self.findInMap();
            }
        })
    },

    //通勤找房
    findInMap: function (type = 1) {
        let self = this;
        //let apartment = self.data.apartment;

        let postData = {
            latitude: self.data.location.latitude,
            longitude: self.data.location.longitude
        };

        api.doHttp(apiUrl.findInMapUrl, postData).then(res => {
            let data = res.data;
            
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