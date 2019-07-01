// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

// NPM 包
import day from 'dayjs'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ORDER_SHOW } from '@constants/page'
import { ORDER_STATUS_DIST } from '@constants/order'

import {
  LOCALE_RENT,
  LOCALE_CONTACT,
  LOCALE_ORDER_NO,
  LOCALE_SIGN_INFO,
  LOCALE_RISK_FUND,
  LOCALE_ORDER_TIME,
  LOCALE_DOWN_PAYMENT,
  LOCALE_ORDER_MOBILE,
  LOCALE_ORDER_ID_CARD,
  LOCALE_ORDER_USERNAME,
  LOCALE_ORDER_APARTMENT,
  LOCALE_SHOW_DOWN_PAYMENT_RULE,
} from '@constants/locale'


class OrderDesc extends BaseComponent {
  static defaultProps = {
    order: {}
  }

  onNavigation() {
    const { order: { id } } = this.props
    Taro.navigateTo({ url: `${PAGE_ORDER_SHOW}?id=${id}` })
  }

  render() {
    const { order, className } = this.props
    const {
      name,
      price,
      mobile,
      status,
      room_no: roomNo,
      id_code: idCode,
      order_no: orderNo,
      sign_time: signTime,
      risk_price: riskPrice,
      amount_total: amountTotal,
      apartment_title: apartmentTitle,
    } = order

    const { message } =
      ORDER_STATUS_DIST[status]
      || { message: '', isLight: false }

    return (
      <View className={className}>
        {/* 预定信息头部 */}
        <View className='my-2 at-row at-row__justify--between at-row__align--center' >
          <View className='text-bold'>{LOCALE_SIGN_INFO}</View>
          <View>
            <View className='at-row at-row__align--center'>
              <Button className='at-row btn-none p-0 text-small' open-type='contact' type='none'>
                <ABCIcon icon='headset_mic' color={COLOR_GREY_2} size='20' />
                <View className='text-secondary ml-2'>{LOCALE_CONTACT}</View>
              </Button>
            </View>
          </View>
        </View >

        {/* 预定信息 */}
        <Board className='text-normal'>
          <View style={{ position: 'relative' }}>
            <View className='btn-order-status'>{message}</View>
            <View className='mx-3 py-3'>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_TIME}</View>
                <View>{day.unix(signTime).format('YYYY年MM月DD日')}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_NO}</View>
                <View>{orderNo}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_USERNAME}</View>
                <View>{name}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_MOBILE}</View>
                <View>{mobile}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_ID_CARD}</View>
                <View>{idCode}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_RISK_FUND}</View>
                <View>{riskPrice}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_ORDER_APARTMENT}</View>
                <View>{apartmentTitle}{roomNo}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_RENT}</View>
                <View>{price}</View>
              </View>
              <View className='at-row mb-3'>
                <View className='text-secondary at-col-3'>{LOCALE_DOWN_PAYMENT}</View>
                <View>{amountTotal}</View>
              </View>

              <View className='at-row at-row__justify--center at-row__align--center'>
                <View className='text-small text-secondary'>{LOCALE_SHOW_DOWN_PAYMENT_RULE}</View>
                <ABCIcon icon='chevron_right' size='20' color={COLOR_GREY_2} />
              </View>
            </View>
          </View>
        </Board>
      </View>
    )
  }
}

export default OrderDesc
