import { createAction } from '@utils/redux'

import {
  API_APPOINTMENT_LIST,
  PAYLOAD_APPOINTMENT_LIST,
  API_REVULUTION_CREAT,
  PAYLOAD_REVULUTION_CREAT,
} from '@constants/api'

import{
  SET_APPOINTMENT_LIST,
  SET_NEXT_PAGE_APPOINTMENT_LIST,
  SET_APPOINTMENT_REVELUTION,
}from '@constants/appointment'

/**
 * 获取行程列表
 * @param {*} payload
 */
export const dispatchAppointmentList = payload => createAction({
  payload: { ...PAYLOAD_APPOINTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_APPOINTMENT_LIST,
  url: API_APPOINTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 获取行程列表下一页
 * @param {*} payload
 */
export const dispatchNextPageApartmentList = payload => createAction({
  payload: { ...PAYLOAD_APPOINTMENT_LIST, ...payload },
  method: 'POST',
  type: SET_NEXT_PAGE_APPOINTMENT_LIST,
  url: API_APPOINTMENT_LIST,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 提交服务评价
 * @param {*} payload
 */
export const dispatchRevelutionComment = (payload) => createAction({
  payload,
  method: 'POST',
  type: SET_APPOINTMENT_REVELUTION,
  url: API_REVULUTION_CREAT,
  cb: ({ data: { data } }) => ({ ...data })
})

