// pages/user/index/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getUserUrl: 'user/getpost',
    listStaticsUrl: 'user/liststaticspost',
    listCollectUrl: 'user/listcollectpost',
    listDictUrl: 'dict/listpost',
    addDemandUrl: 'user/adddemandpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        user_info: {
            username: '',
            mobile: '',
            headimgurl: '',
            view_num: 0,
            appoint_num: 0
        },
        price: {
            list: [],
            title: [],
            index: 0,
            price_id: 0
        },
        cbd: {
            list: [],
            title: [],
            index: 0,
            cbd_id: 0
        },
        living_time: {
            list: [{ id: 1, title: '马上' }, { id: 7, title: '7天' }, { id: 15, title: '15天' }, { id: 32, title: '一个月后' }],
            id: 1
        },
        living_num: {
            list: [{ id: 1, title: '1人' }, { id: 2, title: '2人' }, { id: 3, title: '3人' }, { id: 4, title: '3人以上' }],
            id: 1
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if(!wx.getStorageSync('user_info')) {
            //未登录
            api.doLogin().then(res => {
                //获取用户信息
                self.initData();
            });;
        } else {
            //获取用户信息
            self.initData();
        }
    },

    //初始化
    initData: function() {
        let self = this;

        //获取用户信息
        self.getUser();
        //个人中心数据统计
        self.listStatics();
        //公寓严选字典数据列表
        self.listDict();
    },

    //获取用户信息
    getUser: function () {
        let self = this;
        let postData = {
            
        };

        api.doHttp(apiUrl.getUserUrl, postData).then(res => {
            let data = res.data;
            let user = data.user;
            
            self.setData({
                ['user_info.username']: user.username,
                ['user_info.mobile']: user.mobile,
                ['user_info.headimgurl']: user.headimgurl
            });
        });
    },

    //个人中心数据统计
    listStatics: function() {
        let self = this;
        let postData = {

        };

        api.doHttp(apiUrl.listStaticsUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                ['user_info.view_num']: data.view_num,
                ['user_info.appoint_num']: data.appoint_num
            });
        });
    },

    //打开登记需求卡
    openDemandCard: function () {
        this.setData({
            show_demand_box: true
        });
    },

    //关闭登记需求卡
    closeDemandCard: function () {
        this.setData({
            show_demand_box: false
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
            let cbd_list = [{
                id: 0,
                title: '全部'
            }];
            let cbd_title = ['全部'];
            let price_list = [{
                id: 0,
                title: '全部'
            }];
            let price_title = ['全部'];

            //cbd格式处理
            if (data.cbd_list.length) {
                data.cbd_list.forEach((el, index) => {
                    el.cbd.forEach((el, index) => {
                        cbd_list.push({
                            id: el.id,
                            title: el.title
                        });
                        cbd_title.push(el.title);
                    });
                });
            }
            //价格格式处理
            if (data.price_list.length) {
                data.price_list.forEach((el, index) => {
                    price_title.push(el.title);
                    price_list.push(el);
                });
            }

            self.setData({
                ['cbd.list']: cbd_list,
                ['cbd.title']: cbd_title,
                ['price.list']: price_list,
                ['price.title']: price_title
            });
        });
    },

    //改变租房预算
    priceChange: function (e) {
        let self = this;
        let price = self.data.price;
        let value = e.detail.value;
        let price_id = price.price_id;

        //筛选id
        price.list.forEach((el, index) => {
            if (el.title == price.title[value]) {
                price_id = el.id;
            }
        });

        self.setData({
            ['price.price_id']: price_id,
            ['price.index']: value
        });

    },

    //改变目标区域
    cbdChange: function (e) {
        let self = this;
        let cbd = self.data.cbd;
        let value = e.detail.value;
        let cbd_id = cbd.cbd_id;

        //筛选id
        cbd.list.forEach((el, index) => {
            if (el.title == cbd.title[value]) {
                cbd_id = el.id;
            }
        });

        self.setData({
            ['cbd.cbd_id']: cbd_id,
            ['cbd_index']: value
        });
    },

    //填写个人需求卡
    addDemand: function () {
        let self = this;

        let postData = {
        
        };

        if (self.data.cbd.cbd_id) {
            postData.cbd = self.data.cbd.cbd_id
        }
        if (self.data.price.price_id) {
            postData.budget = self.data.price.price_id;
        }
        if (self.data.living_time.id) {
            postData.living_time = self.data.living_time.id;
        }
        if (self.data.living_num.id) {
            postData.people = self.data.living_num.id
        }

        api.doHttp(apiUrl.addDemandUrl, postData).then(res => {
            let data = res.data;
            wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: res => {
                    setTimeout(function () {
                        self.closeDemandCard();
                    }, 1500);
                }
            })
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        
        self.initData();
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})