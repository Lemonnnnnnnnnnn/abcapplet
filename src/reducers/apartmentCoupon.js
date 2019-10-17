import {
    TYPE_COUPON_LISTPOST,
    TYPE_NEXTPAGE_COUPON_LISTPOST
} from '@constants/apartment'

export default function apartmentCouponList(state = [], action) {
    switch (action.type) {

        case TYPE_COUPON_LISTPOST: {
            return action.payload
        }
        case TYPE_NEXTPAGE_COUPON_LISTPOST: {
            const { list: oldList } = state
            const { list, total } = action.payload
            return { list: [...oldList, ...list], total }
        }

        default: {
            return state
        }
    }
}