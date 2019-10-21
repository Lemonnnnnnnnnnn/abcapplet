import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui'

import BaseComponent from '@components/base'
import Board from '@components/board'

import '../../styles/_button.scss'

export default class bargainTab extends BaseComponent {
  render() {
    const buttons = [
      { message: '我也要砍', method: 'onBargain' },
      { message: '分享', method: 'onShare' }
    ]


    return (
      <Board shadow='black-shadow' fixed='bottom' >
        <View className=' p-2' style={{ display : 'flex' }}>
          {
            buttons.map(i =>
              <View className={`at-col  bargain-tab-button ${buttons.length > 1 && 'pr-2'}`} key={i}>
                <AtButton
                  circle
                  className='btn-bargain'
                  onClick={this.props.onClick.bind(this, i.method)}
                >
                  {i.message}
                </AtButton>
              </View>
            )
          }
        </View>
      </Board>

    )
  }
}
