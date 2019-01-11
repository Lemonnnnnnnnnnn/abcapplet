// pages/home/index/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    listSiteUrl: 'dict/listsitepost',
    listBannerUrl: 'article/listbannerpost',
    listHotcbdUrl: 'dict/listhotcbdpost',
    listWeekUrl: 'apartment/listweekpost',
    listDictUrl: 'dict/listpost',
    listApartmentUrl: 'apartment/listpost',
};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        show_select: 0,
        city: {
            list: [],
            title: [],
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
        cbd_list: [],  //商圈列表
        activity_banner: [],  //活动广告列表
        week_list: [], //每周上新
        dict: {
            cbd_dict: [], //商圈字典
            parent_cbd_dict: [], //cbd父字典
            sub_cdb_dict: [], //cbd子字典
            price_dict: [], //价格字典
            housetype_dict: [] //户型字典
        },
        apartment: {
            cbd_id: 0,
            price_id: 0,
            house_type_id: 0,
            current_page: 1,
            page_size: 5,
            total: 0,
            list: [],
        }
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
        self.listHotcbd();
        self.listActivityBanner();
        self.listWeek();
        self.listDict();
        self.listApartment();
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
            ['city.index']: e.detail.value
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
        });
    },

    //轮播切换
    scrollChange: function (e) {
        let scroll_index = 0;
        let scroll_left = e.detail.scrollLeft;

        //第一块块滑过一半
        if (scroll_left >= 167) {
            scroll_index = Math.floor((scroll_left - 167) / 333) + 1
        }

        this.setData({
            scroll_index: scroll_index
        });
    },

    //活动集广告列表
    listActivityBanner: function () {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id'),
            type: 'activity'
        };

        api.doHttp(apiUrl.listBannerUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                activity_banner: data.list
            });
        });
    },

    //热门商圈列表
    listHotcbd: function() {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id')
        };

        api.doHttp(apiUrl.listHotcbdUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                cbd_list: data.list  
            });
        });
    },

    //每周上新
    listWeek: function() {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id')
        };

        api.doHttp(apiUrl.listWeekUrl, postData).then(res => {
            let data = res.data;
            let list = [];

            //数据格式化
            data.list.forEach((el, index) => {
                el.info = JSON.parse(el.info);
                list.push(el);
            });
           
            self.setData({
                week_list: data.list
            });
        });
    },

    //公寓严选字典数据列表
    listDict: function() {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id')
        };

        api.doHttp(apiUrl.listDictUrl, postData).then(res => {
            let data = res.data;
            let parent_cbd_list = [{id: 0, title: '全部'}];
            let sub_cbd_list = [];

            //cbd格式处理
            data.cbd_list.forEach((el, index) => {
                parent_cbd_list.push({id: el.id, title: el.title});
                el.cbd.forEach((el, index) => {
                    sub_cbd_list.push({id: el.id, title: el.title});
                });
            });

            self.setData({
                ['dict.cbd_dict']: data.cbd_list,
                ['dict.price_dict']: data.price_list,
                ['dict.housetype_dict']: data.housetype_list,
                ['dict.parent_cbd_list']: parent_cbd_list,
                ['dict.sub_cbd_list']: sub_cbd_list
            });
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

    //严选公寓
    listApartment: function (type = 1) {
        let self = this;
        let apartment = self.data.apartment;
        
        let postData = {
            city: wx.getStorageSync('city_id'),
            cbd: apartment.cbd_id,
            price: apartment.price_id,
            house_type: apartment.house_type_id,
            current_page: apartment.current_page,
            page_size: apartment.page_size
        };

        api.doHttp(apiUrl.listApartmentUrl, postData).then(res => {
            let data = res.data;
            let list = data.list;
            let total = data.total;
            let apartment = self.data.apartment;
            let format_list = [];

            list.forEach((el, index) => {
                //字符串转成数组，并截取前3个
                el.tags = el.tags.split(',').slice(0, 3);
                format_list.push(el);
            });
            
            if(type == 1) {
                //刷新清空公寓列表数组
                self.setData({
                    ['apartment.list']: [],
                });
            }

            self.setData({
                ['apartment.list[' + (apartment.current_page-1) + ']']: format_list,
                ['apartment.total']: total
            });
        });
    },

    //更多严选公寓
    moreListApartment: function () {
        let self = this;
        let apartment = self.data.apartment;
        let current_page = apartment.current_page;
        let page_size = apartment.page_size;
        let total = apartment.total;
        if (current_page * page_size < total) {
            this.setData({
                ['apartment.current_page']: current_page + 1
            });
            self.listApartment(0);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        self.setData({
            current_page: 1
        });
        
        self.initData();
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let self = this;
        self.moreListApartment();
    },

    /**
     * 页面滚动的事件处理函数 
     */
    onPageScroll: function(e) {
        let self = this;
        
        //防止频繁刷新数据
        if(e.scrollTop < 2000 && (e.scrollTop % 2 == 0)) {
            self.setData({
                show_select: e.scrollTop
            });
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})