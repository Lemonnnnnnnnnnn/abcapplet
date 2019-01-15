// pages/apartment/index/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    listDictUrl: 'dict/listpost',
    addDemandUrl: 'user/adddemandpost',
    getDemandUrl: 'user/getdemandpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show_demand_box: false,
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
        is_edit: 0, //是否是编辑需求
        step: 1,  //当前步骤
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if (!wx.getStorageSync('user_info')) {
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
    initData: function () {
        let self = this;

        //公寓严选字典数据列表
        self.listDict();
        //获取个人需求卡
        self.getDemand();
    },

    //打开登记需求卡
    openDemandCard: function() {
        this.setData({
            show_demand_box: true
        });
    },

    //关闭登记需求卡
    closeDemandCard: function() {
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

    //选择入住时间
    livingTimeSelected: function (e) {
        let self = this;
        let dataset = e.currentTarget.dataset;

        self.setData({
            ['living_time.id']: dataset.id
        });
    },

    //选择入住人数
    livingNumSelected: function (e) {
        let self = this;
        let dataset = e.currentTarget.dataset;

        self.setData({
            ['living_num.id']: dataset.id
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
                        //关闭弹框
                        self.closeDemandCard();
                        //刷新需求数据
                        self.getDemand();
                    }, 1500);
                }
            })
        });
    },

    //获取个人需求卡
    getDemand: function () {
        let self = this;
        let postData = {};

        api.doHttp(apiUrl.getDemandUrl, postData).then(res => {
            let data = res.data;
            let demand = data.demand;

            if(demand) {
                let cbd = self.data.cbd;
                let price = self.data.price;
                let cbd_index = 0;
                let price_index = 0;

                //数据格式化
                cbd.list.forEach((el, index) => {
                    if (el.id == demand.cbd_id) {
                        cbd_index = index;
                    }
                });
                price.list.forEach((el, index) => {
                    if (el.id == demand.price_id) {
                        price_index = index;
                    }
                });

                self.setData({
                    ['cbd.cbd_id']: demand.cbd_id,
                    ['cbd.index']: cbd_index,
                    ['price.price_id']: demand.price_id,
                    ['price.index']: price_index,
                    ['living_time.id']: demand.time,
                    ['living_num.id']: demand.people,
                    step: demand.step,
                    is_edit: 1, //编辑需求
                });
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