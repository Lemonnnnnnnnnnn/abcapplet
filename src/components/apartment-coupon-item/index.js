/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { ORDER_COUPON_DIST } from '@constants/apartment'
import { USER_COUPON_DIST } from '@constants/user'
import {
  LOCALE_RECEIVE,
  LOCALE_RECEIVE_CANT,
  LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT,
  LOCALE_UNIVERSAL_COUPON,
  LOCALE_VOUCHER,
  LOCALE_FIRST_MONTH_ONLY,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_COLON,
  LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM,
  LOCALE_UNLIMITED,
  LOCALE_MONTH,
  LOCALE_RENT_DATE,
  LOCALE_LOGIN_RECEIVE,
  LOCALE_UNLIMITED_TIMES,
  LOCALE_TIMES,
  LOCALE_HIGHEST_RECEIVE
} from '@constants/locale'
import { PAGE_USER_AUTH } from '@constants/page'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'


@connect(state => state, {
  ...apartmentActions,
})
class ApartmentCouponItem extends BaseComponent {
  static defaultProps = {
    coupon: {}
  }

  onCouponReceive(id) {
    // 判断登录状态 如果用户没有登录，优先执行跳转操作，引导用户登录
    const { params } = this.props
    let index = 0
    const lastPage = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1]
    let lastPagePath = '/' + lastPage.route

    for (var i in params) {
      index += 1
      index === 1 ? lastPagePath += '?' + i + '=' + params[i] : lastPagePath += '&' + i + '=' + params[i]
    }

    !Taro.getStorageSync('user_info').token && (
      Taro.setStorageSync('lastPagePath', lastPagePath),
      Taro.navigateTo({ url: PAGE_USER_AUTH })
    )

