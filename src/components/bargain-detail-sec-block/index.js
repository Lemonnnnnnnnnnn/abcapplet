import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

import Board from '@components/board'
import BaseComponent from '@components/base'
import { BARGAIN_NAV_DIST } from '@constants/bargain'


export default class BargainDetailMainBlock extends BaseComponent {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    navList: BARGAIN_NAV_DIST,
    current: 1,
  }


  onChangeBlock(value) {
    const { navList } = this.state
    let navListClone = JSON.parse(JSON.stringify(navList))

    navListClone.map(i => {
      if (i.id === value) { i.active = true } else { i.active = false }
    })
    this.setState({ navList: navListClone, current: value })
  }

  render() {
    const { navList, current } = this.state

    return (
      <Board className='mt-2 ml-3 mr-3'>
        {/* 板块内边距 */}
        <View>
          {/* 导航栏 */}
          <View className='at-row at-row__justify--around pt-3'>
            {navList.map(i => <View onClick={this.onChangeBlock.bind(this, i.id)} className={i.active ? 'text-large text-bold user-coupon-nav-active' : 'text-normal text-secondary'} key={i}>{i.title}</View>)}
          </View>

          {/* 可切换的板块 */}
          {current === 1 && <View className='text-center page-middile' style={{ height: '200px' }}>砍价说明描述</View>}
          {current === 2 && <View className='text-center page-middile' style={{ height: '200px' }}>砍价榜展示</View>}
        </View>
      </Board>
    );
  }
}
