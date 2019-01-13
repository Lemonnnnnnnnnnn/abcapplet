// pages/home/bookingRoom/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
import WxValidate from "../../../plugins/wx-validate/WxValidate.js";
const app = getApp();
const apiUrl = {
    bindMobileUrl: 'sms/bindmobilepost',
    setMobileUrl: 'user/setmobilepost',
    getUserUrl: 'user/getpost',
};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        show_mobile_box: 0, 
        bind_mobile: {
            mobile: '',
            code: '',
            code_flag: false, //验证码
            count_down: 60, //验证码倒计时
        },
        user_info: {
            username: '',
            mobile: '',
            headimgurl: ''
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
                //获取用户信息
                self.initData();
            });;
        } else {
            //获取用户信息
            self.initData();
        }
    },

    //数据初始化
    initData: function() {
        let self = this;

        //获取用户
        self.getUser();
    },

    //获取用户信息
    getUser: function () {
        let self = this;
        let postData = {

        };

        api.doHttp(apiUrl.getUserUrl, postData).then(res => {
            let data = res.data;
            let user = data.user;
            let show_mobile_box = 0;
            
            //电话号码为空，默认显示绑定手机弹框
            if(!user.mobile) {
                show_mobile_box = 1
            }

            self.setData({
                ['user_info.username']: user.username,
                ['user_info.mobile']: user.mobile,
                ['user_info.headimgurl']: user.headimgurl,
                show_mobile_box: show_mobile_box
            });
        });
    },

    //打开手机绑定弹框
    openMobileBox: function() {
        let self = this;

        self.setData({
            show_mobile_box: 1
        });
    },

    //关闭手机绑定弹框
    closeMobilBox: function() {
        let self = this;

        self.setData({
            show_mobile_box: 0,
            ['bind_mobile.mobile']: '',
            ['bind_mobile.code']: ''
        });
    },

    //绑定手机号
    bindMobile: function (e) {
        let self = this;

        self.setData({
            ['bind_mobile.mobile']: e.detail.value
        })
    },

    //绑定验证码
    bindCode: function (e) {
        let self = this;

        self.setData({
            ['bind_mobile.code']: e.detail.value
        })
    },

    //获取验证码
    getCode: function () {
        let self = this;
        let bind_mobile = self.data.bind_mobile;

        // 参数规则
        const rules = {
            mobile: {
                required: true,
                tel: true,
                number: true
            }
        };
        const messages = {
            mobile: {
                required: '请输入您的联系电话',
                tel: '请输入正确的手机号',
                number: '验证码必须为数字',
            }
        };
        let validate = new WxValidate(rules, messages);
        const checkData = {
            detail: {
                value: {}
            }
        };
        checkData.detail.value = {
            mobile: bind_mobile.mobile,
        };

        // 参数校验
        if (!validate.checkForm(checkData)) {
            const error = validate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none',
                duration: 2000
            })
            return;
        }

        // 倒计时
        self.setCodeInterval();

        // 申请验证码
        let postData = {
            mobile: bind_mobile.mobile
        };
        api.doHttp(apiUrl.bindMobileUrl, postData).then(res => {
            wx.showToast({
                title: res.msg,
                icon: "none",
                duration: 2000
            })
        });
    },

    //倒计时
    setCodeInterval: function () {
        let self = this;

        self.setData({
            ['bind_mobile.code_flag']: true
        });
        let interval = setInterval(() => {
            let time = self.data.bind_mobile.count_down;
            self.setData({
                ['bind_mobile.count_down']: time - 1
            });
            if (self.data.bind_mobile.count_down == 0) {
                clearInterval(interval);
                self.setData({
                    ['bind_mobile.code_flag']: false,
                    ['bind_mobile.count_down']: 60
                });
            }
        }, 1000);
    },

    //绑定手机
    setMobile: function() {
        let self = this;
        let bind_mobile = self.data.bind_mobile;

        // 参数规则
        const rules = {
            mobile: {
                required: true,
                tel: true,
                number: true
            },
            code: {
                required: true,
                number: true
            }
        };
        const messages = {
            mobile: {
                required: '请输入您的手机号码',
                tel: '请输入正确的手机号',
                number: '手机号必须为数字',
            },
            code: {
                required: '请输入验证码',
                number: '验证码必须为数字'
            }
        };
        let validate = new WxValidate(rules, messages);
        const checkData = {
            detail: {
                value: {}
            }
        };
        checkData.detail.value = {
            mobile: bind_mobile.mobile,
            code: bind_mobile.code
        };

        // 参数校验
        if (!validate.checkForm(checkData)) {
            const error = validate.errorList[0];
            wx.showToast({
                title: error.msg,
                icon: 'none',
                duration: 2000
            })
            return;
        }

        let postData = {
            mobile: bind_mobile.mobile,
            code: bind_mobile.code
        };

        api.doHttp(apiUrl.setMobileUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                ['user_info.mobile']: data.user.mobile
            }); 
            //关闭手机绑定弹框
            self.closeMobilBox();   
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