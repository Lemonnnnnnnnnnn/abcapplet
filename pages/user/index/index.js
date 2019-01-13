// pages/user/index/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getUserUrl: 'user/getpost',
    listStaticsUrl: 'user/liststaticspost',
    listCollectUrl: 'user/listcollectpost',
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
        }
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