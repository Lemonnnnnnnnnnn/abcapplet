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
        scale: 15,
        markers: [],
        list: []
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
            let list = data.list;
            let marker_list = [];

            list.forEach((el, index) => {
                let marker = {
                    id: el.id,
                    latitude: el.latitude,
                    longitude: el.longitude,
                    callout: {
                        //content: el.title + "|" + list[i].houseTypeList.length + "种户型",
                        display: 'ALWAYS',
                        bgColor: "#3a3a3a",
                        color: "#fff",
                        borderRadius: 50,
                        fontSize: 13,
                        padding: 5
                    },
                };
                marker_list.push(marker);
            });

            self.setData({
                markers: marker_list,
                list: list
            })
        });
    },

    //地图视野发生变化
    changeLocation: function (e) {
        let self = this;
        let location = self.data.location;

        if(e.type == "begin") {
            return
        }else if (e.type == "end") {
            let latitude = location.latitude;

            let mapCtx = wx.createMapContext('map');
            mapCtx.getCenterLocation({
                success: res => {
                    if (latitude == res.latitude) {
                        return
                    }else {
                        self.setData({
                            ['location.longitude']: res.longitude,
                            ['location.latitude']: res.latitude
                        })
                        self.findInMap();
                    }
                }
            })
        }
    },
    //详情
    openResult: function (e) {
        var self = this;
        var id = e.markerId
        var list = self.data.list
        for (var i = 0; i < list.length; i++) {
            if (id == list[i].id) {
                self.setData({
                    latitude: list[i].location[1],
                    longitude: list[i].location[0],
                });
            }
        }
        var mapCtx = wx.createMapContext('map');
        mapCtx.getScale({
            success: function (res) {
                if (res.scale >= 17) {
                    wx.navigateTo({
                        url: '../detail/detail?id=' + id,
                    });
                } else {
                    self.setData({
                        scale: 17,
                    });
                }
            }
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