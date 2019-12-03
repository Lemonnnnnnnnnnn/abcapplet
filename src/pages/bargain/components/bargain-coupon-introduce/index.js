import Taro, { Component } from '@tarojs/taro';
import { View,  Text } from '@tarojs/components';
import { AtDivider } from 'taro-ui'

import Board from '@components/board'
import BaseComponent from '@components/base'

export default class BargainCouponIntroduce extends BaseComponent {
  static defaultProps = {
    coupon: { content: '' }
  }

  render() {
    const { coupon: { content } } = this.props
    return (
      <Board className='ml-3 mr-3 mt-3  bargain-coupon-introduce position-relative' customStyle={{ width: 'auto' }}>
        <View className='p-3'>
          <View className='text-large text-bold ml-2'>使用说明</View>
          <AtDivider height='50' color='#E1E1E1' />
          <Text className='mt-2 text-gray--2 text-small'>{content}</Text>
        </View>
      </Board>
    )
  }
}
