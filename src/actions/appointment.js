import { createAction } from '@utils/redux'

import {
  API_APPOINTMENT_LIST,
  PAYLOAD_APPOINTMENT_LIST,
  API_REVULUTION_CREAT,
  API_INTENTION_ROOM_SHOW,
  PAYLOAD_INTENTION_ROOM_SHOW,
  API_INTENTION_CREATE,
  API_MESSAGE_CREATE,
  API_MESSAGE_LIST,
} from '@constants/api'

import{
  SET_APPOINTMENT_LIST,
  SET_NEXT_PAGE_APPOINTMENT_LIST,
  SET_APPOINTMENT_REVELUTION,
  SET_APPOINTMENT_INTENTION_SHOW,
  SET_APPOINTMENT_INTENTION,
  SET_MESSAGE_CREATE,
  SET_MESSAGE_LIST,
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

/**
 * 获取行程下相关的房间列表
 * @param {*} payload
 */
export const dispatchIntentionList = (payload) => createAction({
  payload:{...PAYLOAD_INTENTION_ROOM_SHOW,...payload},
  method: 'POST',
  type: SET_APPOINTMENT_INTENTION_SHOW,
  url: API_INTENTION_ROOM_SHOW,
  cb: ({ data: { data } }) => ({ ...data })
})

/**
 * 提交意向
 * @param {*} payload
 */
export const dispatchIntentionComment = (payload) => createAction({
  payload,
  method: 'POST',
  type: SET_APPOINTMENT_INTENTION,
  url: API_INTENTION_CREATE,
  cb: ({ data: { data } }) => ({ ...data })
})

