import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

import BaseComponent from '@components/base'

export default class bargainContainer extends BaseComponent {

  render() {
    const src = 'https://images.gongyuabc.com/image/bargain-banner.png'
    return (
      <View style={{ minHeight: Taro.pxTransform(200 * 2), background: '#fa624a' }}>
        <Image lazyLoad className='bargain-header level-center' src={src} mode='widthFix'></Image>
      </View>
    );
  }
}
