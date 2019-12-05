/* eslint-disable react/jsx-indent-props */
// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
// Redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

// 自定义组件
import BaseList from '@components/base-list'
import CouponItem from '@components/coupon-item'

@connect(state => state, {
  ...userActions
})
class CouponList extends BaseList {

  render() {
    const { couponList, block, houseType_id, apartment_id } = this.props

    // 用户优惠券
    const userCouponList = block === 'user' && couponList.length && couponList.map(i =>
      <CouponItem
        key={i.list.id}
        coupon={i.list}
        block={block}
        status={i.status}
      />)


    // 详情优惠券
    const apartmentCouponList = block === 'apartment' && couponList.length && couponList.map(i =>
      <CouponItem
        key={i.id}
        block={block}
        status={i.status}
        houseType_id={houseType_id}
        apartment_id={apartment_id}
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
export default CouponList

