import {
  LOCALE_HEADER_RETURN_TITLE,
  LOCALE_HEADER_RETURN_DESC,
  LOCALE_HEADER_LIMIT_TITLE,
  LOCALE_HEADER_LIMIT_DESC,
  LOCALE_SUBMIT,
  LOCALE_APPLYING,
  LOCALE_APPLYED,

  LOCALE_APPLY_RISK,
  LOCALE_COSTED_RISK,
  LOCALE_APPLYING_RISK,
  LOCALE_WILL_COST_RISK,
  LOCALE_RISK_STATUS_APPLY_SUCCESS,
} from '@constants/locale'

// Redux 相关
export const RISK_DEFAULT = { list: [], total: 0 }
export const CREATE_RISK = 'CREATE_RISK'
export const SET_RISK_LIST = 'SET_RISK_LIST'
export const SET_NEXT_PAGE_RISK_LIST = 'SET_NEXT_PAGE_RISK_LIST'

// 头部列表
export const RISK_HEADERS = [
  {
    id: 1,
    icon: 'local_atm',
    title: LOCALE_HEADER_RETURN_TITLE,
    desc: LOCALE_HEADER_RETURN_DESC,
    url : 'https://images.gongyuabc.com//image/money.png',
    height : 76,
    width : 66,
  },
  {
    id: 2,
    icon: 'all_inclusive',
    title: LOCALE_HEADER_LIMIT_TITLE,
    desc: LOCALE_HEADER_LIMIT_DESC,
    url : 'https://images.gongyuabc.com//image/prompt.png',
    height : 68,
    width : 72,
  }
]

export const RISK_STEP = [
  { title: LOCALE_SUBMIT },
  { title: LOCALE_APPLYING },
  { title: LOCALE_APPLYED },
]

export const RISK_STATUS_DIST = {
  0: { message: LOCALE_APPLY_RISK, textColor: 'text-yellow', color: 'btn-yellow', disable: false, current: 0, desc: LOCALE_WILL_COST_RISK },
  1: { message: LOCALE_APPLYING_RISK, textColor: 'text-secondary', color: 'btn-light-grey', disable: true, current: 1, desc: LOCALE_COSTED_RISK },
  2: { message: LOCALE_APPLYING_RISK, textColor: 'text-secondary', color: 'btn-light-grey', disable: true, current: 1, desc: LOCALE_COSTED_RISK },
  3: { message: LOCALE_RISK_STATUS_APPLY_SUCCESS, textColor: 'text-secondary', color: 'btn-yellow', disable: true, current: 2, desc: LOCALE_COSTED_RISK },
  4: { message: LOCALE_APPLY_RISK, textColor: 'text-secondary', color: 'btn-yellow', disable: false, current: 1, desc: LOCALE_COSTED_RISK },
}
