// pages/home/bookingRoom/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
import WxValidate from "../../../plugins/wx-validate/WxValidate.js";
const app = getApp();
const apiUrl = {
    bindMobileUrl: 'sms/bindmobilepost',
    setMobileUrl: 'user/setmobilepost',
    getUserUrl: 'user/getpost',
    getSimpleUrl: 'apartment/getsimplepost',
    listDictUrl: 'dict/listpost',
};

Page({
    /**
     * 页面的初始数据
     */
    data: {
        id: 1, //公寓ID
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
        },
        apartment: {
            cover: '',
            price_low: '',
            price_high: '',
            tittle: '',
            one_word: '',
            tags: []
        },
        house_type: {
            list: [],
            title: [],
            index: 0,
            house_type_id: 0
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

        if(options.id) {
            self.setData({
                id: options.id
            });
        }
    },

    //数据初始化
    initData: function() {
        let self = this;

        //获取用户
        self.getUser();
        //获取公寓简单信息
        self.getSimple();
        //获取字典数据
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

    //获取公寓简单信息
    getSimple: function () {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.getSimpleUrl, postData).then(res => {
            let data = res.data;
            let apartment = data.apartment;

            //标签格式化
            apartment.tags = apartment.tags.split(',').slice(0, 2);
            self.setData({
                ['apartment.cover']: apartment.cover,
                ['apartment.price_low']: apartment.price_low,
                ['apartment.price_high']: apartment.price_high,
                ['apartment.title']: apartment.title,
                ['apartment.one_word']: apartment.one_word,
                ['apartment.tags']: apartment.tags
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
            let cbd_list = [];
            let cbd_title = [];
            let cbd_id = 0;
            let price_title = [];
            let price_id = 0;
            let house_type_title = [];
            let house_type_id = 0;

            //cbd格式处理
            if(data.cbd_list.length) {
                data.cbd_list.forEach((el, index) => {
                    el.cbd.forEach((el, index) => {
                        cbd_list.push({ id: el.id, title: el.title });
                        cbd_title.push(el.title);
                    });
                });
                //初始cbd值
                cbd_id = data.cbd_list[0].id;
            }
            //价格格式处理
            if(data.price_list.length) {
                data.price_list.forEach((el, index) => {
                    price_title.push(el.title);
                });
                //初始价格值
                price_id = data.price_list[0].id
            }
            //户型格式处理
            if(data.housetype_list.length) {
                data.housetype_list.forEach((el, index) => {
                    house_type_title.push(el.title);
                });
                //初始户型值
                house_type_id = data.housetype_list[0].id;
            }

            self.setData({
                ['cbd.list']: cbd_list,
                ['cbd.title']: cbd_title,
                ['cbd.cbd_id']: cbd_id,
                ['price.list']: data.price_list,
                ['price.title']: price_title,
                ['price.price_id']: price_id,
                ['house_type.list']: data.housetype_list,
                ['house_type.title']: house_type_title,
                ['house_type.house_type_id']: house_type_id
            });
        });
    },

    //改变房型
    houseTypeChange: function(e) {
        let self = this;
        let house_type = self.data.house_type;
        let index = e.detail.value;
        let house_type_id = house_type.house_type_id;
        
        //筛选id
        house_type.list.forEach((el, index) => {
            if(el.title == house_type.title[index]) {
                house_type_id = el.id;
            }
        });
        
        self.setData({
            ['house_type.house_type_id']: house_type_id,
            ['house_type.index']: index
        });
    },

    //改变租房预算
    priceChange: function(e) {
        let self = this;
        let price = self.data.price;
        let index = e.detail.value;
        let price_id = price.price_id;

        //筛选id
        price.list.forEach((el, index) => {
            if(el.title == price.title[index]) {
                price_id = el.id;
            }
        });

        self.setData({
            ['price.price_id']: price_id,
            ['price.index']: index
        });
    },

    //改变目标区域
    cbdChange: function(e) {
        let self = this;
        let cbd = self.data.cbd;
        let index = cbd.index;
        let cbd_id = cbd.cbd_id;

        //筛选id
        cbd.list.forEach((el, index) => {
            if(el.title == cbd.title[index]) {
                cbd_id = el.id;
            }
        });

        self.setData({
            ['cbd.cbd_id']: cbd_id,
            ['cbd_index']: index
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