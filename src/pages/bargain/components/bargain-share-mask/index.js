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
    return (show &&
      <View>
        {/* onTouchMove方法不能用在自定义组件上，在外套一层View */}
        <View onTouchMove={this.onMaskTouchMove} >
          <Board className='bargain-mask-share' fixed='bottom' >
            {/* 内边距 */}
            <View className='p-3'>
              <AtButton open-type='share' >分享给好友</AtButton>
              <AtDivider height='30' lineColor='#DDDDE1' />
              <AtButton onClick={this.props.onGetPoster}>生成长图分享</AtButton>
              <AtDivider height='30' lineColor='#DDDDE1' />
              <AtButton onClick={this.props.onClose.bind(this, 'showShareMask')}>取消</AtButton>
            </View>
          </Board>
        </View>

        <View onClick={this.props.onClose.bind(this, 'showShareMask')}><Mask show /></View>
      </View>
    )
  }
}
