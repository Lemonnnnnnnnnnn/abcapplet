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
        <Decorate height='100' />

        <Board className='p-3 mt-3'>
          <View className='at-row at-row__justify--center'>
            <ABCIcon icon='event_note' color={COLOR_YELLOW} size='40' />
          </View>

          <View className='at-row at-row__justify--center text-small mt-1 mb-3'>
            {LOCALE_DOWN_PAYMENT_RULE}
          </View>

          <View className='text-normal pt-3  border-top'>
            还没有相应接口和文本~
          </View>
          <View className='text-normal pt-3'>
            只能打段话来测试测试了~
          </View>
          <View className='text-normal pt-3'>
            这里是吃饭睡觉打豆豆中心~
          </View>
          <View className='text-normal pt-3'>
            AV8D 举起你们的双手和我一起摇~
          </View>
        </Board>
      </View>
    )
  }
}

export default OrderDownPayment
