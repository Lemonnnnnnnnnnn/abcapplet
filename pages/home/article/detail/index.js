// pages/home/article/detail/index.js
const api = require('../../../../utils/api.js');
const util = require('../../../../utils/util.js');
const app = getApp();
const apiUrl = {
    getArticleUrl: 'article/getpost'
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 1,
        article: {
            title: '',
            content: '',
            create_time: ''
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
        //获取文章详情
        self.getArticle();
    },

    //获取文章详情
    getArticle: function() {
        let self = this;
        let postData = {
            id: self.data.id
        };

        api.doHttp(apiUrl.getArticleUrl, postData).then(res => {
            let data = res.data;
            let article = data.article;
            let content = '';

            //数据格式化
            if(article.content) {
                content = article.content.replace(/\<img/gi, '<img style="width:100%;height:auto" ')
            }
            
            self.setData({
                title: article.title,
                content: content,
                create_time: util.timeChange(article.create_time, 'timestamp', 'Y-m-d')
            });
        });
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let self = this;
        self.getArticle();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})