import { HOME_CITY_LIST, HOME_CAROUSEL_LIST, HOME_CBD_LIST } from '@constants/home'
import { API_CITY_LIST, API_BANNER_LIST, API_HOT_CBD_LIST, PAGE_ARTICLE_SHOW, PAGE_CBD_SHOW } from '@constants/api'
import { createAction } from '@utils/redux'

/**
 * 获取城市列表
 * @param {*} payload
 */
export const dispatchCityList = () => createAction({
  payload: {},
  method: 'POST',
  type: HOME_CITY_LIST,
  url: API_CITY_LIST,
  cb: (res) => res.data.data.list,
})

/**
 * 获取轮播列表
 * @param {*} payload
 */
export const dispatchCarousel = payload => createAction({
  payload: { city: payload, type: 'basic' },
  method: 'POST',
  type: HOME_CAROUSEL_LIST,
  url: API_BANNER_LIST,
  cb: (res) => res.data.data.list.map(i => {
    i.url = `${PAGE_ARTICLE_SHOW}/?id=${i.id}`
    return i
  }),
})

/**
 * 获取商圈列表
 */
export const dispatchCBD = payload => createAction({
  payload: { city: payload, },
  method: 'POST',
  type: HOME_CBD_LIST,
  url: API_HOT_CBD_LIST,
  cb: (res) => res.data.data.list.map(i => {
    i.url = `${PAGE_CBD_SHOW}/?id=${i.id}`
    return i
  }),
})

/**
 * 获取轮播详情
 * @param {*} payload
 */
// export const dispatchCarouselDesc = payload => createAction({
//   payload: { city: payload, type: 'basic' },
//   method: 'POST',
//   type: HOME_CAROUSEL_LIST,
//   url: API_BANNER_LIST,
//   cb: (res) => res.data.data.list,
// })
