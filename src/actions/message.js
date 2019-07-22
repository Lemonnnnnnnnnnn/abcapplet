import { createAction } from '@utils/redux'

import{
  API_MESSAGE_CREATE,
  API_MESSAGE_LIST,
  } from '@constants/api'
import{
  SET_MESSAGE_CREATE,
  SET_MESSAGE_LIST,
  }from '@constants/appointment'

/**
 * 新增一条留言
 * @param {*} payload
 */
export const dispatchMessageCreate = (payload) => createAction({
  payload,
  method: 'POST',
  type: SET_MESSAGE_CREATE,
  url: API_MESSAGE_CREATE,
  cb: ({ data: { data } }) => ({ ...data })
})
//获取行程留言信息
export const dispatchMessageList = (payload) => createAction({
  payload,
  method: 'POST',
  type: SET_MESSAGE_LIST,
  url: API_MESSAGE_LIST,
  cb: ({ data: { data:{ message , appointment, } } }) => ({  list: message, appointment })
})
