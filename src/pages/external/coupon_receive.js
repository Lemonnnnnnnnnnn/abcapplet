import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ApartmentCouponList from '@components/apartment-coupon-list'
import { PAYLOAD_COUPON_LIST } from '@constants/api'

import BaseComponent from '@components/base'

// redux相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

import '../../styles/_board.scss'


@connect(state => state, {
  ...apartmentActions,
})

class ExternalIndex extends BaseComponent {
  config = {
    navigationBarTitleText: '优惠券领取',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  componentWillMount() {
    // const { id } = this.$router.params
  }

  render() {
    const { apartmentCouponList: { list } } = this.props
    const { id } = this.$router.params
    return (
      <View >
        <View className='decorate-gradient'></View>
        {/* title */}
        <View className='text-huge text-bold ml-3 mt-3'>待领取优惠券</View>
        {/* list */}
        <ApartmentCouponList
          block='apartment'
          couponList={list}
          ref={this.CouponList}
          params={this.props.params}
          onListRefresh={this.onListRefresh}

          defaultPayload={{ ...PAYLOAD_COUPON_LIST, apartment_id: id }}
          dispatchList={this.props.dispatchCouponListPost}
          dispatchNextPageList={this.props.dispatchNextPageCouponListPost}
        />

      </View>
    )
  }
}

export default ExternalIndex
