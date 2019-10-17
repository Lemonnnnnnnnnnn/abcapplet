import {
    TYPE_COUPON_USERPOST,
    TYPE_NEXTPAGE_COUPON_USERPOST
} from '@constants/user'

export default function userCouponList(state = [], action) {
    switch (action.type) {

        case TYPE_COUPON_USERPOST: {
            return action.payload
        }
        case TYPE_NEXTPAGE_COUPON_USERPOST: {
            const { list: oldList } = state
            const { list, total } = action.payload
            return { list: [...oldList, ...list], total }
        }

        default: {
            return state
        }
    }
}