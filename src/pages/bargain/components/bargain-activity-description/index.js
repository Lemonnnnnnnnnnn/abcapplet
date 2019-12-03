import Taro, { Component } from '@tarojs/taro';
import { View, Image, RichText } from '@tarojs/components';
import { AtDivider, AtIcon, AtButton } from 'taro-ui'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { BARGAIN_CALL } from '@constants/picture'

// 自定义组件
import BaseComponent from '@components/base'

export default class BargainActivityDescription extends BaseComponent {

  render() {
    const { content } = this.props

    const imageStyle = {
      height: Taro.pxTransform(13 * 2),
      width: Taro.pxTransform(13 * 2)
    }
    return (
      <View className='pt-3 bargain-activity-description'>
        {/* <View className='text-indent text-large' style={{ minHeight: Taro.pxTransform(200) }}>{content}</View> */}
        <View className='px-3 pb-3'>
          <RichText nodes={content} ></RichText>
        </View>

        <AtDivider height='10' lineColor='#F8F8F8' />

        <AtButton open-type='contact' >
          <View className='py-1 at-row at-row__align--center at-row__justify--center' >

            <Image style={imageStyle} src={BARGAIN_CALL} mode='widthFix' />

            <View className='text-normal text-secondary ml-1'>咨询客服</View>

            <View style={{ marginBottom: Taro.pxTransform(2) }}>
              <AtIcon value='chevron-right' className='ml-1' color={COLOR_GREY_2} size='16' />
            </View>
          </View>
        </AtButton>

      </View>
    )
  }
}
