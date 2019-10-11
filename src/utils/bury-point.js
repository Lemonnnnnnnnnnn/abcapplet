import Taro from '@tarojs/taro'
import {API_INDEX_FUNNELDATAPOAT  } from '@constants/api'
/**
 * 埋点请求封装
 * @param {*} options
 */
export default async function buryPoint() {
  //获取路由

  console.log((Taro.getCurrentPages()).reverse())
  const route = (Taro.getCurrentPages()).reverse()


  //线上 https://api.gongyuabc.com/mini/index/funnelDataPost
  //测试 http://test.abc.411er.cn/mini/index/funnelDataPost

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
