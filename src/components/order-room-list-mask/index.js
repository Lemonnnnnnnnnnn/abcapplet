// Taro 相关
import Taro from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import OrderRoomItem from '@components/order-room-item'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class OrderRoomListMask extends BaseComponent {

  static defaultProps = {
    show: false,
    rooms: [],
    selectId: 0,
  }

  render() {
    const { className, show, rooms, selectId } = this.props
    const height = rooms.length < 3 ? rooms.length * 90 : 270
    return (show && <View className={className}>
      <Board fixed='bottom' border='top' color='light-grey'>
        <View className='m-3'>
          {/* 公寓头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>查看公寓详情</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>

          <ScrollView scrollY style={{ height: `${height}px` }}>
            {rooms.map(i =>
              <OrderRoomItem
                room={i}
                key={i.id}
                className='mb-3'
                selectId={selectId}
                onSelectRoom={this.props.onSelectRoom}
              />
            )}
          </ScrollView>

          {/* 无公寓详情 */}
          {rooms.length === 0 && <View>无可选房间</View>}
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>)
  }
}

export default OrderRoomListMask
