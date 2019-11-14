import logo from '@assets/icons/logo.png'

import {

  PAGE_ORDER_INDEX,

  PAGE_RISK_INDEX,

  // TODO 小黄卡先不做
  // PAGE_USER_CARD,
} from '@constants/page'

import {
  LOCALE_USER_FAVORITE,
  LOCALE_USER_FAVORITE_EXTRA_TEXT,
  LOCALE_USER_NEED,
  LOCALE_USER_NEED_EXTRA_TEXT,

  LOCALE_ORDER_LIST,
  LOCALE_RISK_FUND,

  LOCALE_USER_COUPON,
  LOCALE_USER_ACTIVITY,
  LOCALE_USER_COUPON_EXTRA_TEXT,
} from '@constants/locale'

import { USER_WISH, REQUIREMENT_CARD, PREFERENTIAL } from '@constants/picture'

export const USER_DEFAULT = {
  // 城市数据
  city: "",
  country: "中国",
  province: "",
  citycode: 0,

  // 用户数据
  id: 0,
  username: "",
  headimgurl: logo,
  create_time: "",
  update_time: "",
  token: "",

  // 默认配置
  openid: "",
  language: "zh_CN",
  sex: 1,
}

export const USER_INFO = 'USER_INFO'
export const USER_LOGIN = 'USER_LOGIN'
export const USER_LOGOUT = 'USER_LOGOUT'
export const USER_CITY_CODE = 'USER_CITY_CODE'
export const CREATE_USER_FAVORITE = 'CREATE_USER_FAVORITE'
export const DELETE_USER_FAVORITE = 'DELETE_USER_FAVORITE'
export const TYPE_DEMAND_CREATE = 'TYPE_DEMAND_CREATE'
export const TYPE_DEMAND_CHECK = 'TYPE_DEMAND_CHECK'
export const TYPE_USER_FEEDBACK = 'TYPE_USER_FEEDBACK'
export const TYPE_COUPON_USERPOST = 'TYPE_COUPON_USERPOST'
export const TYPE_NEXTPAGE_COUPON_USERPOST = 'TYPE_NEXTPAGE_COUPON_USERPOST'
export const TYPE_COUPON_RECEIVECODEPOST = 'TYPE_COUPON_RECEIVECODEPOST'
export const TYPE_GET_COUPON_DETAILPOST = 'TYPE_GET_COUPON_DETAILPOST'


export const APPOINTMENT_RESERVATION = 'https://images.gongyuabc.com//image/appointment.png'
export const RISK_MONEY = 'https://images.gongyuabc.com//image/risk.png'

export const USER_OPTIONS_LISTS = [
  {
    id: 1,
    icon: USER_WISH,
    title: LOCALE_USER_FAVORITE,
    extraText: LOCALE_USER_FAVORITE_EXTRA_TEXT,
  },
  {
    id: 2,
    icon: REQUIREMENT_CARD,
    title: LOCALE_USER_NEED,
    extraText: LOCALE_USER_NEED_EXTRA_TEXT,
  },
  {
    id: 3,
    icon: PREFERENTIAL,
    title: LOCALE_USER_COUPON,
    extraText: LOCALE_USER_COUPON_EXTRA_TEXT,
  },
  {
    id: 4,
    icon: PREFERENTIAL,
    title: LOCALE_USER_ACTIVITY,
    extraText: LOCALE_USER_COUPON_EXTRA_TEXT,
  },
]


export const USER_ORDER_OPTIONS_LISTS = [
  {
    id: 1,
    imageurl: APPOINTMENT_RESERVATION,
    icon: 'event_available',
    url: PAGE_ORDER_INDEX,
    title: LOCALE_ORDER_LIST,
    extraText: LOCALE_USER_FAVORITE_EXTRA_TEXT,
  },
  {
    id: 2,
    imageurl: RISK_MONEY,
    icon: 'local_atm',
    url: PAGE_RISK_INDEX,
    title: LOCALE_RISK_FUND,
  }
]

export const TIMETAGLIST =
{
  0: { id: 1, name: '马上', active: false },
  1: { id: 7, name: '7 天', active: false },
  2: { id: 15, name: '15天', active: false },
  3: { id: 32, name: '一个月后', active: false }
}

export const PEOPLETTAGLIST = {
  0: { id: 1, name: '1 人', active: false },
  1: { id: 2, name: '2 人', active: false },
  2: { id: 3, name: '3 人', active: false },
  3: { id: 4, name: '3人以上', active: false }
}


export const GET_USER_PHONE = 'getUserPhone'

// 优惠券
export const USER_COUPON_DIST = [
  { title: '可使用', active: true, status: 0, ref: 'CouponListCanUsed' },
  { title: '已使用', active: false, status: 1, ref: 'CouponListHaveBeenUsed' },
  { title: '已过期', active: false, status: 2, ref: 'CouponListExpired' },
]

// 设置用户所在站点
export const SET_USER_CITY = 'SET_USER_CITY'

// 获取用户活动
export const TYPE_GET_USER_ACTIVITY = 'TYPE_GET_USER_ACTIVITY'
export const TYPE_GET_NEXTPAGE_USER_ACTIVITY = 'TYPE_GET_NEXTPAGE_USER_ACTIVITY'
