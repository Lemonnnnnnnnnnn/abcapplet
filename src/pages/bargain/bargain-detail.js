import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

import Board from '@components/board'

// 自定义组件
import BargainContainer from '@components/bargain-container'
import BargainTab from '@components/bargain-tab'
import BargainDetailMainBlock from '@components/bargain-detail-main-block'
import BargainDetailSecBlock from '@components/bargain-detail-sec-block'
import BargainingBlock from '@components/bargaining-block'

import '../../styles/_bargain.scss'

// 自定义常量

export default class bargainDetail extends Component {

  config = {
    navigationBarTitleText: '砍价详情',
    navigationBarBackgroundColor: '#FA624A',
  }



  onBargain() {
    console.log('我在砍价')
  }

  onShare() {
    console.log('我在分享')
  }

  // 点击 我也要砍，分享，帮砍
  onClick(method) {
    this[method]()
  }


  render() {
    return (
      <View className='bargain'>
        <BargainContainer />
        <View className='bargain-background'>
          {/* 第一个板块 */}
          <View className='bargain-main-block '>
            <BargainDetailMainBlock />
            {/* 砍价状态 */}
            <BargainingBlock />

            {/* 第二个板块 */}
            <BargainDetailSecBlock />
          </View>
          {/* 底部tab栏 */}
          <BargainTab onClick={this.onClick} />

        </View>

      </View>
    );
  }
}
