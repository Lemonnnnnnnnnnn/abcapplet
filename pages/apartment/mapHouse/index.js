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
                        content: el.title,
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

    //点击标签打开公寓详情
    openApartmentDetail: function (e) {
        let self = this;
        let list = self.data.list;
        let location = self.data.location;
        let latitude = location.latitude;
        let longitude = location.longitude;
        let marker_id = e.markerId;

        list.forEach((el, index) => {
            if(marker_id == el.id) {
                latitude = el.latitude;
                longitude = el.longitude;
            }
        });

        self.setData({
            ['location.latitude']: latitude,
            ['location.longitude']: longitude
        });
        
        let mapCtx = wx.createMapContext('map');
        mapCtx.getScale({
            success: res => {
                if(res.scale >= 17) {
                    wx.navigateTo({
                        url: '/pages/home/detail/index?id=' + marker_id
                    });
                }else {
                    self.setData({
                        scale: 17,
                    });
                }
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})