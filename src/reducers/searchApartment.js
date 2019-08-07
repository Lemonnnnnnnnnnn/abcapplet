

import {
    APARTMENT_DEFAULT,
    SET_NEXT_PAGE_APARTMENT_LIST_TWO,
    SET_APARTMENT_LIST_TWO,
  
  } from '@constants/apartment'
  
  
  export default function apartmentsearch(state = APARTMENT_DEFAULT ,action) {
    switch (action.type) {
      case SET_APARTMENT_LIST_TWO: {
        const { list, total } = action.payload
        return { list, total }
      }
  
      case SET_NEXT_PAGE_APARTMENT_LIST_TWO: {
        const { list: oldList } = state
        const { list, total } = action.payload
        return { list: [...oldList, ...list], total }
      }
  
  
  
      default: {
        return state
      }
    }
  }
  