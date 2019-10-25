import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义变量
import { PAGE_USER_AUTH, PAGE_EXTERNAL_COUPON_RECEIVE,PAGE_HOME } from '@constants/page'
import {
  LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT,
  LOCALE_UNIVERSAL_COUPON,
  LOCALE_VOUCHER,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM,
  LOCALE_COLON,
  LOCALE_UNLIMITED,
  LOCALE_RENT_DATE,
  LOCALE_MONTH,
  LOCALE_FIRST_MONTH_ONLY,
  LOCALE_HIGHEST_RECEIVE,
  LOCALE_UNLIMITED_TIMES,
  LOCALE_TIMES
} from '@constants/locale'


import '../../styles/_page.scss'
import '../../styles/_board.scss'

@connect(state => state, {
  ...userActions,
  ...apartmentActions
})

class ExternalIndex extends BaseComponent {
  config = {
    navigationBarTitleText: '优惠券领取',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  componentWillMount() {
    const { id } = this.$router.params
    // let id = 7
    this.props.dispatchCouponAlone({ id }).then(({ data: { data } }) => {
      this.setState({
        worth: data.worth,
        type: data.type,
        coupon_type: data.coupon_type,
        use_type: data.use_type,
        apartment_title: data.apartment_title,
        apartment_type: data.apartment_type,
        validity_period : data.validity_period,
        apartment_no: data.apartment_no,
        apartment_room_id: data.apartment_room_id,
        period_time: data.period_time,
        id: data.id,
        max_receive_num: data.max_receive_num
      })
    })
  }

  onCouponReceive(id) {
    Taro.getStorageSync('user_info').token ?

      this.props.dispatchCouponReceive({ id }).then(res => {
        res.data.code === 1 && (
          setTimeout(() => {
            Taro.showToast({ title: res.data.msg, icon: 'none' })
          }, 20),
          setTimeout(() => {
            Taro.switchTab({url : PAGE_HOME})
          }, 1000)
        )
      })
      :
      (Taro.setStorageSync('lastPagePath', PAGE_EXTERNAL_COUPON_RECEIVE + '?id=' + id),
        Taro.redirectTo({ url: PAGE_USER_AUTH })
      )
  }

  render() {
    const { worth, type, coupon_type, use_type, apartment_title, apartment_type, apartment_no,
      id, max_receive_num, validity_period, period_time } = this.state

    let [ couponName, worthText] =['', '']

    // 券类
    type === 1 ? couponName = LOCALE_UNIVERSAL_COUPON : couponName = apartment_title + LOCALE_VOUCHER
    // 价格
    if (coupon_type === 1) {
      worthText = worth * 100
      worthText = worthText.toString()
      if (worthText[worthText.length - 1] === '0') {
        worthText = worthText[0]
      }
    } else {
      worthText = parseFloat(worth)
    }

    return (
      <View className='page-orange'>
        {/* 白色纸条 */}
        <View className='vertical-level-center coupon_receive board--all board--wrap board' style={{ top: Taro.pxTransform(550) }}>

          <View className='p-3 position-relative' >
            {/* 金额 + 券名 + 房间号 +户型 */}
            <View className='board--all board--pink at-row  at-row__justify--center at-row__align--center' >
              <View>
                {/* 金额 */}
                <View className='at-row  at-row__justify--center at-row__align--center text-bold'>
                  {coupon_type === 2 && <View style={{ fontSize: Taro.pxTransform(31 * 2) }} className='mt-4' >{LOCALE_PRICE_SEMICOLON}</View>}
                  <View style={{ fontSize: Taro.pxTransform(70 * 2) }}>{worthText}</View>
                  {coupon_type === 1 && <View style={{ fontSize: Taro.pxTransform(60 * 2) }} className='mt-2'>{LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT}</View>}
                </View>
                {/* 券名 */}
                <View className='text-center text-large mt-1 text-bold'>{couponName}</View>
                {/* 房间号 + 户型 */}
                <View className='text-center'>
                  {apartment_type && <Text className='text-normal'>{apartment_type} </Text>}
                  {apartment_no && <Text className='ml-1 text-normal'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON + apartment_no}</Text>}
                </View>
              </View>

            </View>
            {/* 分隔符 */}
            <View className='text-huge page-middile line-dotted' >-----------------------------------------------------</View>
            {/* 条件 */}
            <View className='text-normal'>
              <View className='text-normal mt-1 ml-4' style={{ color: '#353535' }}>
                {period_time && <View className='mt-1'>{period_time}</View>}
                {validity_period && <View className='mt-1'>{LOCALE_RENT_DATE + LOCALE_COLON}{validity_period === -1 ? LOCALE_UNLIMITED : validity_period + LOCALE_MONTH}</View>}
                {use_type === 1 && <View className='mt-1'>{LOCALE_FIRST_MONTH_ONLY}</View>}

              </View>
            </View>

            {/* 按钮 */}
            <View className='mt-4 text-bold'>
              <AtButton
                circle
                className='btn-yellow active'
                onClick={this.onCouponReceive.bind(this, id)}
              >{Taro.getStorageSync('user_info').token ? '领取' : '登录领取'}</AtButton>
            </View>

            {max_receive_num && <View className='mt-2 text-normal text-center text-secondary'>领取次数{max_receive_num === -1 ? LOCALE_UNLIMITED_TIMES : max_receive_num + LOCALE_TIMES}</View>}
          </View>
          {/* 两个圆角 */}
          <View className='coupon-angel left'></View>
          <View className='coupon-angel right'></View>
        </View>

      </View>
    )
  }
}

export default ExternalIndex
