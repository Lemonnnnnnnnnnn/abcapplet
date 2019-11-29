import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton, AtIcon } from 'taro-ui';

import Board from '@components/board'
import Mask from '@components/masks'
import BaseComponent from '@components/base'

export default class BargainAppointmentMask extends BaseComponent {
  static defaultProps = {
    show: false
  }

  render() {
    const { show } = this.props
    return (show &&
      <View className='vertical-level-center position-fixed' style={{ zIndex: 12, minWidth: '80%' }}>
        <Board className='p-3' >
          <AtIcon onClick={this.props.onClose} value='close' size='15' className='p-2 ' color='#888' style='position : absolute ; right : 0'></AtIcon>
          <View className='text-large mb-3 text-center'>一段灰常完美的文案</View>
          <AtButton open-type='contact' onClick={this.onBargainAppointment} >小程序客服</AtButton>
        </Board>
        <Mask show />
      </View>
    )
  }
}
