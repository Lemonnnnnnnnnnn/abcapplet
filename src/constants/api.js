// 接口基础配置
const isDev = process.env.NODE_ENV === 'development'
export const DEV_HOST = "https://api.gongyuabc.com/mini"
export const PROD_HOST = "https://api.gongyuabc.com/mini"
//http://test.abc.411er.cn/mini  测试环境
//https://api.gongyuabc.com/mini  线上环境
export const HOST = isDev ? DEV_HOST : PROD_HOST
export const PAGE_SIZE = 10

// 广告
export const API_AD_LIST = `${HOST}/ad/adPost`
export const API_AD_POPUP_LIST = `${HOST}/index/popupAdPost`
export const API_AD_POPUP_LIST_CLOSE = `${HOST}/index/closePopupAdPost`

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
export const PAYLOAD_CBD_SHOW = { cbd: '', type_id: 0, type_room: 0, type_floor: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

/**
 ************************
 * 活动相关
 ************************
 */
// 活动列表
export const API_ACTIVITY_LIST = `${HOST}/article/listHotActivityPost`

// 活动详情
export const API_ACTIVITY_SHOW = `${HOST}/article/getHotActivityPost`
export const PAYLOAD_ACTIVITY_SHOW = { id: 0, city: 0, cbd: '', type_room: 0, type_floor: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

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
export const PAYLOAD_SEARCH_APARTMENT = { id: 0, city: 350200, search_key: '', cbd: '', type_id: 0, type_room: 0, type_floor: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

// 公寓列表
export const API_APARTMENT_LIST = `${HOST}/apartment/listPost`
//is_select字段只是用来判断解决首页刷新问题。
export const PAYLOAD_APARTMENT_LIST = { city: 350200, cbd: "", tags: "", distance: 0, price_low: 0, price_high: 0, type_room: 0, type_floor: 0, latitude: 0, longitude: 0, current_page: 1, page_size: PAGE_SIZE, is_select: 1, isNew: 2 }

// 心愿单公寓列表
export const API_FAVORITE_APARTMENT_LIST = `${HOST}/user/listCollectPost`
export const PAYLOAD_FAVORITE_APARTMENT_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

// 心愿单户型列表
export const API_FAVORITE_HOUSE_TYPE_LIST = `${HOST}/user/listCollectHouseTypePost`
export const PAYLOAD_FAVORITE_HOUSE_TYPE_LIST = { current_page: 1, page_size: PAGE_SIZE, refresh: 1 }

// 商圈合集公寓
export const API_CBD_APARTMENT_LIST = `${HOST}/cbd/getPost`
export const PAYLOAD_CBD_APARTMENT_LIST = { cbd: '', type_id: 0, type_room: 0, type_floor: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

// 活动合集公寓
export const API_ACTIVITY_APARTMENT_LIST = `${HOST}/article/getHotActivityPost`
export const PAYLOAD_ACTIVITY_APARTMENT_LIST = { id: 0, city: 0, cbd: '', type_room: 0, type_room: 0, type_floor: 0, price_low: 0, price_high: 0, current_page: 1, page_size: PAGE_SIZE, latitude: 0, longitude: 0, distance: 0, tags: '' }

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

//获取用户信息
export const API_USER_INFORMATION = `${HOST}/user/getPost`

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
export const PAYLOAD_ORDER_CREATE = { room_id: 0, name: '', mobile: '', id_code: '', tenancy: '', appointment_id: 0, coupon_user_id: '' }
export const PAYLOAD_ORDER_DETAIL = { room_id: 0, appointment_id: 0, type_id: 0, apartment_id: 0, coupon_user_id: '', tenancy: 12 }

// 订单预览
export const API_ORDER_PREVIEW = `${HOST}/order/perOrderPost`
export const PAYLOAD_ORDER_PREVIEW = { room_id: 0, appointment_id: 0 }

// 风险金
export const API_RISK_LIST = `${HOST}/risk/listPost`
export const PAYLOAD_RISK_LIST = { current_page: 1, page_size: PAGE_SIZE }

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
//获取看房行程信息
export const API_APPOINTMENT_LIST = `${HOST}/appointment/listPost`
export const PAYLOAD_APPOINTMENT_LIST = { current_page: 1, page_size: PAGE_SIZE, city_id: 350200 }

//添加评价
export const API_REVULUTION_CREAT = `${HOST}/appointment/commentPost`
export const PAYLOAD_REVULUTION_CREAT = { appointment_id: 0, score: 1, comment: '' }

//添加看房评价
export const API_INTENTION_CREATE = `${HOST}/appointment/intentionPost`
export const PAYLOAD_INTENTION_CREATE = { appointment_id: '', score: '', room_ids: '' }

//获取行程下相关的房间列表
export const API_INTENTION_ROOM_SHOW = `${HOST}/appointment/roomPost`
export const PAYLOAD_INTENTION_ROOM_SHOW = { appointment_id: 0, room_no: '' }

//行程留言,新增一条留言
export const API_MESSAGE_CREATE = `${HOST}/appointment/addMessagePost`
export const PAYLOAD_MESSAGE_CREATE = { appointment_id: 0, content: '' }

//获取行程留言
export const API_MESSAGE_LIST = `${HOST}/appointment/listMessagePost`
export const PAYLOAD_MESSAGE_LIST = { appointment_id: 0 }
//提交需求卡
export const API_DEMAND_CREATE = `${HOST}/user/addDemandPost`
export const PAYLOAD_CREATE_DEMAND = { budget: '', cbd: '', living_time: '', people: '', type_room: 0, type_floor: 0 }

//判断用户是否弹过引导框
export const API_DEMAND_CHECK = `${HOST}/user/changeUserGuidePost`

//新增预约行程
export const API_APPOINTMENT_CREATE = `${HOST}/apartment/addappointmentpost`
export const PAYLOAD_APPOINTMENT_CREATE = { apartment: '', house_type: '', order_time: '', name: '', mobile: '', form_id: '' }

//获取行程详情
export const API_APPOINTMENT_SHOW = `${HOST}/appointment/detailPost`
export const API_USER_MSG = `${HOST}/user/getPost`

// 获取附近公寓列表
export const API_APARTMENT_NEARBYPOST = `${HOST}/apartment/nearbyPost`

// 手机授权
export const API_AUTH_MOBILEPOST = `${HOST}/auth/mobilePost`

//判断是否为夜单时间
export const API_APPOINTMENT_NIGHTPOST = `${HOST}/appointment/nightPost`

//新增行程签约核对单
export const API_APPOINTMENT_REWARDORDER = `${HOST}/appointment/rewardOrderPost`
export const PAYLOAD_APPOINTMENT_REWARDORDER = { appointment_id: 0, mobile: '', sign_time: '', tenancy: '', file_img: '', price: '', type: 0 }
//获取签约审核单详情
export const API_APPOINTMENT_DETAILREWARD = `${HOST}/appointment/detailRewardOrderPost`
// 查询签约审核单可选的房间列表
export const API_APPOINTMENT_REWARD_ORDER_ROOM_POST = `${HOST}/appointment/rewardOrderRoomPost`

// 首页数据接口
export const API_INDEXPOST = `${HOST}/index/indexPost`

//首页数据统计接口
export const API_HOME_INDEXDATAPOAT = `${HOST}/index/indexDataPost`
export const PAYLOAD_HOME_INDEXDATAPOAT = { type: 0, origin_id: 0 }

//公寓详情页数据统计
export const API_APARTMENT_INDEXDATAPOAT = `${HOST}/apartment/apartmentDetailDataPost`

//户型详情页数据统计
export const API_HOUSETYPE_INDEXDATAPOAT = `${HOST}/apartment/typeDetailDataPost`

//签约下定停留时间
export const API_APARTMENT_REMAINTIME = `${HOST}/apartment/remainTimePost`

//预约转化率(漏斗A,B)
export const API_FUNNEL = `${HOST}/index/funnelAppointmentPost`

//线上交易情况(漏斗D,E)
export const API_FUNNEL_ORDER = `${HOST}/index/funnelOrderPost`

//获取转租单列表
// https://sub.gongyuabc.com/api/v1/sublease/orders/index  //线上接口
// http://sub.abc.411er.cn/api/v1/sublease/orders/index     //测试接口
export const API_SUB_LIST = 'https://sub.gongyuabc.com/api/v1/sublease/orders/index'
export const PAYLOAD_SUB_LIST = { city_id: 350200, page: 1, size: 6, type: 1 }
//商圈
export const API_SUBLEASE_INDEX = `https://sub.gongyuabc.com/api/v1/sublease/index/index`
//获取中国城市列表
export const API_CITYCODE_LIST = `https://sub.gongyuabc.com/api/v1/common/setting/open-city`

//用户反馈接口
export const API_USER_FEEDBACK = `${HOST}/user/setFeedbackPost`
//用户漏斗接口
export const API_INDEX_FUNNELDATAPOAT = `${HOST}/index/funnelDataPost`


//优惠券相关

// 获取优惠券列表
export const API_COUPON_LIST = `${HOST}/coupon/listPost`
export const PAYLOAD_COUPON_LIST = { current_page: 1, page_size: 10 }

// 领取优惠券
export const API_COUPON_RECEIVE = `${HOST}/coupon/receivePost`


// 兑换码获取优惠券
export const API_COUPON_RECEIVECODE = `${HOST}/coupon/receiveCodePost`

// 获取用户名下优惠券
export const API_COUPON_USER = `${HOST}/coupon/userPost`
export const PAYLOAD_COUPON_ALL = { current_page: 1, page_size: 10 }
export const PAYLOAD_COUPON_CAN_USED = { current_page: 1, page_size: 10, status: 0 }
export const PAYLOAD_COUPON_HAVE_BEEN_USED = { current_page: 1, page_size: 10, status: 1 }
export const PAYLOAD_COUPON_USER_EXPIRED = { current_page: 1, page_size: 10, status: 2 }
//看房行程 看房不满意
export const API_APPOINTMENT_UNSATIS = `${HOST}/appointment/unsatisfactoryPost`
// 看房行程 修改看房时间
export const API_APPOINTMENT_CHANGE_APPOINTMENT_LOOKTIME = `${HOST}/appointment/changeAppointmentLookTimePost`

// 获取单一优惠券
export const API_COUPON_ALONE = `${HOST}/coupon/detailPost`

// 获取退租险人数和金额
export const API_SETTING_RISK_POST = `${HOST}/index/settingRiskPost`

// 设置用户所在站点
export const API_SETTING_CITY = `${HOST}/user/setCityPost`

// 获取用户详情
export const API_USER_ACTIVITY = `${HOST}/user/myActivityPost`


// 砍价相关
// 获取砍价列表
export const API_BARGAIN_LIST = `${HOST}/bargain/listPost`
export const PAYLOAD_BARGAIN_LIST = { current_page: 1, page_size: 10 }

// 获取砍价详情
export const API_BARGAIN_DETAIL = `${HOST}/bargain/detailPost`

// 发起砍价
export const API_BARGAIN_CUT = `${HOST}/bargain/cutPost`

// 帮砍
export const API_BARGAIN_HELP_CUT = `${HOST}/bargain/helpCutPost`

// 领取优惠券
export const API_BARGAIN_GET_COUPON = `${HOST}/bargain/getCouponPost`

// 预约砍价
export const API_BARGAIN_APPOINTMENT = `${HOST}/bargain/appointmentBargainPost`

// 获取砍价海报
export const API_BARGAIN_GET_POSTER = `${HOST}/bargain/getPosterPost`
