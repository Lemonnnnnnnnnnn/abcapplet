export const ROOM_DEFAULT = {
  list: [],
  total: 0,
  type: ''
}

export const SET_ROOM_LIST = 'SET_ROOM_LIST'
export const UPDATE_ROOM_FAVORITE = 'UPDATE_ROOM_FAVORITE'
export const SET_NEXT_PAGE_ROOM_LIST = 'SET_NEXT_PAGE_ROOM_LIST'

export const TYPE_NORMAL_ROOM = 'TYPE_NORMAL_ROOM'
export const TYPE_FAVORITE_ROOM = 'TYPE_FAVORITE_ROOM'

export const ROOM_STATUS_DIST = {
  0: { message: '已租', color: 'grey' },
  1: { message: '未租', color: 'primary' },
  2: { message: '即将释放', color: 'grey' },
}
