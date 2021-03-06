// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import Board from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_YELLOW } from '@constants/styles'
import { LOCALE_MONTH, LOCALE_SEMICOLON, LOCALE_RENT, LOCALE_PRICE_UNIT } from '@constants/locale'

class OrderRoomItem extends BaseComponent {
  static defaultProps = {
    room: { no: '', price: '', apartment_title: '', id: 0 },
    selectId: 0,
  }

  onSelectRoom() {
    const { room: { id } } = this.props
    this.props.onSelectRoom(id)
  }

  render() {
    const { room, selectId } = this.props
    const { no: roomNo, apartment_title: apartmentTitle, id, discount_price } = room
    const classObject = [
      'at-row',
      'at-row__align--center',
      'at-row__justify--between',
      'p-3'
    ]

    return (
      <View
        onClick={this.onSelectRoom}
        className={classNames(classObject)}
      >
        {/* 左边 */}
        <View>
          <View className='at-row at-row__align--center'>
            <View className='border-decorate border-decorate-yellow' style={{ height: '30px' }}></View>
            <View className='ml-3'>
              <View className='text-bold text-normal'>{apartmentTitle}{roomNo}</View>
              <View className='text-small text-yellow mt-2'>
                {LOCALE_RENT}{LOCALE_SEMICOLON}
                <Text className='text-normal'>{discount_price}</Text>
                {LOCALE_PRICE_UNIT}/{LOCALE_MONTH}
              </View>
            </View>
          </View>
        </View>

        {/* 右边 */}
        <View>
          <View className='at-row at-row__align--center mr-4'>
            <ABCIcon
              size='20'
              color={COLOR_YELLOW}
              icon={selectId == id ? 'radio_button_checked' : 'radio_button_unchecked'}
            />
          </View>
        </View>
      </View>
    )
  }
}

export default OrderRoomItem
