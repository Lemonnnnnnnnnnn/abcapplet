import {
  LOCALE_ACTIVITY_TYPE_TUAN,
  LOCALE_ACTIVITY_TYPE_LIAN,
  LOCALE_ACTIVITY_TYPE_XIAO,
  LOCALE_ACTIVITY_TYPE_CU,
  LOCALE_ACTIVITY_TYPE_LAO,
  LOCALE_ACTIVITY_TYPE_SHUIDIAN,
  LOCALE_ACTIVITY_TYPE_RENTTIME,
  LOCALE_ACTIVITY_TYPE_DISCOUNT,
  LOCALE_ACTIVITY_TYPE_SIMPLE_TUAN,
  LOCALE_ACTIVITY_TYPE_SIMPLE_LIAN,
  LOCALE_ACTIVITY_TYPE_SIMPLE_XIAO,
  LOCALE_ACTIVITY_TYPE_SIMPLE_CU,
  LOCALE_ACTIVITY_TYPE_SIMPLE_LAO,
  LOCALE_ACTIVITY_TYPE_SIMPLE_SHUIDIAN,
  LOCALE_ACTIVITY_TYPE_SIMPLE_RENTTIME,
  LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT,
} from '@constants/locale'

import {
  PAGE_APARTMENT_SHOW,
  PAGE_HOUSE_TYPE_SHOW,
} from '@constants/page'

export const APARTMENT_DEFAULT = {
  list: [],
  total: 0,
  type: ''
}

export const SHOW_APARTMENT = 'SHOW_APARTMENT'
export const SET_HOT_SEARCH = 'SET_HOT_SEARCH'
export const SHOW_HOUSE_TYPE = 'SHOW_HOUSE_TYPE'
export const SET_APARTMENT_LIST = 'SET_APARTMENT_LIST'
export const SET_RECOMMEND_APARTMENT = 'SET_RECOMMEND_APARTMENT'
export const UPDATE_APARTMENT_FAVORITE = 'UPDATE_APARTMENT_FAVORITE'
export const SET_NEXT_PAGE_APARTMENT_LIST = 'SET_NEXT_PAGE_APARTMENT_LIST'
export const SET_APARTMENT_LIST_TWO='SET_APARTMENT_LIST_TWO'
export const SET_NEXT_PAGE_APARTMENT_LIST_TWO='SET_NEXT_PAGE_APARTMENT_LIST_TWO'
export const SET_ARTICLE_APARTMENT_LIST = 'SET_ARTICLE_APARTMENT_LIST'
export const SET_FAVORITE_APARTMENT_LIST = 'SET_FAVORITE_APARTMENT_LIST'
export const SET_FAVORITE_HOUSETYPE_LIST='SET_FAVORITE_HOUSETYPE_LIST'
export const SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST = 'SET_NEXT_PAGE_FAVORITE_HOUSETYPE_LIST'
export const SET_NEXT_PAGE_FAVORITE_APARTMENT_LIST = 'SET_NEXT_PAGE_FAVORITE_APARTMENT_LIST'
export const SET_ACTIVITY_APARTMENT_LIST = 'SET_ACTIVITY_APARTMENT_LIST'
export const SET_NEXT_PAGE_ACTIVITY_APARTMENT_LIST = 'SET_NEXT_PAGE_ACTIVITY_APARTMENT_LIST'
export const TYPE_APARTMENT_INDEXDATAPOAT = 'TYPE_APARTMENT_INDEXDATAPOAT'
export const TYPE_HOUSETYPE_INDEXDATAPOAT = 'TYPE_HOUSETYPE_INDEXDATAPOAT'
export const TYPE_APARTMENT_REMAINTIME = 'TYPE_APARTMENT_REMAINTIME'
export const TYPE_FUNNEL = 'TYPE_FUNNEL'
export const TYPE_FUNNEL_ORDER = 'TYPE_FUNNEL_ORDER'

/**
 * 公寓类型
 * 1.主页里的公寓列表
 * 2.心愿单里面的户型
 * 3.心愿单里面的公寓
 * 4.商圈集合的公寓
 * 5.活动集合的公寓
 * 6.看了又看的公寓
 * 7.搜索相关的公寓
 * 8.文章详情的公寓
 */
