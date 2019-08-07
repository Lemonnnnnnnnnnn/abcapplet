const config = require("config.js");

/**
 * POST网络请求
 * @param {String} path  接口地址
 * @param {Object} params  接口参数
 * @param {function} func 回调函数
 * @param {bool} load 请求成功是否隐藏loading
 * @return  {Promise}
 * @author Jason<dcq@kuryun.cn>
 */
function doHttp(path, params, load=true) {
    return new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
            mask: true
        });

        //拦截后续请求
        if (wx.getStorageSync('interrupt')) {
            wx.hideLoading();
            return false;
        }

        let data = params;
        if (wx.getStorageSync("token")) {
            let obj = {
                token: wx.getStorageSync("token")
            };
            data = Object.assign(obj, params);
        }

        wx.request({
            url: `${config.api}/${path}`,
            method: 'POST',
            data: data,
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (false != load) {
                    wx.hideLoading();
                }
                if (res.data.code) {
                    switch (res.data.code) {
                        case 1:
                            resolve(res.data);
                            break;
                        case 2003:
                            wx.showToast({
                                title: res.data.msg,
                                image: config.closeIcon,
                                duration: 2000,
                                mask: true
                            })
                            break;
                        case 911:
                            //回话过期
                            wx.setStorageSync('interrupt', 1);
                            wx.setStorageSync('token', '');
                            //重新登录
                            doLogin(1);
                            break;
                    }
                } else {
                    //请求失败
                    wx.hideLoading();
                    wx.showToast({
                        title: '请求失败',
                        image: config.closeIcon,
                        duration: 2000,
                        mask: true
                    });
                }
            },
            fail: err => {
                //网络不通
                wx.hideLoading();
                wx.showToast({
                    title: '网络异常',
                    image: config.closeIcon,
                    duration: 2000,
                    mask: true
                });
            }
        });
    });
}

/**
 * 用户登录
 * @param {number} param  是否返回上一页
 * @author Jason<dcq@kuryun.cn> 
 */
function doLogin(param = 0) {
    return new Promise((resolve, reject) => {
        wx.login({
            success: res => {
                let code = res.code;
                //获取用户信息
                wx.getUserInfo({
                    success: res => {
                        let encryptedData = res.encryptedData;
                        let iv = res.iv;
                        let data = {
                            "code": code,
                            "iv": iv,
                            "encrypt_data": encryptedData
                        }
                        wx.setStorageSync('token', ''); //清除token
                        wx.showLoading({
                            title: '加载中',
                            mask: true
                        });
                        wx.request({
                            url: `${config.api}/${config.loginPath}`,
                            method: 'POST',
                            data: data,
                            header: {
                                'content-type': 'application/json'
                            },
                            success: res => {
                                wx.hideLoading();
                                if (res.data.code == 1) {
                                    let data = res.data.data;

                                    wx.setStorageSync('token', data.token);
                                    wx.setStorageSync('user_info', data.user);
                                    wx.setStorageSync('interrupt', 0);

                                    if (param == 1) {
                                        let tabs = getCurrentPages();
                                        let last = tabs[tabs.length - 1];
                                        let options = last.options || {};

                                        last.onLoad(options);
                                    }
                                    //回调
                                    resolve(res.data);
                                } else if (res.data.code == 2003) {
                                    wx.showToast({
                                        title: res.data.msg,
                                        image: config.closeIcon,
                                        duration: 2000,
                                        mask: true
                                    });
                                }
                            },
                            fail: err => {
                                wx.hideLoading();
                                wx.showToast({
                                    title: '网络异常',
                                    image: config.closeIcon,
                                    duration: 2000,
                                    mask: true
                                });
                            }
                        });
                    },
                    fail: err => {
                        wx.reLaunch({
                            url: '/pages/auth/index'
                        })
                    }
                });
            },
            fail: err => {
                wx.showToast({
                    title: '微信授权失败',
                    image: config.closeIcon,
                    duration: 2000,
                    mask: true
                });
            }
        });
    });
}

/**
 * 上传资源到服务器
 * @param   {String} filePath 要上传文件资源的路径
 * @param   {String} path     接口地址
 * @return  {Promise}
 */
function uploadFile(path, filePath) {
    return new Promise((resolve, reject) => {
        wx.uploadFile({
            url: `${config.api}/${path}`,
            filePath: filePath,
            name: 'file',
            success: resolve,
            fail: reject
        })
    })
}

/**
 * 上传多张图片到服务器
 * @param   {Object}  data   
 * @return  {Promise}  
 */
function uploadimg(data) {
    let url = data.url; //接口地址
    let path = data.path; //图片路径数组
    let list = []; //容器实例

    // 生成多个promise实例
    for (let i = 0; i < path.length; i++) {
        list[i] = new Promise((resolve, reject) => {
            wx.uploadFile({
                url: `${config.api}/${data.url}`,
                filePath: path[i],
                name: 'file',
                success: resolve,
                fali: reject
            });
        });
    }
    return Promise.all(list);
}

module.exports = {
    uploadFile,
    doLogin,
    doHttp,
    uploadimg
}
