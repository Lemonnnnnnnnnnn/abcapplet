import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton, AtCountdown } from 'taro-ui'

import BaseComponent from '@components/base'
import Board from '@components/board'

export default class BargainTab extends BaseComponent {


  render() {
    const { zIndex, buttons, bargainSuccess } = this.props

    return (
      <Board shadow='black-shadow' fixed='bottom' border='top' customStyle={{ zIndex }}>
        <View className=' p-2 at-row' style={{ width: 'auto' }}>
          {
            bargainSuccess && <View className='at-col at-col-6  ml-2 text-normal'>
              <View className='text-center'>恭喜您已获得活动资格</View>
              <View className='text-center'>请领取优惠券</View>
            </View>
          }
          {
            buttons.map(i =>
              <View className={`at-col  bargain-tab-button ${buttons.length > 1 && 'pr-2'}`} key={i}>
                <AtButton
                  circle
                  className='btn-bargain'
                  open-type={i.message === '分享' ? 'share' : ''}
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
