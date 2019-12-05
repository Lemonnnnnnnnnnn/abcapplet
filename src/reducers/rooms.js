import {
  ROOM_DEFAULT,
  SET_ROOM_LIST,
  SET_NEXT_PAGE_ROOM_LIST
} from '@constants/room'

export default function home(state = ROOM_DEFAULT, action) {
  switch (action.type) {
    case SET_ROOM_LIST: {
      return { ...action.payload }
    }

    case SET_NEXT_PAGE_ROOM_LIST: {
      const { list: oldList } = state
      const { list, total, type } = action.payload
      return { list: [...oldList, ...list], total, type }
    }

    default: {
      return state
    }
  }
}
