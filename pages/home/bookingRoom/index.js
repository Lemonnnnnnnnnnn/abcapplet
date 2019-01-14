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
    addAppointmentUrl: 'apartment/addappointmentpost'
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
        },
        order_time: {
            list: [
                ['2019年', '2020年', '2021年', '2022年', '2023年'],
                ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                [],
                ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00']
            ],
            date_time_str: '请选择',
            date_time: '',
            index: 0
        },
        living_time: {
            list: [{id: 1, title: '马上'}, {id: 7, title: '7天'}, {id: 15, title: '15天'}, {id: 32, title: '一个月后'}],
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
    onLoad: function(options) {
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

        if (options.id) {
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
        //获取可选时间数据
        self.getDateTime();
    },

    //获取用户信息
    getUser: function() {
        let self = this;
        let postData = {

        };

        api.doHttp(apiUrl.getUserUrl, postData).then(res => {
            let data = res.data;
            let user = data.user;
            let show_mobile_box = 0;

            //电话号码为空，默认显示绑定手机弹框
            if (!user.mobile) {
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
    bindMobile: function(e) {
        let self = this;

        self.setData({
            ['bind_mobile.mobile']: e.detail.value
        })
    },

    //绑定验证码
    bindCode: function(e) {
        let self = this;

        self.setData({
            ['bind_mobile.code']: e.detail.value
        })
    },

    //获取验证码
    getCode: function() {
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
    setCodeInterval: function() {
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
    getSimple: function() {
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
    listDict: function() {
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
            let house_type_list = [{
                id: 0,
                title: '全部'
            }];
            let house_type_title = ['全部'];

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
            //户型格式处理
            if (data.housetype_list.length) {
                data.housetype_list.forEach((el, index) => {
                    house_type_title.push(el.title);
                    house_type_list.push(el);
                });
            }

            self.setData({
                ['cbd.list']: cbd_list,
                ['cbd.title']: cbd_title,
                ['price.list']: price_list,
                ['price.title']: price_title,
                ['house_type.list']: house_type_list,
                ['house_type.title']: house_type_title
            });
        });
    },

    //改变房型
    houseTypeChange: function(e) {
        let self = this;
        let house_type = self.data.house_type;
        let value = e.detail.value;
        let house_type_id = house_type.house_type_id;

        //筛选id
        house_type.list.forEach((el, index) => {
            if (el.title == house_type.title[value]) {
                house_type_id = el.id;
            }
        });
       
        self.setData({
            ['house_type.house_type_id']: house_type_id,
            ['house_type.index']: value
        });
    },

    //改变租房预算
    priceChange: function(e) {
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
    cbdChange: function(e) {
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

    //改变看房时间
    orderTimeChange: function (e) {
        let self = this;
        let order_time = self.data.order_time;
        let value = e.detail.value;
        let year = order_time.list[0][value[0]];
        let month = order_time.list[1][value[1]];
        let date = order_time.list[2][value[2]];
        let time = order_time.list[3][value[3]] + ':00';
        let date_time_str = year + month + date + ' ' + time;
        let date_time = date_time_str.replace('年', '-').replace('月', '-').replace('日', '')

        if ((new Date(date_time.replace(/\-/g, "/")).getTime()) < (new Date().getTime())) {
            wx.showToast({
                title: '无效时间',
                duration: 2000
            })
        } else {
            self.setData({
                ['order_time.index']: value,
                ['order_time.date_time']: date_time,
                ['order_time.date_time_str']: date_time_str
            })
        }
    },

    //切换时间
    orderTimeColumnChange: function (e) {
        let self = this;
        let order_time = self.data.order_time;
        let obj = e.detail;
        let mChange;
        let yChange;

        if(obj.column == 0) {
            if (obj.value == 0) {
                yChange = false;
                self.getDateTime();
            } else {
                yChange = true;
                let m = new Date().getMonth() + 1;
                let arrM = ['1月'];
                if (m == 12) {
                    arrM.push('2月')
                }
                let arrD = [];
                for (let i = 1; i <= 31; i++) {
                    arrD.push(i + '日')
                }
                let arrH = [];
                for (let j = 10; j <= 21; j++) {
                    arrH.push(j + ':00')
                }
                self.setData({
                    ['order_time.list']: [order_time.list[0], arrM, arrD, arrH],
                })
            }
        } else if (obj.column == 1) {
            if (obj.value == 0) {
                if (!yChange) {
                    mChange = false;
                    self.getDateTime();
                } else {
                    mChange = true;
                }
            } else {
                mChange = true;
                let m = new Date().getMonth() + 1;
                let m1 = m + obj.value;
                let maxD = (m1 == 2) ? 28 : (m1 == 4 || m1 == 6 || m1 == 9 || m1 == 11) ? 30 : 31;
                let arrD = [];
                for (let i = 1; i <= maxD; i++) {
                    arrD.push(i + '日')
                }
                let arrH = [];
                for (let j = 10; j <= 21; j++) {
                    arrH.push(j + ':00')
                }
                self.setData({
                    ['order_time.list']: [order_time.list[0], order_time.list[1], arrD, arrH],
                })
            }
        } else if (obj.column == 2) {
            if (obj.value == 0) {
                if (mChange == false) {
                    self.getDateTime();
                }
            } else {
                let arrH = [];
                for (let j = 10; j <= 21; j++) {
                    arrH.push(j + ':00')
                }
                self.setData({
                    ['order_time.list']: [order_time.list[0], order_time.list[1], order_time.list[2], arrH],
                })
            }
        }
    },

    //获取可选时间数据
    getDateTime: function() {
        let self = this;
        let y = new Date().getFullYear();
        let m = new Date().getMonth() + 1;
        let d = new Date().getDate();
        let h = new Date().getHours();

        let arrY = (m + 3) > 12 ? [y + '年', y + 1 + '年'] : [y + '年'];

        let minH = h;
        let minD = d;
        let maxD = (m == 2) ? 28 : (m == 4 || m == 6 || m == 9 || m == 11) ? 30 : 31;
        let minM = m;

        if(h < 9) {
            minH = 10;
        }else if (h > 19) {
            minH = 10;
            minD++;
        }else if (h <= 19) {
            //minH++;
            minH = parseInt(minH) + parseInt(2) //看房时间推后2小时
        }else {
            minH = 10;
            if(d < maxD) {
                minD++;
            }else {
                minD = 1;
                maxD = (m + 1 == 2) ? 28 : (m + 1 == 4 || m + 1 == 6 || m + 1 == 9 || m + 1 == 11) ? 30 : 31;
                minM == 12 ? (minM = 1) : minM++
            }
        }
        let arrH = [];
        for(let i = minH; i <= 21; i++) {
            arrH.push(i + ':00')
        }
        let arrD = [];
        for (let j = minD; j <= maxD; j++) {
            arrD.push(j + '日')
        }
        let arrM = [];
        for (let k = minM; k <= (minM + 2); k++) {
            if (k <= 12) {
                arrM.push(k + '月')
            }
        }

        self.setData({
            ['order_time.list']: [arrY, arrM, arrD, arrH]
        });
    },

    //选择入住时间
    livingTimeSelected: function(e) {
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

    //马上预约
    addAppointment: function() {
        let self = this;

        if(!self.data.order_time.date_time) {
            wx.showToast({
                title: '请选择看房时间',
                duration: 2000
            });

            return false;
        }

        let postData = {
            apartment: self.data.id,
            house_type: self.data.house_type.house_type_id,
            order_time: self.data.order_time.date_time,
        };

        if(self.data.cbd.cbd_id) {
            postData.cbd = self.data.cbd.cbd_id
        }
        if (self.data.price.price_id) {
            postData.budget = self.data.price.price_id;
        }
        if(self.data.living_time.id) {
            postData.living_time = self.data.living_time.id;
        }
        if(self.data.living_num.id) {
            postData.living_num = self.data.living_num.id
        }
        
        api.doHttp(apiUrl.addAppointmentUrl, postData).then(res => {
            let data = res.data;
            wx.showToast({
                title: res.msg,
                icon: 'success',
                duration: 2000,
                mask: true,
                success: res => {
                    setTimeout(function () {
                        wx.navigateBack();
                    }, 1500);
                }
            })
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})