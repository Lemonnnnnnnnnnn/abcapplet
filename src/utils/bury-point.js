import Taro from '@tarojs/taro'
import {API_INDEX_FUNNELDATAPOAT  } from '@constants/api'
/**
 * 埋点请求封装
 * @param {*} options
 */
export default async function buryPoint() {
  //获取路由

  const route = (Taro.getCurrentPages()).reverse()

  route.length >=2 && Taro.request({
    url:API_INDEX_FUNNELDATAPOAT,
    method:'POST',
    data:{
      city_id:Taro.getStorageSync('user_info').citycode,
      current_page:route[0].route,
      pre_page:route[1].route,
    },

    header:{
      'content-type': 'application/json'
    },

  })

}
