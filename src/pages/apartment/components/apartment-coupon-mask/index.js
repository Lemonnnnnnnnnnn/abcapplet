/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
import BaseComponent from '@components/base'
import CouponList from '@components/coupon-list'
import loginButton from '@components/login-button'

// 自定义常量
import { PAYLOAD_COUPON_LIST } from '@constants/api'
import { LOCALE_ORDER_RENTAL_COUPON } from '@constants/locale'

// redux相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

@connect(state => state, {
  ...apartmentActions,
})

class ApartmentCouponMask extends BaseComponent {

  static defaultProps = {
    show: false,
    apartment_id: 0,
  }

  CouponList = node => this.CouponListRef = node

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  onBottomOut() {
    this.CouponListRef.onNextPage()
  }

  onListRefresh() {
    this.CouponListRef.onReset(null)
  }

  render() {
    const { show, onClose, apartmentCouponList, apartment_id, houseType_id, cityId: city_id } = this.props
    const { list } = apartmentCouponList

    return (
      show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
        <Board fixed='bottom' border='top'>
          <AtIcon onClick={onClose} value='close' size='15' className='p-2 mr-1 mt-1' color='#888' style='position : absolute ; right : 0'></AtIcon>
          <View className='text-huge  mt-2 text-center pb-2'> {LOCALE_ORDER_RENTAL_COUPON}</View>
          <ScrollView style={{ height: Taro.pxTransform(list && list.length && 750) }} scrollY onScrollToLower={this.onBottomOut}>

            <CouponList
              block='apartment'
              couponList={list}
              ref={this.CouponList}
              params={this.props.params}
              onListRefresh={this.onListRefresh}
              houseType_id={houseType_id}
              apartment_id={apartment_id}

              defaultPayload={{ ...PAYLOAD_COUPON_LIST, apartment_id, city_id }}
              dispatchList={this.props.dispatchCouponListPost}
              dispatchNextPageList={this.props.dispatchNextPageCouponListPost}
            />
          </ScrollView>

          {list && !list.length && <View className='mt-2 text-secondary text-center text-large p-4'>暂无可领取优惠券</View>}

          <View style={{ height: Taro.pxTransform(170) }}></View>
        </Board>
        <Masks show={show} />

      </View>

    )
  }
}

export default ApartmentCouponMask
