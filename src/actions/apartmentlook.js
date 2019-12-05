import { createAction } from '@utils/redux'

import {
  API_RECOMMEND_APARTMENT,
} from '@constants/api'

import {

  SET_APARTMENT_LOOK_LIST,

  TYPE_RECOMMEND_HOUSE_TYPE,

} from '@constants/apartment'

/**
 * 推荐公寓列表
 */
export const dispatchRecommendHouseType = payload => createAction({
  payload,
  method: 'POST',
  type: SET_APARTMENT_LOOK_LIST,
  url: API_RECOMMEND_APARTMENT,
  cb: ({ data: { data } }) => ({
    list: data.list,
    total: data.list.length,
    type: TYPE_RECOMMEND_HOUSE_TYPE,
  })
})
