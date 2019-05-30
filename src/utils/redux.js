/**
 * 封装 Redux
 */
import fetch from './request'

export function createAction({ url, payload, method, cb, type, fetchOptions }) {
  return (dispatch) => {
    return fetch({ url, payload, method, ...fetchOptions }).then((res) => {
      dispatch({ type, payload: cb ? cb(res) : res })
      return res
    })
  }
}
