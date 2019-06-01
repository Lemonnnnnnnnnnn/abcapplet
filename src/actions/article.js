import { SET_ARTICLE } from '@constants/article'
import { createAction } from '@utils/redux'
import { API_ARTICLE_SHOW } from '@constants/api'

/**
 * 获取广告列表
 * @param {*} payload
 */
export const dispatchArticle = payload => createAction({
  payload: { id: payload },
  method: 'POST',
  type: SET_ARTICLE,
  url: API_ARTICLE_SHOW,
  cb: (res) => res.data.data.article,
})
