import { createAction } from '@utils/redux'
import { API_RECOMMEND_LIST } from '@constants/api'
import { SET_RECOMMEND_LIST } from '@constants/recommend'
import { PAGE_ARTICLE_SHOW } from '@constants/page'

/**
 * 获取推荐公寓
 * @param {*} payload
 */
export const dispatchRecommendList = payload => createAction({
  payload: { city: payload },
  method: 'POST',
  type: SET_RECOMMEND_LIST,
  url: API_RECOMMEND_LIST,
  cb: (res) => res.data.data.list.map(i => ({ ...i, url: `${PAGE_ARTICLE_SHOW}?id=${i.article_id}` })),
})
