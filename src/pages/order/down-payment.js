// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义变量
import {
  LOCALE_AGREEMENT_NAME,
  LOCALE_AGREEMENT_INTRODUCE,
  LOCALE_AGREEMENT_TITLE,
  LOCALE_AGREEMENT_CONTENT,
  LOCALE_DISCLAIMER,
  LOCALE_DISCLAIMER_CONTENT,
  LOCALE_PROVACY_POLICY,
  LOCALE_PROVACY_POLICY_CONTENT
} from '@constants/locale'

import buryPoint from '../../utils/bury-point'

class OrderDownPayment extends Component {
  config = {
    navigationBarTitleText: '定金协议',
    navigationBarBackgroundColor: '#FFC919',
  }

  componentWillMount() {
    buryPoint()
  }

  render() {
    return (
      <View className='mb-5 px-3 pl-4 pr-4' >
        {/* 背景底色 */}
        <View style='text-align:center' className='mt-3 mb-3 text-large text-bold '>{LOCALE_AGREEMENT_NAME}</View>
        <View style='text-indent:1.4Rem' className='text-normal'>{LOCALE_AGREEMENT_INTRODUCE}</View>
        <View className='text-normal text-bold'  >{LOCALE_AGREEMENT_TITLE}</View>
        {
          LOCALE_AGREEMENT_CONTENT.map((value, index) => (
            <View key={index}>
              <View className='text-normal text-bold'>{value.title}</View>
              <View className='text-normal '>
                {
                  value.content.map((v, i) => (
                    <View style='line-height:20px' key={i}>{v}</View>
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
                    <View style='line-height:20px' key={i}>{v}</View>
                  ))
                }
              </View>
            </View>
          ))
        }
        <View className='text-normal text-bold '>{LOCALE_PROVACY_POLICY}</View>
        {
          LOCALE_PROVACY_POLICY_CONTENT.map((value, index) => (
            <View key={index}>
              <View className='text-normal text-bold'>{value.title}</View>
              <View className='text-normal '>
                {
                  value.content.map((v, i) => (
                    <View style='line-height:20px' key={i}>{v}</View>
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
