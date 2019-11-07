/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'
import TabBar from '@components/tab-bar'

// 自定义组件
import BaseComponent from '@components/base'
import CouponItem from '@components/coupon-item'


// redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

@connect(state => state, {
  ...userActions,
})

class OrderCouponMask extends BaseComponent {

  static defaultProps = {
    show: false,
    buttons: [{ message: '确定', method: 'onConfirm' }]
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  onConfirm() {
    this.props.onSelectCouponConfirm()
  }


  render() {
    const { show, onClose, couponList, buttons } = this.props
    return (
      show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
        <Board fixed='bottom' border='top'>
          <AtIcon onClick={onClose} value='close' size='15' className='p-2 mr-1 mt-1' color='#888' style='position : absolute ; right : 0'></AtIcon>
          <View className='at-row at-row__align--end ml-4 py-3'>
            <View className='text-huge '> 选择优惠券</View>
            <View className='text-small text-secondary ml-2' style={{marginBottom : Taro.pxTransform(3) }}>部分优惠券可叠加使用</View>
          </View>
          <ScrollView style={{ height: Taro.pxTransform(couponList && couponList.length && 750) }} scrollY >
            {
              couponList.map(i =>
                <CouponItem
                  key={i.id}
                  status={i.status}
                  coupon={i}
                  onSelectCoupon={this.props.onSelectCoupon}
                  block='order'
                />)
            }

          </ScrollView>

          {couponList && !couponList.length && <View className='mt-2 text-secondary text-center text-large p-4'>暂无可用优惠券</View>}
          <View style={{ height: Taro.pxTransform(170) }}></View>

          <TabBar
            hasShare={false}
            buttons={buttons}
            onClick={this.onConfirm}
          />
        </Board>
        <Masks show={show} />


      </View>

    )
  }
}

export default OrderCouponMask
