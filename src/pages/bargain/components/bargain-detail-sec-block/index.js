import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'

import { BARGAIN_NAV_DIST } from '@constants/bargain'

import BargainLeaderboard from '../bargain-leaderboard'

export default class BargainDetailMainBlock extends BaseComponent {
  state = {
    navList: BARGAIN_NAV_DIST,
    current: 1,
  }
  static defaultProps = {
    bargainDetail: { content: '' }
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
    const { bargainDetail, bargainDetail: { content } } = this.props

    return (
      <View style={{ paddingBottom: Taro.pxTransform(75 * 2) }}>
        <Board className='mt-2 ml-3 mr-3' >
          {/* 板块内边距 */}
          <View>
            {/* 导航栏 */}
            <View className='at-row at-row__justify--around pt-3'>
              {navList.map(i => <View onClick={this.onChangeBlock.bind(this, i.id)} className={i.active ? 'text-large text-bold user-coupon-nav-active' : 'text-normal text-secondary'} key={i}>{i.title}</View>)}
            </View>

            {/* 可切换的板块 */}
            {current === 1 && <View className='text-indent text-large p-3 my-2'>{content}</View>}
            {current === 2 && <BargainLeaderboard bargainDetail={bargainDetail} />}
          </View>
        </Board>
      </View>
    );
  }
}
