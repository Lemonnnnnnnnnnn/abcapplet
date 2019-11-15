import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtButton, AtCountdown } from 'taro-ui'

import { LOCALE_BARGAIN_GET_POWER, LOCALE_BARGAIN_RECEIVE_COUPON, LOCALE_BARGAIN_SHARE } from '@constants/locale'

import BaseComponent from '@components/base'
import Board from '@components/board'

export default class BargainTab extends BaseComponent {

  static defaultProps = {
    user_bargain: { is_receive: false },
    buttons: []
  }

  render() {
    const { zIndex, buttons, bargainSuccess, user_bargain: { is_receive } } = this.props

    return (
      <Board shadow='black-shadow' fixed='bottom' border='top' customStyle={{ zIndex }}>
        <View className=' p-2 at-row' style={{ width: 'auto' }}>
          {
            bargainSuccess && <View className='at-col at-col-6  ml-2 text-normal'>
              {
                is_receive ? <View className='text-center'>您已领取优惠券</View>
                  : <View className='text-center'>
                    <View >{LOCALE_BARGAIN_GET_POWER}</View>
                    <View >{LOCALE_BARGAIN_RECEIVE_COUPON}</View>
                  </View>
              }
            </View>
          }
          {
            buttons.map(i =>
              <View className={`at-col  bargain-tab-button ${buttons.length > 1 && 'pr-2'}`} key={i}>
                <AtButton
                  circle
                  className={`${is_receive ? 'btn-grey' : 'btn-bargain'}`}
                  disabled={is_receive ? true : false}
                  open-type={i.message === LOCALE_BARGAIN_SHARE ? 'share' : ''}
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
