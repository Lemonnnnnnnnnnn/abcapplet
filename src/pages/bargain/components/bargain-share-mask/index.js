import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton, AtIcon, AtDivider } from 'taro-ui';

import Board from '@components/board'
import Mask from '@components/masks'
import BaseComponent from '@components/base'

export default class BargainShareMask extends BaseComponent {
  static defaultProps = {
    show: false
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    const { show } = this.props
    const wrapStyle = {
      zIndex: 12,
      minWidth: '90%',
       bottom: Taro.pxTransform(50),
       top : 'auto'
    }
    return (show &&
      <Mask show >
        <View onTouchMove={this.onMaskTouchMove} className='level-center position-fixed bargain-mask-share' style={wrapStyle}>
          <Board className='p-3' >
            <AtButton open-type='share' >分享给好友</AtButton>
            <AtDivider height='30' lineColor='#DDDDE1' />
            <AtButton onClick={this.props.onGetPoster}>生成长图分享</AtButton>
            <AtDivider height='30' lineColor='#DDDDE1' />
            <AtButton onClick={this.props.onClose}>取消</AtButton>
          </Board>
        </View>
      </Mask>
    )
  }
}
