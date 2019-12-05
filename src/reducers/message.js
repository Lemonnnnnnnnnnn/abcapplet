import {
  APPONITMENT_DEFAULT,
  SET_MESSAGE_LIST
} from '@constants/appointment'


export default function appointment(state = APPONITMENT_DEFAULT,action) {
  switch (action.type) {
    case SET_MESSAGE_LIST:{
      return { ...action.payload }
    }

    default: {
      return state
    }
  }
}
