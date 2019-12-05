import {
  LOCALE_ORDER_STATUS_CANCEL,
  LOCALE_ORDER_STATUS_LOCK_WAITING,
  LOCALE_ORDER_STATUS_LOCK_SUCCESS,
  LOCALE_ORDER_STATUS_LOCK_FAIL,
  LOCALE_ORDER_STATUS_SUCCESS,
  LOCALE_ORDER_STATUS_PAY_WAITING,

  LOCALE_LOCK_ROOM,
  LOCALE_LOCK_ROOM_DESC,
  LOCALE_LOCK_RISK,
  LOCALE_LOCK_RISK_DESC,
} from '@constants/locale'

// Redux 相关
export const ORDER_DEFAULT = { list: [], total: 0 }
export const SHOW_ORDER = 'SHOW_ORDER'
export const CREATE_ORDER = 'CREATE_ORDER'
export const DELETE_ORDER = 'DELETE_ORDER'
export const PAYMENT_ORDER = 'PAYMENT_ORDER'
export const PREVIEW_ORDER = 'PREVIEW_ORDER'
export const SET_ORDER_LIST = 'SET_ORDER_LIST'
export const SET_NEXT_PAGE_ORDER_LIST = 'SET_NEXT_PAGE_ORDER_LIST'

// 状态常量
export const ORDER_STATUS_CANCEL = 0
export const ORDER_STATUS_LOCK_WAITING = 1
export const ORDER_STATUS_LOCK_SUCCESS = 3
export const ORDER_STATUS_LOCK_FAIL = 5
export const ORDER_STATUS_SUCCESS = 7
export const ORDER_STATUS_PAY_WAITING = -1

// 付款
export const ORDER_PAY_WAITING = 0
export const ORDER_PAIED = 1

// 状态字典
export const ORDER_STATUS_DIST = {
  '-1': { const: ORDER_STATUS_PAY_WAITING, message: LOCALE_ORDER_STATUS_PAY_WAITING, isLight: true, },
  0: { const: ORDER_STATUS_CANCEL, message: LOCALE_ORDER_STATUS_CANCEL, isLight: false, },
  1: { const: ORDER_STATUS_LOCK_WAITING, message: LOCALE_ORDER_STATUS_LOCK_WAITING, isLight: true },
  3: { const: ORDER_STATUS_LOCK_SUCCESS, message: LOCALE_ORDER_STATUS_LOCK_SUCCESS, isLight: true, height: 30, width: 25, icon: 'https://images.gongyuabc.com//image/locking.png' },
  5: { const: ORDER_STATUS_LOCK_FAIL, message: LOCALE_ORDER_STATUS_LOCK_FAIL, isLight: false },
  7: { const: ORDER_STATUS_SUCCESS, message: LOCALE_ORDER_STATUS_SUCCESS, isLight: false, height: 23, width: 33, icon: 'https://images.gongyuabc.com//image/check.png' },
}

// 头部列表
export const ORDER_HEADERS = [
  {
    id: 1,
    icon: 'lock',
    title: LOCALE_LOCK_ROOM,
    url: "https://images.gongyuabc.com//image/lock.png",
    desc: LOCALE_LOCK_ROOM_DESC,
  },
  {
    id: 2,
    icon: 'all_inclusive',
    title: LOCALE_LOCK_RISK,
    url: "https://images.gongyuabc.com//image/riskMoney.png",
    desc: LOCALE_LOCK_RISK_DESC,
  }
]
