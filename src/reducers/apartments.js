import _ from 'lodash'
import { APARTMENT_DEFAULT, SET_APARTMENT_LIST } from '@constants/apartment'

export default function home(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_APARTMENT_LIST: {
      return _.uniqWith([...state, ...action.payload], _.isEqual)
    }

    default: {
      return state
    }
  }
}
