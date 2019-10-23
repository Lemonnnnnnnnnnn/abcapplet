/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
import BaseComponent from '@components/base'
// import ApartmentCouponList from '@components/apartment-coupon-list'
import ApartmentCouponItem from '@components/apartment-coupon-item'

// 自定义常量
import {
  PAYLOAD_COUPON_CAN_USED,
} from '@constants/api'

// redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

@connect(state => state, {
  ...userActions,
})

class OrderCouponMask extends BaseComponent {

  static defaultProps = {
    show: false,
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }


  render() {
    const { show, onClose, couponList } = this.props

    return (
      show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
        <Board fixed='bottom' border='top'>
          <AtIcon onClick={onClose} value='close' size='15' className='p-2 mr-1 mt-1' color='#888' style='position : absolute ; right : 0'></AtIcon>
          <View className='text-huge  mt-2 text-center pb-2'> 选择优惠券</View>
          <ScrollView style={{ height: Taro.pxTransform(couponList && couponList.length && 750) }} scrollY onScrollToLower={this.onBottomOut}>
            {
              couponList.map(i =>
                <ApartmentCouponItem
                  key={i.status}
                  coupon={i}
                  onSelectCoupon={this.props.onSelectCoupon}
                  block='order'
                />)
            }

          </ScrollView>

          {couponList && !couponList.length && <View className='mt-2 text-secondary text-center text-large p-4'>暂无可用优惠券</View>}
          <View style={{ height: Taro.pxTransform(170) }}></View>
        </Board>
        <Masks show={show} />

      </View>

    )
  }
}

export default OrderCouponMask
