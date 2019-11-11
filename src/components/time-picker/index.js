import Taro, { Component } from '@tarojs/taro';
import { Picker } from '@tarojs/components';
import dayjs from 'dayjs'
import { AtIcon } from 'taro-ui'
// 自定义函数
import { rangeGeneration, choiseValue } from '@utils/time-judge'

// 自定义组件
import BaseComponents from '@components/base'
import Board from '@components/board'

// 自定义常量
import { TIME_PICKER_DIST } from '@constants/dist'

export default class timePicker extends BaseComponents {

  static defaultProps = {
    sign_time: 0,
  }
  state = {
    secTimeClick: false,
  }

  componentWillMount() {
    const [year, month, day, hours, minutes, timeStr] = [
      dayjs().year(),
      dayjs().month(),
      dayjs().date(),
      // 初始化时间往后两个小时
      dayjs().hour() + 2,
      0,
      '请选择看房时间'
    ]
    this.setState({ year, month, day, hours, minutes, timeStr })

    // 初始化range
    // 因为时间是从9点半开始的，半小时制，所以减七乘以二减一是将时间往后推两个小时
    let currentHour = (hours - 9) * 2 - 1
    currentHour = currentHour < 0 ? 0 : currentHour
    currentHour = currentHour >= 24 ? 24 : currentHour

    let currentTime = [0, month, day - 1, currentHour]
    this.setState({ range: rangeGeneration(month, year), currentTime: currentTime })
  }

  onColumnChange = e => {
    const { column, value } = e.detail
    let { range, year, month, day, hours, minutes } = this.state

    if (column === 1) this.setState({ month: value }), month = value
    if (column === 2) this.setState({ day: value + 1 }), day = value + 1
    if (column === 3) {
      hours = TIME_PICKER_DIST[value].hours
      minutes = TIME_PICKER_DIST[value].minutes
      this.setState({ hours })
      this.setState({ minutes })
    }

    const timeStr = dayjs(new Date(year, month, day, hours, minutes)).format('YYYY-MM-DD HH:mm')
    this.setState({ range: choiseValue(range, month, year), timeStr })
  }

  onClickPicker() {
    let { year, month, day, hours, minutes, secTimeClick } = this.state

    if (!secTimeClick) {
      let currentHour = (hours - 9) * 2 - 1
      currentHour = currentHour < 0 ? 0 : currentHour
      currentHour = currentHour >= 24 ? 24 : currentHour

      hours = TIME_PICKER_DIST[currentHour].hours
      minutes = TIME_PICKER_DIST[currentHour].minutes

      const timeStr = dayjs(new Date(year, month, day, hours, minutes)).format('YYYY-MM-DD HH:mm')
      this.setState({ timeStr, secTimeClick: true })
    }
  }

  render() {
    const { currentTime, range, timeStr } = this.state
    return (
      <Picker value={currentTime} mode='multiSelector' range={range} onColumnChange={this.onColumnChange} onClick={this.onClickPicker}>
        <Board className='text-normal position-relative py-2' color='grey'>
          {timeStr}
          <AtIcon value='chevron-up' size='15' color='#888' style='position : absolute ; right : 8px ;top : 2px'></AtIcon>
          <AtIcon value='chevron-down' size='15' color='#888' style='position : absolute ; right : 8px;bottom : 2px'></AtIcon>
        </Board>
      </Picker>
    )
  }
}
