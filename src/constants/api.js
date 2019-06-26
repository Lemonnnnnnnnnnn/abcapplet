// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "http://test.abc.411er.cn/mini"
export const PROD_HOST = "http://test.abc.411er.cn/mini"
export const HOST = isDev ? DEV_HOST : PROD_HOST
export const PAGE_SIZE = 10

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

/**
 ************************
 * 公寓相关
 ************************
 */
// 公寓列表
export const API_APARTMENT_LIST = `${HOST}/apartment/listPost`
export const PAYLOAD_APARTMENT_LIST = { city: 350200, cbd: "", tags: "", distance: 0, price_low: 0, price_high: 0, house_type: 0, latitude: 0, longitude: 0, current_page: 1, page_size: 10 }

// 心愿单公寓列表
export const API_FAVORITE_APARTMENT_LIST = `${HOST}/user/listCollectPost`
export const PAYLOAD_FAVORITE_APARTMENT_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

// 心愿单户型列表
export const API_FAVORITE_HOUSE_TYPE_LIST = `${HOST}/user/listCollectHouseTypePost`
export const PAYLOAD_FAVORITE_HOUSE_TYPE_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

/**
 ************************
 * 用户相关
 ************************
 */

// 用户登录
export const API_USER_LOGIN = `${HOST}/auth/loginpost`

// 心愿单取消
export const API_USER_FAVORITE_DELETE = `${HOST}/user/deleteCollectPost`

// 心愿单添加
export const API_USER_FAVORITE_CREATE = `${HOST}/apartment/collectPost`

/**
 ************************
 * 房间相关
 ************************
 */

// 心愿单房间列表
export const API_FAVORITE_ROOM_LIST = `${HOST}/user/listCollectRoomPost`
export const PAYLOAD_FAVORITE_ROOM_LIST = { current_page: 1, page_size: PAGE_SIZE }
