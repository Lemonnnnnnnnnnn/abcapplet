import {
  LOCALE_ORDER_STATUS_CANCEL,
  LOCALE_ORDER_STATUS_LOCK_WAITING,
  LOCALE_ORDER_STATUS_LOCK_SUCCESS,
  LOCALE_ORDER_STATUS_LOCK_FAIL,
  LOCALE_ORDER_STATUS_SUCCESS,
} from '@constants/locale'

// Redux 相关
export const ORDER_DEFAULT = { list: [], total: 0 }
export const SHOW_ORDER = 'SHOW_ORDER'
export const CREATE_ORDER = 'CREATE_ORDER'
export const DELETE_ORDER = 'DELETE_ORDER'
export const SET_ORDER_LIST = 'SET_ORDER_LIST'
export const SET_NEXT_PAGE_ORDER_LIST = 'SET_NEXT_PAGE_ORDER_LIST'

// 状态常量
export const ORDER_STATUS_CANCEL = 0
export const ORDER_STATUS_LOCK_WAITING = 1
export const ORDER_STATUS_LOCK_SUCCESS = 3
export const ORDER_STATUS_LOCK_FAIL = 5
export const ORDER_STATUS_SUCCESS = 7

// 状态字典
export const ORDER_STATUS_DIST = {
  0: { const: ORDER_STATUS_CANCEL, message: LOCALE_ORDER_STATUS_CANCEL, isLight: false, },
  1: { const: ORDER_STATUS_LOCK_WAITING, message: LOCALE_ORDER_STATUS_LOCK_WAITING, isLight: true },
  3: { const: ORDER_STATUS_LOCK_SUCCESS, message: LOCALE_ORDER_STATUS_LOCK_SUCCESS, isLight: true },
  5: { const: ORDER_STATUS_LOCK_FAIL, message: LOCALE_ORDER_STATUS_LOCK_FAIL, isLight: false },
  7: { const: ORDER_STATUS_SUCCESS, message: LOCALE_ORDER_STATUS_SUCCESS, isLight: false },
}
