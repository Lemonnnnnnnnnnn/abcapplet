import logo from '@assets/icons/logo.png'

import {
  PAGE_USER_FAVORITE,
  PAGE_ORDER_INDEX,
  PAGE_ORDER_DOWN_PAYMENT,
  PAGE_ORDER_RISK_FUND,

  // TODO 小黄卡先不做
  // PAGE_USER_CARD,
} from '@constants/page'

import {
  LOCALE_USER_FAVORITE,
  LOCALE_USER_FAVORITE_EXTRA_TEXT,
  LOCALE_ORDER_LIST,
  LOCALE_DOWN_PAYMENT,
  LOCALE_RISK_FUND,

  // TODO 小黄卡先不做
  // LOCALE_USER_CARD,
  // LOCALE_USER_CARD_EXTRA_TEXT,
} from '@constants/locale'

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

export const USER_OPTIONS_LISTS = [
  // TODO 小黄卡先不做
  //   {
  //   id: 1,
  //   icon: 'credit-card',
  //   url: PAGE_USER_CARD,
  //   title: LOCALE_USER_CARD,
  //   extraText: LOCALE_USER_CARD_EXTRA_TEXT,
  // },
  {
    id: 2,
    icon: 'heart-2',
    url: PAGE_USER_FAVORITE,
    title: LOCALE_USER_FAVORITE,
    extraText: LOCALE_USER_FAVORITE_EXTRA_TEXT,
  }
]

export const USER_ORDER_OPTIONS_LISTS = [
  {
    id: 1,
    icon: 'bullet-list',
    url: PAGE_ORDER_INDEX,
    title: LOCALE_ORDER_LIST,
    extraText: LOCALE_USER_FAVORITE_EXTRA_TEXT,
  },
  {
    id: 2,
    icon: 'shopping-bag',
    url: PAGE_ORDER_DOWN_PAYMENT,
    title: LOCALE_DOWN_PAYMENT,
    extraText: LOCALE_USER_FAVORITE_EXTRA_TEXT,
  },
  {
    id: 3,
    icon: 'money',
    url: PAGE_ORDER_RISK_FUND,
    title: LOCALE_RISK_FUND,
  }
]
