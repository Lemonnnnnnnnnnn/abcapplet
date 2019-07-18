// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Board from '@components/board'
import ABCIcon from '@components/abc-icon'
import Decorate from '@components/decorate'

// 自定义变量
import { COLOR_YELLOW } from '@constants/styles'
import { LOCALE_DOWN_PAYMENT_RULE } from '@constants/locale'

class OrderDownPayment extends Component {
  config = {
    navigationBarTitleText: '定金协议',
    navigationBarBackgroundColor: '#FFC919',
  }

  render() {
    return (
      <View className='px-3'>
        {/* 背景底色 */}
      </View>
    )
  }
}

export default OrderDownPayment
