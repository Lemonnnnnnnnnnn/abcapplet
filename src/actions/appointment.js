import { createAction } from '@utils/redux'

import {
  API_APPOINTMENT_LIST,
  PAYLOAD_APPOINTMENT_LIST,
  API_REVULUTION_CREAT,
  API_INTENTION_ROOM_SHOW,
  PAYLOAD_INTENTION_ROOM_SHOW,
  API_INTENTION_CREATE,
  API_APPOINTMENT_NIGHTPOST,
  API_APPOINTMENT_REWARDORDER,
  API_APPOINTMENT_DETAILREWARD,
} from '@constants/api'

import{
  SET_APPOINTMENT_LIST,
  SET_NEXT_PAGE_APPOINTMENT_LIST,
  SET_APPOINTMENT_REVELUTION,
  SET_APPOINTMENT_INTENTION_SHOW,
  SET_APPOINTMENT_INTENTION,
  SET_APPOINTMENT_NIGHTPOST,
  TYPE_APPOINTMENT_REWARDORDER,
  TYPE_APPOINTMENT_DETAILREWAR,

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
  // cb: ({ data: { data } }) => ({ ...data })
  cb:res=>{
    if(res) return {...res.data.data}
  }
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
  // cb: ({ data: { data } }) => ({ ...data })
  cb:res=>{
    if(res) return {...res.data.data}
  }
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

/**
 * 判断夜单时间
 * @param {*} payload
 */
export const dispatchAppointmentNight = () => createAction({

  method: 'POST',
  type: SET_APPOINTMENT_NIGHTPOST,
  url: API_APPOINTMENT_NIGHTPOST,
})


/**
 * 新增行程签约审核单
 * @param {*} payload
 */
export const dispatchAppointRewordOrder = (payload) => createAction({
  payload,
  method: 'POST',
  type: TYPE_APPOINTMENT_REWARDORDER,
  url: API_APPOINTMENT_REWARDORDER,
})


/**
 * 新增行程签约审核单
 * @param {*} payload
 */
export const dispatchAppointRewordOrderDetail = (payload) => createAction({
  payload,
  method: 'POST',
  type: TYPE_APPOINTMENT_DETAILREWAR,
  url: API_APPOINTMENT_DETAILREWARD,
})
