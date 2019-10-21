/* eslint-disable react/jsx-indent-props */
// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
// Redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

// 自定义组件
import BaseList from '@components/base-list'
import ApartmentCouponItem from '@components/apartment-coupon-item'

@connect(state => state, {
  ...userActions
})
class ApartmentCouponList extends BaseList {

  render() {
    const { couponList, block } = this.props

    // 用户优惠券
    const userCouponList = block === 'user' && couponList.length && couponList.map(i =>
      <ApartmentCouponItem
        key={i.list.id}
        block={block}
        status={i.status}
        validity_period_time={i.validity_period_time}

        type={i.list.type}
        coupon_type={i.list.coupon_type}
        use_type={i.list.use_type}
        worth={i.list.worth}
        apartment_title={i.list.apartment_title}
        apartment_type={i.list.apartment_type}
        apartment_no={i.list.apartment_no}
      />)


    // 详情优惠券
    const apartmentCouponList = block === 'apartment' && couponList.length && couponList.map(i =>
      <ApartmentCouponItem
        key={i.id}
        block={block}
        status={i.status}
        validity_period_time={i.validity_period_time}
        couponId={i.id}
        params={this.props.params}
        onListRefresh={this.props.onListRefresh}

        max_receive_num={i.max_receive_num}
        can_receive={i.can_receive}
        receive_reason={i.receive_reason}
        type={i.type}
        coupon_type={i.coupon_type}
        use_type={i.use_type}
        worth={i.worth}
        apartment_title={i.apartment_title}
        apartment_type={i.apartment_type}
        apartment_no={i.apartment_no}
      />)

    return (
      <View>
        {userCouponList}
        {apartmentCouponList}
      </View>
    )

  }
}
export default ApartmentCouponList

