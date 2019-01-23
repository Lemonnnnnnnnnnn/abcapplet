// pages/apartment/commuteHouse/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const QQMapWX = require('../../../utils/qqmap-wx-jssdk.js');
const app = getApp();
const apiUrl = {
    commuteUrl: 'apartment/commutepost',
};

// 实例化API核心类
let qqmapsdk = new QQMapWX({
    key: 'NDSBZ-P3MKK-V5RJH-AJ5YD-WVAEF-GEFJM'
});  

Page({

    /**
     * 页面的初始数据
     */
    data: {
        location: {
            latitude: '',
            longitude: '',
            address: '',
        },
        time: {
            title: ['10分钟', '20分钟', '30分钟', '60分钟', '90分钟'],
            list: [{
                id: 10,
                title: '10分钟'
            }, {
                id: 20,
                title: '20分钟'
            }, {
                id: 30,
                title: '30分钟'
            }, {
                id: 60,
                title: '60分钟',
            }, {
                id: 90,
                title: '90分钟'
            }],
            index: 0,
            id: 10
        },
        vehicle: 'bus',   //交通工具
        apartment: {
            current_page: 1,
            page_size: 5,
            refresh: 0,
            total: 0,
            list: [],
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
    initData: function() {
        let self = this;

        //获取用户所在地址
        self.getLocation();
    },

    //获取用户所在地址
    getLocation: function() {
        let self = this;

        wx.getLocation({
            type: 'gcj02',
            success: res => {
                self.setData({
                    ['location.longitude']: res.longitude,
                    ['location.latitude']: res.latitude
                });
                //通勤找房
                self.commute();
                //根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude
                    },
                    get_poi: 1, 
                    success: res => {
                        let address = res.result.formatted_addresses.recommend;
            
                        //当前位置信息
                        self.setData({
                            ['location.address']: address
                        });
                        console.log(self.data.location.address);
                    }
                });
            }
        })
    },

    //改变行程时间
    timeChange: function(e) {
        let self = this;
        let time = self.data.time;
        let title = time.title;
        let list = time.list;
        let id = 10;

        //获取行程id
        list.forEach((el, index) => {
            if(el.title == title[e.detail.value]) {
                id = el.id;
            }
        });

        self.setData({
            ['time.id']: id,
            ['time.index']: e.detail.value,
            ['apartment.current_page']: 1  //重置第一页
        });
        //刷新通勤找房
        self.commute();
    },

    //交通工具选择
    vehicleChange: function(e) {
        let self = this;
        let dataset = e.currentTarget.dataset;
        
        self.setData({
            vehicle: dataset.vehicle,
            ['apartment.current_page']: 1  //重置第一页
        });
        //刷新通勤找房
        self.commute();
    },

    //通勤找房
    commute: function (type = 1) {
        let self = this;
        let apartment = self.data.apartment;

        let postData = {
            latitude: self.data.location.latitude,
            longitude: self.data.location.longitude,
            time: self.data.time.id,
            vehicle: self.data.vehicle,
            current_page: apartment.current_page,
            page_size: apartment.page_size,
            refresh: apartment.refresh
        };

        api.doHttp(apiUrl.commuteUrl, postData).then(res => {
            let data = res.data;
            let list = data.list;
            let total = data.total;
            let apartment = self.data.apartment;
            let format_list = [];

            list.forEach((el, index) => {
                //字符串转成数组，并截取前2个
                if(el.tags) {
                    el.tags = el.tags.split(',').slice(0, 2);
                }
                if (el.rules) {
                    el.rules = el.rules.slice(0, 3);
                }
                format_list.push(el);
            });

            if (type == 1) {
                //刷新清空公寓列表数组
                self.setData({
                    ['apartment.list']: [],
                });
            }

            self.setData({
                ['apartment.list[' + (apartment.current_page - 1) + ']']: format_list,
                ['apartment.total']: total
            });
        });
    },

    //更多通勤找房
    moreCommutet: function () {
        let self = this;
        let apartment = self.data.apartment;
        let current_page = apartment.current_page;
        let page_size = apartment.page_size;
        let total = apartment.total;

        if (current_page * page_size < total) {
            self.setData({
                ['apartment.current_page']: current_page + 1
            });
            self.commute(0);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        self.setData({
            ['apartment.current_page']: 1,
            ['apartment.refresh']: 1
        });

        self.commute();
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let self = this;
        self.moreCommutet();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})