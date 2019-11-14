import Taro, { Component } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';

import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_PRICE_SEMICOLON, LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT } from '@constants/locale'

export default class BargainCouponCard extends BaseComponent {
  static defaultProps = {
    coupon: { worth: '', coupon_type: 0 },
    price: '',
    apartment_title: '',
    apartment_type_title: '',
    no: ''
  }

  render() {
    const { coupon: { worth, coupon_type }, price, apartment_title, apartment_type_title, no, cover } = this.props
    let worthText = ''

    const imageStyle = {
      width: Taro.pxTransform(97 * 2),
      height: Taro.pxTransform(65 * 2),
      borderRadius: Taro.pxTransform(6 * 2)
    }

    // 价格
    if (coupon_type === 1) {
      worthText = worth * 100
      worthText = worthText.toString()
      if (worthText[worthText.length - 1] === '0') {
        worthText = worthText[0]
      }
    } else {
      worthText = parseFloat(worth) || 0
    }


    return (
      <Board className='ml-3 mr-3  bargain-coupon-card position-relative' customStyle={{ width: 'auto' }}>
        <View className='p-3 at-row' style={{ width: 'auto' }}>
          {/* 左 */}
          <View className='at-col at-col-5 leftPart'>
            <View style={imageStyle} className='wrap-Style'>
              <Image className='inherit-Height inherit-Width' src={cover} mode='scaleToFill'></Image>
            </View>
            <View className='text-small text-bold'>{apartment_title}</View>
            <View className='text-small text-secondary'>
              {apartment_type_title && <Text className='text-gray--2 ml-2'>{apartment_type_title}</Text>}
              {no && <Text className='ml-2'>-{no}</Text>}
            </View>
            <View className='at-row text-small'>
              <Text className='text-secondary'>砍价后：</Text>
              <Text className='text-orange text-normal text-bold'>￥{parseInt(price)}/月</Text>
            </View>
          </View>

          {/* 右 */}
          <View className='at-col at-col-7 at-col--wrap'>
            <View className='text-orange text-bold at-row at-row__justify--center at-row__align--center inherit-Height' >
              <View className='ar-row at-row__align--end'>
                {coupon_type === 2 && <Text className='text-super'>{LOCALE_PRICE_SEMICOLON}</Text>}
                <Text style={{ fontSize: Taro.pxTransform(58 * 2) }}>{parseInt(worthText)}</Text>
                {coupon_type === 1 && <Text className='mt-2' style={{ fontSize: Taro.pxTransform(43 * 2) }}>{LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT}</Text>}
              </View>

            </View>
          </View>
        </View>
        {/* 缺角 */}
        <View className='top bargain-coupon-card-angle'></View>
        <View className='bottom bargain-coupon-card-angle'></View>
        {/* 代金券 */}
        <View className='bargain-coupon-card-ribbon text-center text-white text-small'>代金券</View>
      </Board>
    )
  }
}
