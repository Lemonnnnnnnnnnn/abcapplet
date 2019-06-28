import fetch from '@utils/request'

import { API_ARTICLE_SHOW } from '@constants/api'
import { SET_ARTICLE } from '@constants/article'
import { dispatchArticleApartment } from '@actions/apartment'

/**
 * 获取广告列表
 * @param {*} payload
 */
export const dispatchArticle = (payload) => (dispatch) => {
  return fetch({ url: API_ARTICLE_SHOW, payload, method: 'POST', })
    .then(({ data: { data: { article, apartment_list } } }) => {
      dispatch({ type: SET_ARTICLE, payload: article })
      dispatch(dispatchArticleApartment(apartment_list))
    })
}
