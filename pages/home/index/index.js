// pages/home/index/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    listSiteUrl: 'dict/listsitepost',
    listBannerUrl: 'article/listbannerpost',
};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        top: 0,
        city: {
            list: [],
            title: ['厦门', '福州', '泉州', '苏州'],
            index: 0
        },
        is_location: 0,  //是否显示城市选择
        scroll_index: 0,
        show: {
            //模块显示
            business: false,
            type: false,
            price: false
        },
        banner_list: [],  //轮播列表
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        self.listSite();
        if (!wx.getStorageSync("city_id")) {
            self.setData({
                is_location: 1
            })
        } else {
            self.initData();
        }
    },

    //首页数据初始化
    initData: function() {
        let self = this;

        self.listBanner();
    },

    //获取开通城市站点
    listSite: function () {
        let self = this;
        let postData = {};

        api.doHttp(apiUrl.listSiteUrl, postData).then(res => {
            let data = res.data;
            let title = []; //开通站点名字

            if (data.list.length) {
                data.list.forEach((el, index) => {
                    title.push(el.title);
                });

                //装载城市数组
                self.setData({
                    ['city.list']: data.list,
                    ['city.title']: title,
                    ['city.index']: 0
                });
            }
        });
    },

    //初始选择站点
    citySelect: function (e) {
        let self = this;
        let dataset = e.target.dataset;
        let title = self.data.city.title;
        let city_index = 0;

        //选中城市id
        wx.setStorageSync('city_id', dataset.id);
        //筛选选中的城市名字
        title.forEach((el, index) => {
            if (el == dataset.title) {
                city_index = index;
            }
        });

        self.setData({
            is_location: 0,
            ['city.index']: city_index
        });
        //初始化
        self.initData();
    },

    //城市切换
    cityChange: function(e) {
        let self = this;
        let list = self.data.city.list;
        let title = self.data.city.title;

        //筛选选中城市的id
        list.forEach((el, index) => {
            if(el.title == title[e.detail.value]) {
                wx.setStorageSync('city_id', el.id);
            }
        });

        self.setData({
            city_index: e.detail.value
        });
        //初始化
        self.initData();
    },

    //首页顶部广告
    listBanner: function() {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id'),
            type: 'basic'
        };

        api.doHttp(apiUrl.listBannerUrl, postData).then(res => {
            let data = res.data;
             
            self.setData({
                banner_list: data.list
            });
            console.log(self.data.banner_list);
        });
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

    //滚动
    scrollTopFun(e) {
        let self = this;

        self.setData({
            top: e.detail.scrollTop
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