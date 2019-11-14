import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtDivider } from 'taro-ui'

import Board from '@components/board'
import BaseComponent from '@components/base'

export default class BargainCouponIntroduce extends BaseComponent {

  render() {
    const text = [
      '1.支付完成后获得代金券并锁定活动房源。',
      '2.支付完成后请于2个工作日内前往公寓签约，签约时请向公寓方初始券码核销。',
      '3.金券可直接替代相应额度房租。',
      '4.若3个工作日内没有签约，视为自动放弃获得资格，活动资格将顺延至下一名砍价成功者。已支付金额将原路退回，代金券自动失效。'
    ]
    return (
      <Board className='ml-3 mr-3 mt-3  bargain-coupon-introduce position-relative' customStyle={{ width: 'auto' }}>
        <View className='p-3'>
          <View className='text-large text-bold ml-2'>使用说明</View>
          <AtDivider height='50' color='#E1E1E1' />
          {
            text.map(i => <View key={i} className='mt-2 text-gray--2 text-small'>{i}</View>)
          }
        </View>
      </Board>
    )
  }
}
