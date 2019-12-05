import { timeFormat } from '@utils/time-judge'

export const DIST_DEFAULT = {}
export const SET_DIST_LIST = 'SET_DIST_LIST'

export const CREATE_ORDER_DIST = {
  platform_rent_price: { Chinese: '平台租金减免：', id: 0, type: 1 },
  apartment_rent_price: { Chinese: '公寓租金减免：', id: 1, type: 1 },
  platform_deposit_price: { Chinese: '平台定金减免：', id: 2, type: 2 },
  apartment_deposit_price: { Chinese: '公寓定金减免：', id: 3, type: 2 }
}

// 半小时制时间和KEY值对应表
export const TIME_PICKER_DIST = Array.from({ length: 25 }, (i, key) => ({ key: key }))
TIME_PICKER_DIST.forEach((i, key) => {
  const hour = timeFormat(9 + Math.ceil(key / 2))
  const minute = key % 2 === 0 ? 30 : 0
  const minuteStr = key % 2 === 0 ? ':30' : ':00'

  i.hoursAndMin = hour + minuteStr
  i.hours = hour
  i.minutes = minute
})


