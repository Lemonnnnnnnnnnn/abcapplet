import Taro from '@tarojs/taro'
import Map from '../utils/qqmap-wx-jssdk'

/**
 * 使用promisse封装获取当前位置的方法
 *
 */

const getUserLocation = (latitude, longitude) => new Promise(function (resolve, reject) {
  var qqmapsdk = new Map({
    key: '3EOBZ-JDO3O-N4UWO-SSK7I-OSQHJ-NHF4J'
  });
  qqmapsdk.reverseGeocoder({
    location: {
      latitude: latitude,
      longitude: longitude,
    }, success: function (result) {
      const { city_code, nation_code } = result.result.ad_info
      const city_id = city_code.replace(nation_code, '')
      Taro.setStorageSync('cityDefault' , city_id)
      resolve(city_id)
    }
  })
})

export default getUserLocation