    const { coupon: { receive_reason }, can_receive, block } = this.props
    // 如果状态为可领取，发送请求，请求成功提示服务器传回的信息
    can_receive &&
      (
        this.props.dispatchCouponReceive({ id: id }).then((res) => {
          res.data.code === 1 && (
            this.props.onListRefresh(),
            setTimeout(() => {
              Taro.showToast({ title: res.data.msg, icon: 'none' })
            }, 200)
          )
        })
      )
    // 如果当前item所处板块为详情页，状态为不可领取，提示不可领取原因
    block === 'apartment' && !can_receive && Taro.showToast({ title: receive_reason, icon: 'none' })
  }

  // order页面的选择优惠券，把信息传回上级页面
  onSelectCoupon(id, price, block) {
    switch (block) {
      case 'order': this.props.onSelectCoupon(id, price)
    }
  }

  render() {
    const { coupon, block, status } = this.props

    const { worth, type, coupon_type, use_type, apartment_title, apartment_type, apartment_no,
      id, can_receive, max_receive_num, validity_period, period_time, is_select ,end_time } = coupon

    // 对后台传过来的数值进行判断再赋值

    let [statusText, couponName, worthText, couponPrice, backgroundColor, textColorGlobal, textColorPrice, textColorName, textColorStaus] =
      ['', '', '', '', '', '', '', '', '']

    // 券类
    type === 1 ? couponName = LOCALE_UNIVERSAL_COUPON : couponName = apartment_title + LOCALE_VOUCHER
    // 价格
    if (coupon_type === 1) {
      worthText = worth * 100
      worthText = worthText.toString()
      if (worthText[worthText.length - 1] === '0') {
        worthText = worthText[0]
      }
      couponPrice = worthText + LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT
    } else {
      worthText = parseFloat(worth)
      couponPrice = LOCALE_PRICE_SEMICOLON + worthText
    }


    // 对三种不同外观的优惠券样式进行class赋值
    switch (block) {
      case 'user': {
        statusText = status !== undefined && USER_COUPON_DIST[status].title
        backgroundColor = status === 2 ? 'background-gray' : 'background-white'
        textColorGlobal = status === 2 ? 'text-white' : 'text-secondary'
        textColorPrice = status !== 2 && 'text-yellow'
        textColorName = status !== 2 && 'text-black'
        textColorStaus = status !== 2 && 'text-yellow'
      } break
      case 'order': {
        statusText = status !== undefined && ORDER_COUPON_DIST[status].message
        backgroundColor = 'background-white'
        textColorGlobal = 'text-secondary'
        textColorPrice = 'text-yellow'
        textColorName = 'text-black'
        textColorStaus = 'text-yellow'
      } break
      case 'apartment': {
        statusText = can_receive ? LOCALE_RECEIVE : LOCALE_RECEIVE_CANT
        statusText = !Taro.getStorageSync('user_info').token ? LOCALE_LOGIN_RECEIVE : statusText

        backgroundColor = 'background-white'
        textColorGlobal = can_receive ? 'text-secondary' : 'text-gray--1'
        textColorPrice = can_receive && 'text-yellow'
        textColorName = can_receive && 'text-black'
        textColorStaus = can_receive || !Taro.getStorageSync('user_info').token ? 'text-yellow' : 'text-gary'

      } break
    }

    return (
      <View
        className={`${backgroundColor} ${is_select ? 'shadow-yellow' : 'shadow-black'} apartment-coupon-item  mt-2 `}
        onClick={this.onSelectCoupon.bind(this, id, couponPrice, block)}
      >
        <View className={`${textColorGlobal} at-row inherit-Height `}  >
          {/* 左 价格 */}
          <View style={{ width: '30%' }} >
            <View className={`${textColorPrice} at-row at-row__justify--center at-row__align--center inherit-Height `} >
              {coupon_type === 2 && <View className='text-normal  page-middile mb-1' >{LOCALE_PRICE_SEMICOLON}</View>}
              <View className='text-bold  page-middile' style={{ fontSize: Taro.pxTransform(27 * 2) }}>{worthText}</View>
              {coupon_type === 1 && <View className='text-huge  page-middile mt-2'>{LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT}</View>}
            </View>
          </View>
          {/* 中 券类  有效期*/}
          <View className=' inherit-Height ' style={{ borderRight: '1px dashed #EEEEEE', width: '40%' }}>
            <View className='at-row at-row__align--center inherit-Height' >
              <View>
                <View className={`${textColorName} text-small text-bold`}>{couponName}</View>
                <View className={`${textColorName} text-mini `}>
                  {apartment_type && <Text>{apartment_type} </Text>}
                  {apartment_no && <Text className='ml-1'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON + apartment_no}</Text>}
                </View>
                <View className='text-mini'>{period_time || end_time}</View>
                {validity_period && <View className='text-mini'>{LOCALE_RENT_DATE + LOCALE_COLON}{validity_period === -1 ? LOCALE_UNLIMITED : validity_period + LOCALE_MONTH}</View>}
              </View>
            </View>
          </View>
          {/* 右 减免类型 状态文本*/}
          <View className='text-normal ' onClick={this.onCouponReceive.bind(this, id)} style={{ width: '30%' }}>
            <View className=' at-row at-row__justify--center at-row__align--center inherit-Height' >
              <View>
                <View className='at-row at-row__justify--center at-row__align--center'>
                  <View className={`${textColorStaus}`}>{statusText}</View>
                  {!can_receive && block === 'apartment' && <AtIcon value='help' size='14' color='#88888'></AtIcon>}
                </View>
                {use_type === 1 && <View className='text-mini text-center'>{LOCALE_FIRST_MONTH_ONLY}</View>}
                {max_receive_num && <View className='text-mini text-center'>{LOCALE_HIGHEST_RECEIVE}{max_receive_num === -1 ? LOCALE_UNLIMITED_TIMES : max_receive_num + LOCALE_TIMES}</View>}
              </View>

            </View>
          </View>
        </View>
        {/* 两个缺角 */}
        <View className={`${is_select && 'top-active'} top apartment-coupon-item-angle `} style={{ top: Taro.pxTransform(-6) }}></View>
        <View className={`${is_select && 'bottom-active'} bottom apartment-coupon-item-angle `} style={{ bottom: Taro.pxTransform(-6) }}></View>
      </View>

    )
  }
}

export default ApartmentCouponItem
