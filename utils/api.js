const API = 'https://apiv2.tuiniuwang.cn/mini/';
const fetch = require('./fetch');

/**
 * 用户发起接口请求前判断token是否存在
 * 不存在，则请求login接口
 * 存在，直接请求相应接口
 */
function doHttp(path, params) {
    return new Promise((resolve, reject) => {
        const obj = {
            token: wx.getStorageSync("token")
        };
        wx.request({
            url: `${API}/${path}`,
            data: Object.assign(obj, params),
            method: 'POST',
            header: {
                'Content-Type': 'json'
            },
            success: resolve,
            fail: reject
        })
    })
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
            url: `${API}/${path}`,
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
                url: `${API}/${data.url}`,
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
    doHttp,
    uploadimg,
    API
}
