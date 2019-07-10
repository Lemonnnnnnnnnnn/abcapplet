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

// 推荐品牌公寓
export const API_RECOMMEND_LIST = `${HOST}/recommend/recommendPost`

// 文章
export const API_ARTICLE_SHOW = `${HOST}/article/getpost`
export const API_BANNER_LIST = `${HOST}/article/listbannerpost`


/**
 ************************
 * 商圈相关
 ************************
 */
// 商圈列表
export const API_HOT_CBD_LIST = `${HOST}/dict/listHotCbdPost`

// 商圈详情
export const API_CBD_SHOW = `${HOST}/cbd/getPost`
export const PAYLOAD_CBD_SHOW = { cbd: '', type_id: 0, house_type: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

/**
 ************************
 * 活动相关
 ************************
 */
// 活动列表
export const API_ACTIVITY_LIST = `${HOST}/article/listHotActivityPost`

// 活动详情
export const API_ACTIVITY_SHOW = `${HOST}/article/getHotActivityPost`
export const PAYLOAD_ACTIVITY_SHOW = { id: 0, city: 0, cbd: '', house_type: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

/**
 ************************
 * 公寓相关
 ************************
 */
// 户型详情
export const API_HOUSE_TYPE_SHOW = `${HOST}/apartment/getTypePost`

// 公寓详情
export const API_APARTMENT_SHOW = `${HOST}/apartment/getPost`

// 搜索相关
export const API_HOT_SEARCH = `${HOST}/apartment/listHotSearchPost`
export const API_RECOMMEND_APARTMENT = `${HOST}/apartment/lookPost`

// 搜索列表
export const API_SEARCH_APARTMENT = `${HOST}/apartment/searchPost`
export const PAYLOAD_SEARCH_APARTMENT = { id: 0, city: 350200, search_key: '', cbd: '', type_id: 0, house_type: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

// 公寓列表
export const API_APARTMENT_LIST = `${HOST}/apartment/listPost`
export const PAYLOAD_APARTMENT_LIST = { city: 350200, cbd: "", tags: "", distance: 0, price_low: 0, price_high: 0, house_type: 0, latitude: 0, longitude: 0, current_page: 1, page_size: PAGE_SIZE }

// 心愿单公寓列表
export const API_FAVORITE_APARTMENT_LIST = `${HOST}/user/listCollectPost`
export const PAYLOAD_FAVORITE_APARTMENT_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

// 心愿单户型列表
export const API_FAVORITE_HOUSE_TYPE_LIST = `${HOST}/user/listCollectHouseTypePost`
export const PAYLOAD_FAVORITE_HOUSE_TYPE_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

// 商圈合集公寓
export const API_CBD_APARTMENT_LIST = `${HOST}/cbd/getPost`
export const PAYLOAD_CBD_APARTMENT_LIST = { cbd: '', type_id: 0, house_type: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

// 活动合集公寓
export const API_ACTIVITY_APARTMENT_LIST = `${HOST}/article/getHotActivityPost`
export const PAYLOAD_ACTIVITY_APARTMENT_LIST = { id: 0, city: 0, cbd: '', house_type: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

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

/**
 ************************
 * 订单相关
 ************************
 */

// 订单列表
export const API_ORDER_LIST = `${HOST}/order/listPost`
export const PAYLOAD_ORDER_LIST = { current_page: 0, page_size: PAGE_SIZE }

// 订单详情
export const API_ORDER_SHOW = `${HOST}/order/detailPost`

// 订单取消
export const API_ORDER_DELETE = `${HOST}/order/cancelOrderPost`

// 订单创建
export const API_ORDER_CREATE = `${HOST}/order/createOrderPost`
export const PAYLOAD_ORDER_CREATE = { room_id: 0, name: '', mobile: '', id_code: '', sign_time: '', appointment_id: 0 }

// 订单预览
export const API_ORDER_PREVIEW = `${HOST}/order/perOrderPost`
export const PAYLOAD_ORDER_PREVIEW = { room_id: 0, appointment_id: 0 }

// 风险金
export const API_RISK_LIST = `${HOST}/risk/listPost`
export const PAYLOAD_RISK_LIST = { current_page: 0, page_size: PAGE_SIZE }

// 风险金创建
export const API_RISK_CREATE = `${HOST}/risk/createPost`
export const PAYLOAD_RISK_CREATE = { order_id: 0, name: '', mobile: '', img: '[]' }

// 图片上传
export const API_UPLOAD_IMAGE = `${HOST}/upload/picturePost`

// 订单支付
export const API_ORDER_PAYMENT = `${HOST}/payment/payOrderPost`

/**
 ************************
 * 用户行程相关
 ************************
 */
export const API_APPOINTMENT_LIST = `${HOST}/appointment/listPost`
export const PAYLOAD_APPOINTMENT_LIST = { date:'2019-07-09', current_page: 1, page_size: PAGE_SIZE }


