import {
  LOCALE_BUSINESS_LIKEABILITY_NONE,
  LOCALE_BUSINESS_LIKEABILITY_NORMAL,
  LOCALE_BUSINESS_LIKEABILITY_HIGH,
  LOCALE_BUSINESS_LIKEABILITY_SUPER,
  LOCALE_BUSINESS_LIKEABILITY_SIGNING,

  LOCALE_APPOINTMENT_MESSAGE,
  LOCALE_APPOINTMENT_RELUTION,
  LOCALE_APPOINTMENT_EVALUTION,
  LOCALE_APPOINTMENT_INTENTION,
} from "@constants/locale"

export const SET_APPOINTMENT_LIST = 'SET_APPOINTMENT_LIST'
export const SET_NEXT_PAGE_APPOINTMENT_LIST = 'SET_NEXT_PAGE_APPOINTMENT_LIST'
export const SET_APPOINTMENT_REVELUTION = 'SET_APPOINTMENT_REVELUTION'

export const TYPE_NORMAL_APPOINTMENT = ' TYPE_NORMAL_APPOINTMENT'

export const APPONITMENT_DEFAULT = {
  list: [],
  total: 0,
}

//评星满意度
export const BUSINESS_LIKEABILITY_DIST = {
  1: { message: LOCALE_BUSINESS_LIKEABILITY_NONE },
  2: { message: LOCALE_BUSINESS_LIKEABILITY_NORMAL },
  3: { message: LOCALE_BUSINESS_LIKEABILITY_HIGH },
  4: { message: LOCALE_BUSINESS_LIKEABILITY_SUPER },
  5: { message: LOCALE_BUSINESS_LIKEABILITY_SIGNING },
}

//行程留言，联系管家，服务评价，看房意向
export const APPOINTMENT_FOUFUNCTION_DIST = {
  1: {name:1, src:'http://images.gongyuabc.com/image/icon/servixe-bottom-one.png',title:LOCALE_APPOINTMENT_MESSAGE },
  2: {name:2, src:'http://images.gongyuabc.com/image/icon/servixe-bottom-four.png',title:LOCALE_APPOINTMENT_RELUTION },
  3: {name:3, src:'http://images.gongyuabc.com/image/icon/servixe-bottom-two.png',title:LOCALE_APPOINTMENT_EVALUTION },
  4: {name:4, src:'http://images.gongyuabc.com/image/icon/servixe-bottom-three.png',title:LOCALE_APPOINTMENT_INTENTION},
}
