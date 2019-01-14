// pages/user/collection/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    listCollectUrl: 'user/listcollectpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        collect: {
            current_page: 1,
            page_size: 5,
            refresh: 0,
            list: [],
            total: 0
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;
        if (!wx.getStorageSync('user_info')) {
            //未登录
            api.doLogin().then(res => {
                //获取公寓收藏列表
                self.listCollect();
            });;
        } else {
            //获取公寓收藏列表
            self.listCollect();
        }
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


    //公寓收藏列表
    listCollect: function (type = 1) {
        let self = this;
        let collect = self.data.collect;
        let postData = {
            current_page: collect.current_page,
            page_size: collect.page_size,
            refresh: collect.refresh
        };

        api.doHttp(apiUrl.listCollectUrl, postData).then(res => {
            let data = res.data;
            let list = data.list;
            let total = data.total;
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
                    ['collect.list']: []
                });
            }

            self.setData({
                ['collect.list[' + (collect.current_page - 1) + ']']: format_list,
                ['collect.total']: total
            });
        });
    },

    //更多严选公寓
    moreCollect: function () {
        let self = this;
        let collect = self.data.collect;
        let current_page = collect.current_page;
        let page_size = collect.page_size;
        let total = collect.total;

        if (current_page * page_size < total) {
            self.setData({
                ['collect.current_page']: current_page + 1
            });
            self.listCollect(0);
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;

        self.setData({
            ['collect.current_page']: 1,
        });

        self.listCollect(0);
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let self = this;

        self.moreCollect();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})