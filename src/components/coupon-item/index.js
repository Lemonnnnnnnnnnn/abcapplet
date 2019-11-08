/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// npm包
import classNames from 'classnames'

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
import { PAGE_USER_AUTH, PAGE_APPOINTMENT_CREATE } from '@constants/page'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

@connect(state => state, {
  ...apartmentActions,
})
class CouponItem extends BaseComponent {
  static defaultProps = {
    coupon: {}
  }

  // 优惠券领取
  onCouponReceive(id) {
    // 判断登录状态 如果用户没有登录，优先执行跳转操作，引导用户登录
    if (!Taro.getStorageSync('user_info').token) {
      const { params } = this.props
      let index = 0
      const lastPage = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1]
      let lastPagePath = '/' + lastPage.route

      for (var i in params) {
        index += 1
        index === 1 ? lastPagePath += '?' + i + '=' + params[i] : lastPagePath += '&' + i + '=' + params[i]
      }

      Taro.setStorageSync('lastPagePath', lastPagePath)
      Taro.navigateTo({ url: PAGE_USER_AUTH })
      return
    }

    const { coupon: { receive_reason, can_receive, receive_type }, houseType_id, apartment_id } = this.props
    // 如果状态为可领取，发送请求，请求成功提示服务器传回的信息
    if (can_receive) {
      switch (receive_type) {
        case 0: {
          this.props.dispatchCouponReceive({ id: id }).then((res) => {
            res.data.code === 1 && (
              this.props.onListRefresh(),
              setTimeout(() => {
                Taro.showToast({ title: res.data.msg, icon: 'none' })
              }, 1000)
            )
          })
        } break
        case 2: {
          Taro.navigateTo({ url: `${PAGE_APPOINTMENT_CREATE}?id=${houseType_id}&apartmentId=${apartment_id}` })
        } break
      }
    } else {
      Taro.showToast({ title: receive_reason, icon: 'none' })
    }

  }

  // order页面的选择优惠券，把信息传回上级页面
  onSelectCoupon(id, price, canChoise) {
    canChoise ? this.props.onSelectCoupon(id, price)
      : Taro.showToast({ title: '此优惠券不可叠加使用哦', icon: 'none' })
  }

  render() {
    const { coupon, block, status, className } = this.props

    const { worth, type, coupon_type, use_type, apartment_title, apartment_type, apartment_no, share_url, share_title, share_img, receive_type,
      id, can_receive, max_receive_num, validity_period, period_time, end_time, condition_period, active, canChoise, coupon_link_title } = coupon

    // 对后台传过来的数值进行判断再赋值

    let [statusText, couponName, worthText, couponPrice, backgroundColor, textColorGlobal, textColorPrice, textColorName, textColorStaus, shareIf] =
      ['', '', '', '', '', '', '', '', '', false]

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

    // 对三种不同外观的优惠券样式进行class赋值和状态赋值
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

        textColorGlobal = canChoise ? 'text-secondary' : 'text-gray--1'
        textColorPrice = canChoise && 'text-yellow'
        textColorName = canChoise && 'text-black'
        textColorStaus = canChoise || !Taro.getStorageSync('user_info').token ? 'text-yellow' : 'text-gary'
      } break
      case 'apartment': {
        // 判断五种状态  请先登录 领取 分享领取 预约领取 无法领取
        if (!Taro.getStorageSync('user_info').token) statusText = LOCALE_LOGIN_RECEIVE
        else if (!can_receive) statusText = LOCALE_RECEIVE_CANT
        else if (can_receive) {
          switch (receive_type) {
            case 0: { statusText = LOCALE_RECEIVE } break
            case 1: {
              statusText = '分享发放'
              shareIf = true
            } break
            case 2: { statusText = '预约发放' } break
          }
        }

        textColorGlobal = can_receive ? 'text-secondary' : 'text-gray--1'
        textColorPrice = can_receive && 'text-yellow'
        textColorName = can_receive && 'text-black'
        textColorStaus = can_receive || !Taro.getStorageSync('user_info').token ? 'text-yellow' : 'text-gary'

      } break
    }

    // 订单优惠券
    const couponOrder =
      <View
        className={`${active ? 'shadow-yellow' : 'shadow-black'} background-white coupon-item  mt-2 `}
        onClick={this.onSelectCoupon.bind(this, id, couponPrice, canChoise)}
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
          {/* 中 券类 户型房间 叠加title 有效期 租期*/}
          <View className=' inherit-Height ' style={{ borderRight: '1px dashed #EEEEEE', width: '40%' }}>
            <View className='at-row at-row__align--center inherit-Height' >
              <View>
                <View className={`${textColorName} text-small text-bold`}>{couponName}</View>
                <View className={`${textColorName} text-mini `} >
                  {apartment_type && <Text>{apartment_type} </Text>}
                  {apartment_no && <Text className='ml-1'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON + apartment_no}</Text>}
                </View>
                {coupon_link_title && <View className='text-mini'>{coupon_link_title}</View>}
                <View className='text-mini'>{period_time || end_time}</View>
                {condition_period && <View className='text-mini'>{LOCALE_RENT_DATE + LOCALE_COLON}{validity_period === -1 ? LOCALE_UNLIMITED : condition_period + LOCALE_MONTH}</View>}
              </View>
            </View>
          </View>
          {/* 右 减免类型 状态文本*/}
          <View className='text-normal ' style={{ width: '30%' }}>
            <View className=' at-row at-row__justify--center at-row__align--center inherit-Height' >
              <View>
                <View className='at-row at-row__justify--center at-row__align--center'>
                  <View className={textColorStaus}>{statusText}</View>
                </View>
                <View className='text-mini text-center'>{use_type === 1 ? LOCALE_FIRST_MONTH_ONLY : '仅租金可用'}</View>
              </View>
            </View>
          </View>
        </View>
        {/* 两个缺角 */}
        <View className={`${active && 'top-active'} top coupon-item-angle `} ></View>
        <View className={`${active && 'bottom-active'} bottom coupon-item-angle `} ></View>
      </View>

    // 公寓优惠券
    const couponApartment =
      <View className='background-white shadow-black coupon-item  mt-2' >
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
          <View className=' inherit-Height' style={{ borderRight: '1px dashed #EEEEEE', width: '40%' }}>
            <View className='at-row at-row__align--center inherit-Height' >
              <View>
                <View className={`${textColorName} text-small text-bold`}>{couponName}</View>
                <View className={`${textColorName} text-mini `}>
                  {apartment_type && <Text>{apartment_type} </Text>}
                  {apartment_no && <Text className='ml-1'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON + apartment_no}</Text>}
                </View>
                {coupon_link_title && <View className='text-mini'>{coupon_link_title}</View>}
                <View className='text-mini'>{period_time || end_time}</View>
                {condition_period && <View className='text-mini'>{LOCALE_RENT_DATE + LOCALE_COLON}{validity_period === -1 ? LOCALE_UNLIMITED : condition_period + LOCALE_MONTH}</View>}
              </View>
            </View>
          </View>
          {/* 右 减免类型 状态文本*/}
          <View className='text-normal ' onClick={this.onCouponReceive.bind(this, id)} style={{ width: '30%' }}>
            <View className=' at-row at-row__justify--center at-row__align--center inherit-Height' >
              <View>
                <View className='at-row at-row__justify--center at-row__align--center'>
                  {shareIf ?
                    <Button
                      data-share_title={share_title}
                      data-share_img={share_img}
                      data-url={share_url}
                      data-id={id}
                      open-type='share'
                      className={textColorStaus}
                    >{statusText}</Button> :
                    <View className={`${textColorStaus}`}>{statusText}</View>}

                  {!can_receive && <AtIcon value='help' size='14' color='#88888'></AtIcon>}
                </View>
                <View className='text-mini text-center'>{use_type === 1 ? LOCALE_FIRST_MONTH_ONLY : '仅租金可用'}</View>
                {max_receive_num && <View className='text-mini text-center'>{LOCALE_HIGHEST_RECEIVE}{max_receive_num === -1 ? LOCALE_UNLIMITED_TIMES : max_receive_num + LOCALE_TIMES}</View>}
              </View>

            </View>
          </View>
        </View>
        {/* 两个缺角 */}
        <View className='top coupon-item-angle'></View>
        <View className='bottom coupon-item-angle'></View>
      </View>

    // 用户优惠券
    const couponUser =
      <View className={`${backgroundColor} shadow-black coupon-item  mt-2 `} >
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
          <View className=' inherit-Height' style={{ borderRight: '1px dashed #EEEEEE', width: '40%' }}>
            <View className='at-row at-row__align--center inherit-Height' >
              <View>
                <View className={`${textColorName} text-small text-bold`}>{couponName}</View>
                <View className={`${textColorName} text-mini `}>
                  {apartment_type && <Text>{apartment_type} </Text>}
                  {apartment_no && <Text className='ml-1'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON + apartment_no}</Text>}
                </View>
                {coupon_link_title && <View className='text-mini'>{coupon_link_title}</View>}
                <View className='text-mini'>{period_time || end_time}</View>
                {condition_period && <View className='text-mini'>{LOCALE_RENT_DATE + LOCALE_COLON}{validity_period === -1 ? LOCALE_UNLIMITED : condition_period + LOCALE_MONTH}</View>}
              </View>
            </View>
          </View>
          {/* 右 减免类型 状态文本*/}
          <View className='text-normal' style={{ width: '30%' }}>
            <View className=' at-row at-row__justify--center at-row__align--center inherit-Height' >
              <View>
                <View className='at-row at-row__justify--center at-row__align--center'>
                  <View className={`${textColorStaus}`}>{statusText}</View>
                </View>
                <View className='text-mini text-center'>{use_type === 1 ? LOCALE_FIRST_MONTH_ONLY : '仅租金可用'}</View>
              </View>

            </View>
          </View>
        </View>
        {/* 两个缺角 */}
        <View className='top coupon-item-angle'></View>
        <View className='bottom coupon-item-angle'></View>
      </View>

    // 迷你tag
    const couponMini =
      <View className={classNames('coupon-item-mini', 'position-relative', className)}>
        <View className='vertical-level-center text-small text-white'>
          {coupon_type === 2 && <Text >{LOCALE_PRICE_SEMICOLON}</Text>}
          <Text >{worthText}</Text>
          {coupon_type === 1 && <Text >{LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT}</Text>}
        </View>
        <View className='left vertical-center coupon-item-mini-angle' ></View>
        <View className='left vertical-center square-cover'></View>
        <View className='right vertical-center coupon-item-mini-angle'></View>
        <View className='right vertical-center square-cover'></View>
      </View>

    return <View>
      {block === 'order' && couponOrder}
      {block === 'apartment' && couponApartment}
      {block === 'user' && couponUser}
      {block === 'mini' && couponMini}
    </View>


  }
}

export default CouponItem