// 公寓类型
export const TYPE_ARTICLE_APARTMENT = 'TYPE_ARTICLE_APARTMENT'
export const TYPE_FAVORITE_APARTMENT = 'TYPE_FAVORITE_APARTMENT'

export const TYPE_APPOINTMENT_SHOW = 'TYPE_APPOINTMENT_SHOW'
export const TYPE_APARTMENT_NEARBYPOST = 'TYPE_APARTMENT_NEARBYPOST'

// 户型类型
export const TYPE_CBD_APARTMENT = 'TYPE_CBD_APARTMENT'
export const TYPE_NORMAL_APARTMENT = 'TYPE_NORMAL_APARTMENT'

export const SET_APARTMENT_LOOK_LIST='SET_APARTMENT_LOOK_LIST'
export const SET_CBD_APARTMENT_LIST = 'SET_CBD_APARTMENT_LIST'
export const SET_NEXT_PAGE_CBD_APARTMENT_LIST = 'SET_NEXT_PAGE_CBD_APARTMENT_LIST'

export const TYPE_SEARCH_APARTMENT = 'TYPE_SEARCH_APARTMENT'
export const TYPE_ACTIVITY_APARTMENT = 'TYPE_ACTIVITY_APARTMENT'
export const TYPE_FAVORITE_HOUSE_TYPE = 'TYPE_FAVORITE_HOUSE_TYPE'
export const TYPE_RECOMMEND_HOUSE_TYPE = 'TYPE_RECOMMEND_HOUSE_TYPE'
export const TYPE_APPOINTMENT_CREATE = 'TYPE_APPOINTMENT_CREATE'



// 活动文案
export const ACTIVITY_TYPE_DIST = {
  tuan: {
    message: LOCALE_ACTIVITY_TYPE_TUAN,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_TUAN,
  },
  lian: {
    message: LOCALE_ACTIVITY_TYPE_LIAN,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_LIAN,
  },
  xiao: {
    message: LOCALE_ACTIVITY_TYPE_XIAO,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_XIAO,
  },
  cu: {
    message: LOCALE_ACTIVITY_TYPE_CU,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_CU,
  },
  lao: {
    message: LOCALE_ACTIVITY_TYPE_LAO,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_LAO,
  },
  shuidian: {
    message: LOCALE_ACTIVITY_TYPE_SHUIDIAN,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_SHUIDIAN,
  },
  rentTime: {
    message: LOCALE_ACTIVITY_TYPE_RENTTIME,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_RENTTIME,
  },
  discount: {
    message: LOCALE_ACTIVITY_TYPE_DISCOUNT,
    simple: LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT,
  }
}

// 用户须知
export const APARTMENT_NOTICE_DIST = {
  zkxz: {
    icon: 'person',
    message: '租客须知',
  },
  fysm: {
    icon: 'credit_card',
    message: '费用说明',
  },
  fwpz: {
    icon: 'build',
    message: '服务配套',
  },
}

// 类型对应链接
export const APARTMENT_URL_DIST = {
  // 公寓
  TYPE_ARTICLE_APARTMENT: PAGE_APARTMENT_SHOW,
  TYPE_FAVORITE_APARTMENT: PAGE_APARTMENT_SHOW,

  // 户型
  TYPE_CBD_APARTMENT: PAGE_HOUSE_TYPE_SHOW,
  TYPE_NORMAL_APARTMENT: PAGE_HOUSE_TYPE_SHOW,
  TYPE_SEARCH_APARTMENT: PAGE_HOUSE_TYPE_SHOW,
  TYPE_ACTIVITY_APARTMENT: PAGE_HOUSE_TYPE_SHOW,
  TYPE_FAVORITE_HOUSE_TYPE: PAGE_HOUSE_TYPE_SHOW,
  TYPE_RECOMMEND_HOUSE_TYPE: PAGE_HOUSE_TYPE_SHOW,
}

// 户型简介
export const HOUSE_TYPE_DESC = {
  fj: '房间',
  mj: '面积',
  cf: '厨房',
  wsj: '卫生间',
  yt: '阳台',
  jrz: '几人住',
}

// 优惠券
export const APARTMENT_COUPON_DIST = {
  1:{message : '领取'},
  2:{message : '已领取'},
  3:{message : '已使用'},
  4:{message : '已过期'},
}
