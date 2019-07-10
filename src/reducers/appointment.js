import {
  SET_APPOINTMENT_LIST
} from '@constants/appointment'
import {
  APARTMENT_DEFAULT,
} from '@constants/apartment'

export default function appointment(state = APARTMENT_DEFAULT ,action) {
  switch (action.type) {
    case SET_APPOINTMENT_LIST: {
      const { list, total } = action.payload
      return { list, total }
    }
    default: {
      return state
    }
  }
}
