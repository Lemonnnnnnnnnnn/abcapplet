import {
  TYPE_GET_USER_ACTIVITY,
  TYPE_GET_NEXTPAGE_USER_ACTIVITY
} from '@constants/user'

export default function userActivityList(state = [], action) {
  switch (action.type) {
      case TYPE_GET_USER_ACTIVITY: {
          return action.payload
      }
      case TYPE_GET_NEXTPAGE_USER_ACTIVITY: {
          const { list: oldList } = state
          const { list, total } = action.payload
          return { list: [...oldList, ...list], total }
      }

      default: {
          return state
      }
  }
}
