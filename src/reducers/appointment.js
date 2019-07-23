import {
  APPONITMENT_DEFAULT,
  SET_APPOINTMENT_LIST,
  SET_NEXT_PAGE_APPOINTMENT_LIST,

} from '@constants/appointment'


export default function appointment(state = APPONITMENT_DEFAULT ,action) {
  switch (action.type) {
    case SET_APPOINTMENT_LIST: {
      const { list, total } = action.payload
      return { list, total }
    }

    case SET_NEXT_PAGE_APPOINTMENT_LIST: {
      const { list: oldList } = state
      const { list, total } = action.payload
      return { list: [...oldList, ...list], total }
    }



    default: {
      return state
    }
  }
}
