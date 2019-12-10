import Taro from '@tarojs/taro'
/**
 * 使用promisse封装判断手机机型的问题（ios10以下的用户跳转客服提示页面）
 *
 */

const getPhoneSystem = () => new Promise(function (resolve, reject) {

  if (Taro.getSystemInfoSync().system.split(/\s+/)[0] === 'iOS' && parseInt(Taro.getSystemInfoSync().system.split(/\s+/)[1].split('.')[0]) < 10) {
    resolve('IOS9')
  } else {
    resolve('NO_IOS9')
  }
})

export default getPhoneSystem






