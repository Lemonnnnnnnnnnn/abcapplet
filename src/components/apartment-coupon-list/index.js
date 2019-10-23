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
        coupon={i}
        block={block}
        status={i.status}
        validity_period_time={i.validity_period_time}
      />)


    // 详情优惠券
    const apartmentCouponList = block === 'apartment' && couponList.length && couponList.map(i =>
      <ApartmentCouponItem
        key={i.id}
        block={block}
        coupon={i}
        params={this.props.params}
        onListRefresh={this.props.onListRefresh}
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

