// pages/home/detail/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getApartmentUrl: 'apartment/getpost',
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 1,   //公寓id
        show_dialog: false,
        apartment: {
            title: '',
            one_word: '',
            latitude: 0,
            longitude: 0,
            tags: [],
            rules: [],  //折扣规则
            adv: '',
            detail: ''
        },
        pictures: {
            list: [],
            picture_tags: [],
            tags_title: [],
            current_id: ''
        },
        facility_list: [], //配套
        house_types: [], //房型
        notices: [], 
        format_notice: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if(options.id) {
            self.setData({
                //id: options.id
                id: 1
            });    
        }
        //获取公寓详情
        self.getApartment();
    },

    //自定义返回
    back: function () {
        wx.navigateBack();
    },

    //获取公寓详情
    getApartment: function() {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.getApartmentUrl, postData).then(res => {
            let data = res.data;
            let apartment = data.apartment;
            let tags = [];
            let rules = [];
            let pictures = [];  
            let picture_tags = [];
            let tags_title = [];
            let current_id = ''; //当前滑块id
            let house_types = [];
            let notices = [];
            let format_notice = [];
            
            //数据格式化
            tags = apartment.tags.split(',');
            rules = JSON.parse(apartment.extend_info.rules);
            pictures = JSON.parse(apartment.extend_info.pictures);
            notices = JSON.parse(apartment.extend_info.notices);

            if(pictures.length) {
                pictures.forEach((el, index) => {
                    if(tags_title.indexOf(el.title) == -1) {
                        tags_title.push(el.title);
                        picture_tags.push({id: el.id, title: el.title });
                    }
                });
                //默认第一id为当前滑动id
                current_id = pictures[0]['id'];
            }

            //房型
            if(apartment.house_types.length) {
                apartment.house_types.forEach((el, index) => {
                    el.pictures = JSON.parse(el.pictures);
                    el.tags = el.tags.split(',').slice(0, 2);
                    house_types.push(el);
                });
            }

            //配套
            if(notices.length) {
                notices.forEach((el, index) => {
                    el.word = el.word.split(',');
                    format_notice.push(el);
                });
            }
            console.log(format_notice);
            self.setData({
                ['apartment.title']: apartment.title,
                ['apartment.one_word']: apartment.one_word,
                ['apartment.latitude']: apartment.latitude,
                ['apartment.longitude']: apartment.longitude,
                ['apartment.tags']: tags,
                ['apartment.rules']: rules,
                ['apartment.adv']: apartment.extend_info.adv,
                ['apartment.detail']: apartment.extend_info.detail.replace(/\<img/gi, '<img style="width:100%;height:auto" '),
                facility_list: apartment.facility_list,
                house_types: house_types,
                format_notice: format_notice,
                ['pictures.list']: pictures,
                ['pictures.picture_tags']: picture_tags,
                ['pictures.tags_title']: tags_title,
                ['pictures.current_id']: current_id
            });
        });
    },

    //监听滑动事件
    swiperChange: function(e) {
        let self = this;
        let list = self.data.pictures.list;
        let current = e.detail.current;
        
        //设置当前current_id
        self.setData({
            ['pictures.current_id']: list[current]['id']
        });
    },

    //打开户型弹框
    openDialog: function() {
        this.setData({
            show_dialog: true
        });
    },

    //关闭户型弹框
    closeDialog: function() {
        this.setData({
            show_dialog: false
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