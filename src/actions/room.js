import { createAction } from '@utils/redux'

import {
  API_FAVORITE_ROOM_LIST
} from '@constants/api'

import {
  SET_ROOM_LIST,
  SET_NEXT_PAGE_ROOM_LIST,
  TYPE_NORMAL_ROOM,
  TYPE_FAVORITE_ROOM,
} from '@constants/room'

/**
 * 获取心愿房型
 */
export const dispatchFavoriteRoomList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_ROOM_LIST,
  url: API_FAVORITE_ROOM_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_ROOM })
})

/**
 * 获取心愿房型下一页
 */
export const dispatchNextPageFavoriteRoomList = payload => createAction({
  payload,
  method: 'POST',
  type: SET_NEXT_PAGE_ROOM_LIST,
  url: API_FAVORITE_ROOM_LIST,
  cb: ({ data: { data } }) => ({ ...data, type: TYPE_FAVORITE_ROOM })
})
