import { createAction } from '@utils/redux'

import {
  API_APPOINTMENT_LIST,
  PAYLOAD_APPOINTMENT_LIST,
} from '@constants/api'

import{
  SET_APPOINTMENT_LIST,
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
// export const dispatchNextPageApartmentList = payload => createAction({
//   payload: { ...PAYLOAD_APARTMENT_LIST, ...payload },
//   method: 'POST',
//   type: SET_NEXT_PAGE_APARTMENT_LIST,
//   url: API_APARTMENT_LIST,
//   cb: ({ data: { data } }) => ({ ...data, type: TYPE_NORMAL_APARTMENT })
// })

