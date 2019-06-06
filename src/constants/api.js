// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "http://101.37.152.237:8081/mini"
export const PROD_HOST = "https://api.gongyuabc.com/mini"
export const HOST = isDev ? DEV_HOST : PROD_HOST

// 用户
export const API_USER_LOGIN = `${HOST}/auth/loginpost`

// 广告
export const API_AD_LIST = `${HOST}/ad/adPost`

/**
 *  字典相关
 */
export const API_DIST_LIST = `${HOST}/dict/listPost`
export const API_CITY_LIST = `${HOST}/dict/listsitepost`
export const API_HOT_CBD_LIST = `${HOST}/dict/listHotCbdPost`

// 推荐品牌公寓
export const API_RECOMMEND_LIST = `${HOST}/recommend/recommendPost`

// 文章
export const API_ARTICLE_SHOW = `${HOST}/article/getpost`
export const API_BANNER_LIST = `${HOST}/article/listbannerpost`
export const API_ACTIVITY_LIST = `${HOST}/article/listHotActivityPost`

// 公寓列表
export const API_APARTMENT_LIST = `${HOST}/apartment/listPost`
export const PAYLOAD_APARTMENT_LIST = {
  city: 350200,
  cbd: "",
  tags: "",
  distance: 0,
  price_low: 0,
  price_high: 0,
  house_type: 0,
  latitude: 0,
  longitude: 0,
  current_page: 1,
  page_size: 10,
}
