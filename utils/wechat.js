/**
 * 微信登录
 * @author Jason<dcq@kuryun.cn>
 */
function login() {
    return new Promise((resolve, reject) => {
        wx.login({ success: resolve, fail: reject })
    })
}

/**
 * 获取微信用户信息
 * @author Jason<dcq@kuryun.cn>
 */
function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({ success: resolve, fail: reject })
    })
}

/**
 * 设置本地缓存
 * @param  {String} key    缓存键值
 * @param  {Objece} value  缓存值
 * @return {Promise}       
 * @author Jason<dcq@kuryun.cn>
 */
function setStorage(key, value) {
    return new Promise((resolve, reject) => {
        wx.setStorage({ key: key, data: value, success: resolve, fail: reject })
    })
}

/**
 * 获取本地缓存
 * @param  {String} key   缓存键值
 * @return {Promise} 
 * @author Jason<dcq@kuryun.cn>
 */
function getStorage(key) {
    return new Promise((resolve, reject) => {
        wx.getStorage({ key: key, success: resolve, fail: reject })
    })
}

/**
 * 获取位置信息
 * @param {String} type
 * @return {Promise} 
 * @author Jason<dcq@kuryun.cn>
 */
function getLocation(type) {
    return new Promise((resolve, reject) => {
        wx.getLocation({ type: type, success: resolve, fail: reject })
    })
}

/**
 * 获取授权的权限
 */
function getIsAuth(){
    return new Promise((resolve, reject) => {
        wx.getSetting({success: resolve, fail: reject});
    });
}

module.exports = {
    login,
    getUserInfo,
    setStorage,
    getStorage,
    getLocation,
    getIsAuth,
    original: wx
}