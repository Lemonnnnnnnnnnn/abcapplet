import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtCountdown, AtButton } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
// 自定义常量
import { PAGE_BARGAIN_DETAIL } from '@constants/page'

import '../../../../styles/_apartment.scss'

export default class apartmentBargainCard extends BaseComponent {
  static defaultProps = {
    bargain: {
      close_time: '',
      id: 0,
      price: '',
      days: 99,
      hours: 24,
      minutes: 60,
      seconds: 60
    }
  }

  state = {
    show: true
  }

  onTimeUp() {
    this.setState({ show: false })
  }

  onNavigation() {
    const { bargain: { id } } = this.props
    Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  render() {
    const { bargain: {  price, days, hours, minutes, seconds } } = this.props
    const { show } = this.state
    return (show &&
      <Board className='my-4 apartment-house-type-bargain-card' shadow='black-shadow'>
        {/* 内边距 */}
        <View className='p-3'>
          {/* 绝对定位 户型房间 和砍价时间 */}
          <View className='position-relative' style={{ minHeight: Taro.pxTransform(20) }}>
            <View className='position-absolute at-row at-row__justify--around at-row__align--end float-unit' >
              <Text className='text-small tag tag--black'>本户型 </Text>
              <View className='at-col at-col-8'>
                <AtCountdown
                  isCard
                  isShowDay
                  isShowHour
                  format={{ day: '天', hours: '时', minutes: '分', seconds: '秒结束' }}
                  day={days}
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                  onTimeUp={this.onTimeUp.bind(this)}
                />
              </View>
            </View>
          </View>
          {/* 下半部分 */}
          <View className='at-row at-row__justify--between at-row__align--end'>
            {/* 价格 */}
            <View className='at-row at-row__align--end text-orange'>
              <Text className='text-mini text-bold'>￥ </Text>
              <Text className='text-super text-bold huge-text' >{parseInt(price)}</Text>
              <Text className='text-small'> /月（砍后价）</Text>
            </View>

            <AtButton
              circle
              className='btn-bargain text-normal'
              onClick={this.onNavigation}
            >马上砍</AtButton>
          </View>
        </View>
      </Board>
    );
  }
}
