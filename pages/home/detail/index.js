// pages/home/detail/index.js
const api = require('../../../utils/api.js');
const util = require('../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getApartmentUrl: 'apartment/getpost',
    articleListUrl: 'article/listpost',
    collectUrl: 'apartment/collectpost',
    nearApartmentUrl: 'apartment/nearbypost'
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 1,   //公寓id
        type_id: 0, //户型id
        show_dialog: false,
        apartment: {
            title: '',
            one_word: '',
            latitude: 0,
            longitude: 0,
            tags: [],
            rules: [],  //折扣规则
            adv: '',
            detail: '',
            collect: 0,  //是否收藏
            address: '', //地址
        },
        pictures: {
            list: [],
            picture_tags: [],
            tags_title: [],
            current_id: '',
            current: 0,  //当前所在滑块的 index
            image_list: [],  //图片url地址
        },
        facility_list: [], //配套
        house_types: [], //房型
        dailog_house: '', //弹框中显示的户型
        notices: [], 
        format_notice: [],
        article_list: [], //文章列表,
        near_list: [], //附近公寓列表
        version: '', //微信版本号
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let self = this;

        if(options.id) {
            self.setData({
                id: options.id
                //id: 1
            });    
        }
        //获取户型id（点击其他页面户型缩略图跳转）
        if(options.type_id) {
            self.setData({
                type_id: options.type_id
            });
        }
        
        //获取系统信息
        self.getSystemInfo();
        //获取公寓详情
        self.getApartment();
        //文章列表
        self.articleList();
        //附近公寓
        self.nearApartment();
    },

    //获取系统信息
    getSystemInfo: function() {
        let self = this;

        wx.getSystemInfo({
            success(res) {
                let version = res.version;
                version = version.replace(/\./g, "")
                self.setData({
                    version: version
                });
                console.log(self.data.version);
            }
        })
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
            let format_pictures = []; 
            let image_list = [];
            let picture_tags = [];
            let tags_title = [];
            let current_id = ''; //当前滑块id
            let house_types = [];
            let notices = [];
            let format_notice = [];
            let detail = ''; //描述
            
            //数据格式化
            if (apartment.tags) {
                tags = apartment.tags.split(',');
            }
            if (apartment.extend_info.rules) {
                rules = JSON.parse(apartment.extend_info.rules);
            }
            if (apartment.extend_info.pictures) {
                pictures = JSON.parse(apartment.extend_info.pictures);
            }
            if (apartment.extend_info.notices) {
                notices = JSON.parse(apartment.extend_info.notices);
            }
            if (apartment.extend_info.detail) {
                detail = apartment.extend_info.detail.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
            }

            if (pictures.length) {
                pictures.forEach((el, index) => {
                    if(tags_title.indexOf(el.title) == -1) {
                        tags_title.push(el.title);
                        picture_tags.push({id: el.id, title: el.title });
                    }
                    image_list.push(el.url);
                });
                //默认第一id为当前滑动id
                current_id = pictures[0]['id'];

                //数据结构调整，根据id分组排列，防止后台错乱顺序上传，导致前端标签跳动
                picture_tags.forEach((e1, index1) => {
                    pictures.forEach((e2, index2) => {
                        if(e2.id == e1.id) {
                            format_pictures.push(e2);
                        }
                    });
                });
            }
            //房型
            if (apartment.house_types.length) {
                apartment.house_types.forEach((el, index) => {
                    el.pictures = JSON.parse(el.pictures);
                    el.tags = el.tags.split(',').slice(0, 2);
                    house_types.push(el);
                });
                
                //有户型缩略图，则筛选户型数据
                if(self.data.type_id) {
                    let dailog_house = '';

                    house_types.forEach((el, index) => {
                        if (el.id == self.data.type_id) {
                            dailog_house = el;
                        }
                    });
                    self.setData({
                        show_dialog: true,
                        dailog_house: dailog_house
                    });
                }
            }
            //配套
            if (notices.length) {
                notices.forEach((el, index) => {
                    el.word = el.word.split(',');
                    format_notice.push(el);
                });
            }
           
            self.setData({
                ['apartment.title']: apartment.title,
                ['apartment.one_word']: apartment.one_word,
                ['apartment.latitude']: parseFloat(apartment.latitude),
                ['apartment.longitude']: parseFloat(apartment.longitude),
                ['apartment.tags']: tags,
                ['apartment.rules']: rules,
                ['apartment.adv']: apartment.extend_info.adv,
                ['apartment.detail']: detail,
                ['apartment.collect']: apartment.is_collect,
                ['apartment.address']: apartment.address,
                ['pictures.list']: format_pictures,
                ['pictures.picture_tags']: picture_tags,
                ['pictures.tags_title']: tags_title,
                ['pictures.current_id']: current_id,
                ['pictures.image_list']: image_list,
                facility_list: apartment.facility_list,
                house_types: house_types,
                format_notice: format_notice
            });

            console.log(self.data.pictures.list);
            console.log(self.data.pictures.picture_tags);
        });
    },

    //公寓详情里的文章列表
    articleList: function() {
        let self = this;
        let postData = {};

        api.doHttp(apiUrl.articleListUrl, postData).then(res => {
            let data = res.data;
            
            self.setData({
                article_list: data.list
            });
        });
    },

    //获取附件公寓列表
    nearApartment: function () {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.nearApartmentUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                near_list: data.list
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

    //点击标签
    tagChange: function(e) {
        let self = this;
        let dataset = e.currentTarget.dataset;
        let list = self.data.pictures.list;
        let current_index = 0;  //当前滑动图片下标index
        let len = list.length; //图片数组长度

        for(let index=0; index<len; index++) {
            if(list[index]['id'] == dataset.id) {
                current_index = index;
                break;   //foreach不支持break；改用for
            }
        }

        self.setData({
            ['pictures.current']: current_index
        });
    },

    //打开户型弹框
    openDialog: function(e) {
        let self = this;
        let house_types = self.data.house_types;
        let dataset = e.currentTarget.dataset;
        let dailog_house = '';

        house_types.forEach((el, index) => {
            if(el.id == dataset.id) {
                dailog_house = el;
            }
        });

        self.setData({
            show_dialog: true,
            dailog_house: dailog_house
        });
        console.log(self.data.dailog_house); 
    },

    //关闭户型弹框
    closeDialog: function() {
        this.setData({
            show_dialog: false
        });
    },

    //点击收藏按钮
    collectClick: function() {
        let self = this;
        if (!wx.getStorageSync('user_info')) {
            //未登录
            api.doLogin().then(res => {
                //收藏操作
                self.collect();
            });
        } else {
            //收藏操作
            self.collect();
        }
    },

    //收藏操作
    collect: function() {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.collectUrl, postData).then(res => {
            let data = res.data;

            self.setData({
                ['apartment.collect']: data.collect.status
            });
        });
    },

    //客服页面点击小程序信息
    handleContact: function(e) {
       
    },

    //拨打电话 
    makePhoneCall: function () {
        let self = this;

        wx.makePhoneCall({
            phoneNumber: '0592-5911297'
        })
    },

    //打开地理位置
    openLocation: function() {
        let self = this;
        let apartment = self.data.apartment;
        let latitude = parseFloat(apartment.latitude);
        let longitude = parseFloat(apartment.longitude);

        if(latitude && longitude) {
            wx.openLocation({
                latitude: latitude,
                longitude: longitude,
                scale: 18,
                address: apartment.address
            });
        }
    },

    //防止触摸滚动穿透
    move: function() {},

    //详情页轮播看大图
    previewDetailImage: function (e) {
        let self = this;
        let data = e.currentTarget.dataset;
        let src = data.src;
        let pictures = self.data.pictures;

        wx.previewImage({
            current: src,
            urls: pictures.image_list
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        //获取公寓详情
        self.getApartment();
        //文章列表
        self.articleList();
        wx.stopPullDownRefresh();
        wx.hideLoading();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (options) {
        let obj = {};
        let self = this;
        let apartment = self.data.apartment;

        obj = {
            title: apartment.title,
            path: '/pages/home/detail/index?id=' + self.data.id
        };

        return obj
    }
})