// pages/home/search/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    listHotSearchUrl: 'apartment/listhotsearchpost',
    searchUrl: 'apartment/searchpost',
    listDictUrl: 'dict/listpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        history_list: [],
        hot_list: [],
        dict: {
            cbd_dict: [], //商圈字典
            parent_cbd_dict: [], //cbd父字典
            sub_cbd_dict: [], //cbd子字典
            sub_origin_dict: [], //cbd子类原始字典
            price_dict: [], //价格字典
            housetype_dict: [] //户型字典
        },
        search: {
            search_key: '',
            cbd_area_id: 0,
            cbd_id: 0,
            price_id: 0,
            house_type_id: 0,
            current_page: 1,
            page_size: 5,
            total: 0,
            list: [],
        },
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
        let self = this;
        
        //公寓严选字典数据列表
        self.listDict();
        if (!wx.getStorageSync('user_info')) {
            //未登录
            api.doLogin().then(res => {
                //获取热门搜索词
                self.listHotSearch(); 
            });;
        }else {
           //获取热门搜索词
           self.listHotSearch(); 
        }
    },

    //热门搜索和历史搜索列表
    listHotSearch: function() {
        let self = this;
        let postData = {};

        api.doHttp(apiUrl.listHotSearchUrl, postData).then(res => {
            let data = res.data;
           
            self.setData({
                history_list: data.history_list,
                hot_list: data.hot_list
            });
        });
    },

    //公寓严选字典数据列表
    listDict: function () {
        let self = this;
        let postData = {
            city: wx.getStorageSync('city_id')
        };

        api.doHttp(apiUrl.listDictUrl, postData).then(res => {
            let data = res.data;
            let parent_cbd_list = [{ id: 0, title: '全部' }];
            let sub_cbd_list = [];

            //cbd格式处理
            data.cbd_list.forEach((el, index) => {
                parent_cbd_list.push({ id: el.id, title: el.title });
                el.cbd.forEach((el, index) => {
                    sub_cbd_list.push({ id: el.id, title: el.title });
                });
            });

            self.setData({
                ['dict.cbd_dict']: data.cbd_list,
                ['dict.price_dict']: data.price_list,
                ['dict.housetype_dict']: data.housetype_list,
                ['dict.parent_cbd_dict']: parent_cbd_list,
                ['dict.sub_cbd_dict']: sub_cbd_list,
                ['dict.sub_origin_dict']: sub_cbd_list
            });
        });
    },

    //商圈筛选显示
    businessClick: function () {
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

    //改变商圈区域
    cbdAreaChange: function (e) {
        let self = this;
        let dataset = e.target.dataset;
        let dict = self.data.dict;
        let cbd_dict = dict.cbd_dict;
        let sub_cbd_dict = [];

        if (dataset.id) {
            //筛选该区域下的cbd
            cbd_dict.forEach((el, index) => {
                if (el.id == dataset.id) {
                    sub_cbd_dict = el.cbd;
                }
            });
        } else {
            sub_cbd_dict = dict.sub_origin_dict;
        }

        self.setData({
            ['search.cbd_area_id']: dataset.id,
            ['dict.sub_cbd_dict']: sub_cbd_dict
        });
    },

    //改变商圈地址
    cbdChange: function (e) {
        let self = this;
        let dataset = e.target.dataset;

        self.setData({
            ['search.cbd_id']: dataset.id,
            ['show.business']: !self.data.show.business,
            ['search.current_page']: 1
        });
        //刷新
        self.search();
    },

    //改变价格
    priceChange: function (e) {
        let self = this;
        let dataset = e.target.dataset;

        self.setData({
            ['show.price']: !self.data.show.price,
            ['search.price_id']: dataset.id,
            ['search.current_page']: 1
        });
        //刷新
        self.search();
    },

    //改变房型
    houseTypeChange: function (e) {
        let self = this;
        let dataset = e.target.dataset;

        self.setData({
            ['show.type']: !self.data.show.type,
            ['search.house_type_id']: dataset.id,
            ['search.current_page']: 1
        });
        //刷新
        self.search();
    },

    //点击公寓户型缩略图跳转至详情对话框
    openTypeDailog: function (e) {
        let self = this;
        let dataset = e.currentTarget.dataset;

        //跳转详情页，并打开对话框
        wx.navigateTo({
            url: '/pages/home/detail/index?id=' + dataset.id + '&type_id=' + dataset.typeId
        });
    },

    //选择搜索词
    keyChange: function(e) {
        let self = this;
        let dataset = e.target.dataset;

        self.setData({
            ['search.search_key']: dataset.key,
            ['search.current_page']: 1
        });
        //刷新
        self.search();
    },

    //搜索词绑定
    searchKeyEvent: function (e) {
        let self = this;

        self.setData({
            ['search.search_key']: e.detail.value
        });
    },

    //搜索确认
    searchClick: function () {
        let self = this;
        let search_key = self.data.search.search_key;

        if (search_key == '') {
            wx.showToast({
                title: '请输入搜索词',
                icon: 'none',
                duration: 2000
            });

            return false;
        }

        //发起搜索
        self.search();  
    },

    //搜索公寓
    search: function(type = 1) {
        let self = this;
        let search = self.data.search;

        let postData = {
            search_key: search.search_key,
            city: wx.getStorageSync('city_id'),
            cbd: search.cbd_id,
            price: search.price_id,
            house_type: search.house_type_id,
            current_page: search.current_page,
            page_size: search.page_size
        };
        
        api.doHttp(apiUrl.searchUrl, postData).then(res => {
            let data = res.data;
            let list = data.list;
            let total = data.total;
            let search = self.data.search;
            let format_list = [];

            list.forEach((el, index) => {
                //字符串转成数组，并截取前2个
                if (el.tags) {
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
                    ['search.list']: []
                });
            }

            self.setData({
                ['search.list[' + (search.current_page - 1) + ']']: format_list,
                ['search.total']: total
            });
        });
    },

    //更多严选公寓
    moreSearch: function () {
        let self = this;
        let search = self.data.search;
        let current_page = search.current_page;
        let page_size = search.page_size;
        let total = search.total;

        if (current_page * page_size < total) {
            self.setData({
                ['search.current_page']: current_page + 1
            });
            self.search(0);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;

        self.setData({
            ['search.current_page']: 1,
            ['search.cbd_id']: 0,
            ['search.price_id']: 0,
            ['search.house_type_id']: 0
        });

        self.search(0);
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let self = this;

        self.moreSearch();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})