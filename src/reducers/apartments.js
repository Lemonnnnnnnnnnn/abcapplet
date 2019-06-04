import _ from 'lodash'
import { APARTMENT_DEFAULT, SET_APARTMENT_LIST, SET_NEXT_PAGE_APARTMENT_LIST } from '@constants/apartment'

export default function home(state = APARTMENT_DEFAULT, action) {
  switch (action.type) {
    case SET_APARTMENT_LIST: {
      return _.uniqBy(action.payload, 'id')
    }

    case SET_NEXT_PAGE_APARTMENT_LIST: {
      console.log(action.payload)
      return _.uniqBy([...state, ...action.payload], 'id')
    }

    default: {
      return state
    }
  }
}
