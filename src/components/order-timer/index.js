import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Board from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import {
  COLOR_RED,
  COLOR_WHITE,
  COLOR_LIGHT_YELLOW,
} from '@constants/styles'

import {
  ORDER_STATUS_DIST,
  ORDER_STATUS_LOCK_FAIL,
  ORDER_STATUS_LOCK_WAITING,
  ORDER_STATUS_LOCK_SUCCESS,
  ORDER_STATUS_PAY_WAITING,
} from '@constants/order'

import {
  LOCALE_ORDER_LOCK_FAIL,
  LOCALE_ORDER_LOCK_SUCCESS,

} from '@constants/locale'

class OrderTimer extends BaseComponent {

  static defaultProps = {
    status: 0,
    initTimer: 0,
  }

  state = {
    timer: 0,
    remainTime: '',
  }

  componentWillMount() {
    const { initTimer, status } = this.props
    status === ORDER_STATUS_LOCK_WAITING && this.setTimer(initTimer)
    status === ORDER_STATUS_PAY_WAITING && this.setPayTimer(initTimer)
  }

  setTimer(timer) {
    const { status } = this.props
    if (status === ORDER_STATUS_LOCK_WAITING) {
      const prefixInteger = (number) => String(number).length === 1 ? `0${number}` : number
      const minute = prefixInteger(Math.floor(timer / 60))
      const second = prefixInteger(Math.floor(timer - minute * 60))

      // 倒计时
      if (timer > 0) {
        setTimeout(() => this.setTimer(timer - 1), 1000)
        this.setState({ remainTime: `${minute}′${second}″`, timer: timer - 1 })
        return;
      }

      // 刷新数据
      if (timer === 0) {
        this.props.onTimeOut()
      }
    }
  }

  setPayTimer(timer) {
    const { status } = this.props
    if (status === ORDER_STATUS_PAY_WAITING) {
      const prefixInteger = (number) => String(number).length === 1 ? `0${number}` : number
      const hour = prefixInteger(Math.floor(timer / 3600)) // 小时
      const minute = prefixInteger(Math.floor((timer - hour * 3600) / 60)) // 分钟
      const second = prefixInteger(Math.floor(timer - hour * 3600 - minute * 60)) // 秒钟

      // 倒计时
      if (timer > 0) {
        setTimeout(() => this.setPayTimer(timer - 1), 1000)
        this.setState({ remainTime: `剩${hour}小时${minute}分${second}秒自动关闭`, timer: timer - 1 })
        return;
      }

      // 刷新数据
      if (timer === 0) {
        this.props.onTimeOut()
      }
    }
  }

  render() {
    const { initTimer, status } = this.props
    const { timer, remainTime } = this.state

    // 实现动态效果
    const diff = (initTimer - timer) % 6
    const isFail = status === ORDER_STATUS_LOCK_FAIL
    const isSuccess = status === ORDER_STATUS_LOCK_SUCCESS

    let message = (isFail || isSuccess) ? ORDER_STATUS_DIST[status].message : remainTime

    const lock = <View className='at-row at-row__align--center at-row__justify--around pb-3'>
      <View className='at-col-2'>
        <View className='at-row at-row--wrap'>
          <View className='at-col'>
            <ABCIcon icon='check_circle_outline' color={COLOR_WHITE} size='46' />
          </View>
          <View className='at-col'>
            <View className='mt-1 text-small text-white'>支付定金</View>
          </View>
        </View>
      </View>
      <View className='at-col-2'>
        {(!isSuccess && !isFail) && <View className='at-row at-row__align--center at-row__justify--around'>
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
          <ABCIcon icon='lens' color={2 <= diff && diff <= 5 || diff === 0 ? COLOR_WHITE : COLOR_LIGHT_YELLOW} size='10' />
          <ABCIcon icon='lens' color={3 <= diff && diff <= 5 || diff === 0 ? COLOR_WHITE : COLOR_LIGHT_YELLOW} size='10' />
        </View>}

        {(isFail || isSuccess) && <View className='at-row at-row__align--center at-row__justify--around'>
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
        </View>}
      </View>
      <View>
        <View className='at-row at-row__align--center at-row__justify--center text-center'
          style={{
            position: 'relative',
            height: '80px',
            width: '80px',
            'border-radius': '50%',
            border: '5px solid #FFDA61'
          }}
        >
          <View className='text-large text-white text-bold' style={{ 'z-index': '1', position: 'absolute' }}>{message}</View>
       {/* {   锁} */}
          <ABCIcon icon='lock_open' color={COLOR_LIGHT_YELLOW} size='80'
            customStyle={{ 'z-index': '0', position: 'absolute', top: 0, left: 0 }}
          />
        </View>
      </View>
      <View className='at-col-2'>
        {isFail && <View className='at-row at-row__align--center at-row__justify--around'>
          <ABCIcon icon='lens' color={COLOR_RED} size='10' />
          <ABCIcon icon='lens' color={COLOR_RED} size='10' />
          <ABCIcon icon='lens' color={COLOR_RED} size='10' />
        </View>}
        {isSuccess && <View className='at-row at-row__align--center at-row__justify--around'>
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
          <ABCIcon icon='lens' color={COLOR_WHITE} size='10' />
        </View>}
        {(!isSuccess && !isFail) && <View className='at-row at-row__align--center at-row__justify--around'>
          <ABCIcon icon='lens' color={!isFail && (4 === diff || diff === 5 || diff === 0) ? COLOR_WHITE : COLOR_LIGHT_YELLOW} size='10' />
          <ABCIcon icon='lens' color={!isFail && (diff === 5 || diff === 0) ? COLOR_WHITE : COLOR_LIGHT_YELLOW} size='10' />
          <ABCIcon icon='lens' color={!isFail && (diff === 0) ? COLOR_WHITE : COLOR_LIGHT_YELLOW} size='10' />
        </View>}
      </View>
      <View className='at-col-2'>
        <View className='at-row at-row--wrap'>
          <View className='at-col'>
            {isFail && <ABCIcon icon='sentiment_very_dissatisfied' color={COLOR_RED} size='46' />}
            {isSuccess && <ABCIcon icon='tag_faces' color={COLOR_WHITE} size='46' />}
            {(!isSuccess && !isFail) && <ABCIcon icon='tag_faces' color={COLOR_LIGHT_YELLOW} size='46' />}
          </View>
          <View className='at-col'>
            <View className={`mt-1 text-small ${isFail ? 'text-red' : 'text-white'}`}>
              {isFail ? LOCALE_ORDER_LOCK_FAIL : '预定成功'}
            </View>
          </View>
        </View>
      </View>
    </View>
    const pay = <Board className='p-3'>
      <View className='text-huge text-bold'>等待租客付款</View>
      <View className='text-normal mt-2'>{remainTime}</View>
    </Board>
    return (
      <View>
        {status === ORDER_STATUS_PAY_WAITING && pay}
        {status === ORDER_STATUS_LOCK_WAITING && lock}
        {status === ORDER_STATUS_LOCK_SUCCESS && lock}
      </View>
    )
  }
}

export default OrderTimer
