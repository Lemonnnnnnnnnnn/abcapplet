// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Board from '@components/board'
import ABCIcon from '@components/abc-icon'
import Decorate from '@components/decorate'

// 自定义变量
import { COLOR_YELLOW } from '@constants/styles'
import {
  LOCALE_AGREEMENT_NAME,
  LOCALE_AGREEMENT_INTRODUCE,
  LOCALE_AGREEMENT_TITLE,
  LOCALE_AGREEMENT_CONTENT,
  LOCALE_DISCLAIMER,
  LOCALE_DISCLAIMER_CONTENT
} from '@constants/locale'


class OrderDownPayment extends Component {
  config = {
    navigationBarTitleText: '定金协议',
    navigationBarBackgroundColor: '#FFC919',
  }

  render() {
    return (
      <View className='px-3 pl-4 pr-4' >
        {/* 背景底色 */}
        <View style='text-align:center' className='mt-3 mb-3 text-large text-bold '>{LOCALE_AGREEMENT_NAME}</View>
        <View style='text-indent:1.4Rem' className='text-normal'>{LOCALE_AGREEMENT_INTRODUCE}</View>
        <View className='text-normal text-bold '>{LOCALE_AGREEMENT_TITLE}</View>
        {
          LOCALE_AGREEMENT_CONTENT.map((value, index) => (
            <View key={index}>
              <View className='text-normal text-bold'>{value.title}</View>
              <View className='text-normal '>
                {
                  value.content.map((v, i) => (
                    <View key={i}>
                      <View className='text-normal'>{v.title}</View>
                      <View className='text-normal'>{v.content}</View>
                    </View>
                  ))
                }
              </View>
            </View>
          ))
        }
        <View className='text-normal text-bold '>{LOCALE_DISCLAIMER}</View>
        {
          LOCALE_DISCLAIMER_CONTENT.map((value, index) => (
            <View key={index}>
              <View className='text-normal text-bold'>{value.title}</View>
              <View className='text-normal '>
                {
                  value.content.map((v, i) => (
                    <View key={i}>
                      <View className='text-normal'>{v.title}</View>
                      <View className='text-normal'>{v.content}</View>
                    </View>
                  ))
                }
              </View>
            </View>
          ))
        }

      </View>
    )
  }
}

export default OrderDownPayment
