// pages/home/promotion/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getByRuleUrl: 'apartment/getbyrulepost'
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 1,   //公寓合集id
        rule: {
            cover: '',
            title: '',
            desc: '',
            apartment_num: 0
        },
        collection: {
            current_page: 1,
            page_size: 5,
            refresh: 0,
            total: 0,
            list: []
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if (options.id) {
            self.setData({
                id: options.id
                //id: 1
            });
        }
        //获取公寓合集
        self.getByRule();
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

    //获取公寓合集
    getByRule: function (type = 1) {
        let self = this;
        let collection = self.data.collection;
        let postData = {
            rule_id: self.data.id,
            current_page: collection.current_page,
            page_size: collection.page_size,
            refresh: collection.refresh
        };

        api.doHttp(apiUrl.getByRuleUrl, postData).then(res => {
            let data = res.data;
            let list = data.list;
            let total = data.total;
            let rule = data.rule;
            let collection = self.data.collection;
            let format_list = [];

            list.forEach((el, index) => {
                //字符串转成数组，并截取前3个
                if (el.tags) {
                    el.tags = el.tags.split(',').slice(0, 3);
                }
                if (el.rules) {
                    el.rules = el.rules.slice(0, 3);
                }
                format_list.push(el);
            });

            if (type == 1) {
                //刷新清空公寓列表数组
                self.setData({
                    ['collection.list']: [],
                });
            }

            self.setData({
                ['rule.cover']: rule.cover,
                ['rule.title']: rule.title,
                ['rule.desc']: rule.desc,
                ['rule.apartment_num']: total,
                ['collection.list[' + (collection.current_page - 1) + ']']: format_list,
                ['collection.total']: total
            });
        });
    },

    //更多严选公寓
    moreListApartment: function () {
        let self = this;
        let collection = self.data.collection;
        let current_page = collection.current_page;
        let page_size = collection.page_size;
        let total = collection.total;
        if (current_page * page_size < total) {
            this.setData({
                ['collection.current_page']: current_page + 1
            });
            self.getByRule(0);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;

        self.setData({
            ['collection.current_page']: 1
        });

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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})