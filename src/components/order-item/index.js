// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

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

    const { message, isLight, icon, height, width } =
      ORDER_STATUS_DIST[status]
      // ORDER_STATUS_DIST[3]
      || { message: '', isLight: false }

    const boardColor = isLight ? 'white' : 'grey'
    const color = isLight ? 'text-yellow' : 'text-secondary'
    const borderColor = isLight ? 'border-decorate-yellow' : 'border-decorate-grey'

    const hasRoomStyle = {
      borderRadius: Taro.pxTransform(30),
      height: Taro.pxTransform(52),
      textAlign: 'center',
      lineHeight: Taro.pxTransform(52),
      padding: '2px 14px',
    }

    return (
      <Board className={classNames('p-3', className)} color={boardColor}>
        <View
          onClick={this.onNavigation}
          className='at-row at-row__align--center at-row__justify--between'
        >
          {/* 左边 */}
          <View>
            <View className='at-row at-row__align--center'>
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
              {
                message === '预定完成' ?

                  <View className=' text-normal badge-hasRoom mr-2 at-row at-row__align--center' style={hasRoomStyle}>
                    {
                      icon && <Image style={{ width: Taro.pxTransform(width), height: Taro.pxTransform(height) }} className='mr-1' src={icon}></Image>
                    }
                    <Text>{message}</Text>
                  </View>

                  :

                  <View className='at-row at-row__align--center mr-2'>
                    {
                      icon && <Image style={{ width: Taro.pxTransform(width), height: Taro.pxTransform(height) }} className='mr-2' src={icon}></Image>
                    }
                    <View className={`text-small ${color}`}>{message}</View>
                  </View>

              }

              <ABCIcon icon='chevron_right' size='20' color={COLOR_GREY_2} />
            </View>
          </View>
        </View>
      </Board>
    )
  }
}

export default OrderItem
