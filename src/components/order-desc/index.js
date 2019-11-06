// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button, Image, Text } from '@tarojs/components'
import { AtDivider } from 'taro-ui'

// NPM 包
import day from 'dayjs'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ORDER_DOWN_PAYMENT, PAGE_ORDER_DEPOSIT_BAR } from '@constants/page'
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
  LOCALE_DOWN_PAYMENT_REAL,
  LOCALE_SHOW_DOWN_PAYMENT_RULE,
  LOCALE_DOWN_PAYMENT_RATIO,
  LOCALE_PRICE_SEMICOLON,
} from '@constants/locale'

import { CREATE_ORDER_DIST } from '@constants/dist'

import '../../styles/_text.scss'


class OrderDesc extends BaseComponent {
  static defaultProps = {
    order: {}
  }

  onNavigation() {
    Taro.navigateTo({ url: PAGE_ORDER_DOWN_PAYMENT })
  }
  onNaviDeposit() {
    const { detailId, order } = this.props
    const {
      room_no: roomNo,
    } = order
    Taro.navigateTo({ url: PAGE_ORDER_DEPOSIT_BAR + '?id=' + detailId + '&roomId=' + roomNo })
  }

  render() {
    const { order, className } = this.props
    const {
      name,
      price,
      old_amount_total,
      amount_total,
      old_price,
      coupon_price,

      paid,
      mobile,
      status,
      // room_no: roomNo,
      apartment_room_id,
      id_code: idCode,
      order_no: orderNo,
      sign_time: signTime,
      risk_price: riskPrice,
      apartment_title: apartmentTitle,
    } = order

    const { message } =
      ORDER_STATUS_DIST[status]
      || { message: '', isLight: false }

    const depositBarStyle = {
      background: '#fff',
      borderRadius: Taro.pxTransform(24),
    }

    const arr = [
      { title: '订单号：', message: [orderNo] },
      { title: '预定公寓：', message: [apartmentTitle + '  '+ apartment_room_id + '间'] },
      { title: '签约时间：', message: [day.unix(signTime).format('YYYY年MM月DD日')] },
      { title: '预定人：', message: [name, mobile, idCode] },
      { title: '风险金：', message: [riskPrice] },
    ]

    // 生成供渲染的价格列表，计算减去优惠券后的租金，如果没有租金减免不渲染这一条
    let [priceList, rentPriceCutOff, renderPriceCutOff] = [[], price, false]

    for (let i in coupon_price) {
      priceList.push({ ...CREATE_ORDER_DIST[i], num: coupon_price[i] })
    }

    priceList.forEach(i => {
      if (i.type === 1) {
        rentPriceCutOff -= i.num
        renderPriceCutOff = true
      }
    })

    return (
      <View className={className}>
        {/* 预订信息头部 */}
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

        {/* 预订信息 */}
        <Board className='text-normal'>
          <View style={{ position: 'relative' }}>
            <View className='btn-order-status'>{message}</View>
            <View className='mx-3 py-3'>

              {
                arr.map(i => <View className='at-row mb-3' key={i.title}>
                  <Text className='text-secondary at-col at-col-3'>{i.title}</Text>
                  <View className='at-col at-col-6 text-wrap'>
                    {i.message.map(j => <View key={j}>{j}</View>)}
                  </View>
                </View>)
              }

              <View className='at-row at-row__justify--center at-row__align--center' onClick={this.onNavigation}>
                <View className='text-small text-secondary'>{LOCALE_SHOW_DOWN_PAYMENT_RULE}</View>
                <ABCIcon icon='chevron_right' size='20' color={COLOR_GREY_2} />
              </View>
            </View>
          </View>
        </Board>
        {/* 价格相关 */}
        <View className='mx-2 '>
          {/* 租金 */}
          <View className='mb-2 text-normal text-secondary'>
            <View className='at-row at-row__align--start at-row__justify--between'>
              <View>租金：</View>
              <View>￥{old_price}</View>
            </View>
            {/* 租金优惠明细 */}
            {
              priceList.map(i => i.type === 1 && <View className='at-row at-row__align--start at-row__justify--between' key={i.id}>
                <View>{i.Chinese}</View>
                <View>-￥{i.num}</View>
              </View>)
            }
            {/* 减去优惠金额后的租金 */}
            {
              renderPriceCutOff && <View className='at-row at-row__align--start at-row__justify--end text-black' >优惠后租金：{price}</View>
            }
          </View>

          {/* 定金：减去优惠金额后的租金 除以2 */}
          <View className='text-normal text-secondary'>
            <View className='at-row at-row__align--start at-row__justify--between'>
              <View>定金(租金50%)：</View>
              <View>￥{old_amount_total}</View>
            </View>
            {/* 定金减免 */}
            {
              priceList.map(i => i.type === 2 && <View className='at-row at-row__align--start at-row__justify--between' key={i.id}>
                <View>{i.Chinese}</View>
                <View>-￥{i.num}</View>
              </View>)
            }
          </View>

          {/* 分割线 */}
          <AtDivider height='25' />

          {/* 定金实付款 */}
          <View className='my-2'>
            <View className='at-row at-row__align--start at-row__justify--between '>
              <View>
                <View className='text-brand text-large text-bold'>{LOCALE_DOWN_PAYMENT_REAL}</View>
              </View>
              <View className='text-brand text-super text-bold' >{LOCALE_PRICE_SEMICOLON}{amount_total}</View>
            </View>
          </View>

        </View>


        {
          status === 3 && paid === 1 &&
          <View
            style={depositBarStyle}
            onClick={this.onNaviDeposit}
            className='mt-2 py-2 at-row at-row__justify--center at-row__align--center text-normal' >
            <Image className='mr-2' src='https://images.gongyuabc.com/image/deposit-bar.png' style={{ width: Taro.pxTransform(34), height: Taro.pxTransform(38) }}></Image>
            定金凭证
            </View>
        }

      </View>
    )
  }
}

export default OrderDesc
