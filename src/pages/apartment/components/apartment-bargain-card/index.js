import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtCountdown, AtButton, AtIcon } from 'taro-ui'

// 自定义方法
import { timestampChange } from '@utils/time-judge'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'
// 自定义常量
import { PAGE_BARGAIN_DETAIL, PAGE_BARGAIN_LIST } from '@constants/page'

export default class apartmentBargainCard extends BaseComponent {

  state = {
    show: true,
    days: 99,
    hours: 23,
    minutes: 59,
    seconds: 59,
    bargainList: [
      { id: 1, days: 99, hours: 23, minutes: 59, seconds: 59, price: '' },
      { id: 2, days: 99, hours: 23, minutes: 59, seconds: 59, price: '' }
    ]
  }
  componentWillMount() {
    let { bargain } = this.props
    let bargainList = []

    for (let i = 0; i < bargain.length; i++) {
      if (i > 1) break

      let [days, hours, minutes, seconds] = [99, 23, 59, 59]
      bargain[i].close_time > 0 ? { days, hours, minutes, seconds } = timestampChange(bargain[i].close_time) : {}
      bargainList.push({ ...bargain[i], days, hours, minutes, seconds })
    }

    this.setState({ bargainList })
  }

  onTimeUp() {
    Taro.showToast({ title: '活动已结束！', icon: 'none' })
    this.setState({ show: false })
  }

  onNavigation(id) {
    Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  render() {
    const { title, bargain } = this.props
    const { show, bargainList } = this.state
    return (show &&
      <View>
        {
          bargainList.map(i =>
            <Board key={i.id} className='mb-4 apartment-house-type-bargain-card' shadow='black-shadow'>
              {/* 内边距 */}
              <View className='p-3'>
                {/* 绝对定位 户型房间 和砍价时间 */}
                <View className='position-relative' style={{ minHeight: Taro.pxTransform(20) }}>
                  <View className='position-absolute at-row at-row__justify--around at-row__align--end float-unit' >
                    <Text className='text-small tag tag--black'>{title}</Text>
                    <View className='at-col at-col-8'>
                      <AtCountdown
                        isCard
                        isShowDay
                        isShowHour
                        format={{ day: '天', hours: '时', minutes: '分', seconds: '秒结束' }}
                        day={i.days}
                        hours={i.hours}
                        minutes={i.minutes}
                        seconds={i.seconds}
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
                    <Text className='text-super text-bold huge-text' >{parseInt(i.price)}</Text>
                    <Text className='text-small'> /月（砍后价）</Text>
                  </View>

                  <AtButton
                    circle
                    className='btn-bargain text-normal'
                    onClick={this.onNavigation.bind(this, i.id)}
                  >马上砍</AtButton>
                </View>
              </View>
            </Board>)
        }

        {bargain.length > 2 &&
          <View
            onClick={() => Taro.navigateTo({ url: PAGE_BARGAIN_LIST })}
            className='mt-2 text-normal text-secondary at-row at-row__justify--center at-row__align--center'
          >
            展示更多<AtIcon value='chevron-right' color='#888888' size='16' />
          </View>}

      </View>
    );
  }
}
