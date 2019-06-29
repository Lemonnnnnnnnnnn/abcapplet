// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// NPM 包
import day from 'dayjs'
import classNames from 'classnames'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import Board from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ORDER_SHOW } from '@constants/page'
import { ORDER_STATUS_DIST } from '@constants/order'

class OrderItem extends BaseComponent {
  static defaultProps = {
    order: {}
  }

  onNavigation() {
    const { order: { id } } = this.props
    Taro.navigateTo({ url: `${PAGE_ORDER_SHOW}?id=${id}` })
  }

  render() {
    const { order, className } = this.props
    const {
      status,
      room_no: roomNo,
      sign_time: signTime,
      apartment_title: apartmentTitle,
    } = order

    const { message, isLight } =
      ORDER_STATUS_DIST[status]
      || { message: '', isLight: false }

    const boardColor = isLight ? 'white' : 'grey'
    const color = isLight ? 'text-yellow' : 'text-secondary'
    const borderColor = isLight ? 'border-decorate-yellow' : 'border-decorate-grey'

    return (
      <Board className={classNames('p-3', className)} color={boardColor}>
        <View
          onClick={this.onNavigation}
          className='at-row at-row__align--center at-row__justify--between'
        >
          {/* 左边 */}
          <View>
            <View className='at-row'>
              <View className={`border-decorate ${borderColor}`} style={{ height: '30px' }}></View>
              <View className='ml-3'>
                <View className='text-bold text-normal'>{apartmentTitle}{roomNo}</View>
                <View className='text-small text-secondary mt-2'>
                  {day.unix(signTime).format('YYYY年MM月DD日')}
                </View>
              </View>
            </View>
          </View>

          {/* 右边 */}
          <View>
            <View className='at-row at-row__align--center '>
              <View className={`text-small ${color}`}>{message}</View>
              <ABCIcon icon='chevron_right' size='20' color={COLOR_GREY_2} />
            </View>
          </View>
        </View>
      </Board>
    )
  }
}

export default OrderItem
