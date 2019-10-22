import {
  PAGE_HOME,
  PAGE_APPOINTMENT_SERVICES,
  PAGE_APPOINTMENT_CREATE,
  PAGE_APARTMENT_SHOW,
  PAGE_HOUSE_TYPE_SHOW,
} from '@constants/page'


export const AD_DEFAULT = []
export const SET_AD_LIST = 'SET_AD_LIST'

export const SUB_DEFAULT = { list: [], total: 0 }
export const TYPE_SUB_LIST = 'TYPE_SUB_LIST'
export const TYPE_NEXT_PAGE_SUB_LIST = 'TYPE_NEXT_PAGE_SUB_LIST'

export const AD_DISPATCH_DIST = [
  { type: 0, url: PAGE_HOME.slice(1) },
  { type: 1, url: PAGE_APPOINTMENT_SERVICES.slice(1) },
  { type: 2, url: PAGE_APPOINTMENT_CREATE.slice(1) },
  { type: 3, url: PAGE_APARTMENT_SHOW.slice(1) },
  { type: 4, url: PAGE_HOUSE_TYPE_SHOW.slice(1) },
  { type: 5, url: PAGE_APPOINTMENT_CREATE.slice(1) },
]
