// Taro 相关
import Taro from '@tarojs/taro'
import { View, ScrollView, Input } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import OrderRoomItem from '@components/order-room-item'

// 自定义常量
import { COLOR_GREY_2, COLOR_GREY_0 } from '@constants/styles'

class OrderRoomListMask extends BaseComponent {

  static defaultProps = {
    show: false,
    rooms: [],
    selectId: 0,
  }
  state = {
    bottom: 0
  }


  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  onInputBegin() {
    this.setState({
      bottom: Taro.pxTransform(200)
    })
  }

  onInputOver() {
    this.setState({
      bottom: Taro.pxTransform(0)
    })
  }

  render() {
    const { className, show, rooms, selectId } = this.props
    const { bottom } = this.state

    return (show && <View className={className} onTouchMove={this.onMaskTouchMove} >
      <Board fixed='bottom' border='top' color='light-grey' customStyle={{ bottom }}>
        <View className='m-3' style={{ minHeight: Taro.pxTransform(900) }}>
          {/* 公寓头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>修改房间号</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>

          {/* 搜索房间号 */}
          <View className='at-row at-row__justify--center  '>
            <View className='search-box at-row  at-row__align--center '>
              <AtIcon className='ml-3 at-row' value='search' size={15} color={COLOR_GREY_0} />
              <Input
                placeholder='请输入您要查找的房间号'
                onFocus={this.onInputBegin}
                onBlur={this.onInputOver}
                onInput={this.props.onSearchRoom}
                className='ml-3 at-row text-normal'
              />
            </View>
          </View>

          {/* 无公寓详情 */}
          {rooms.length === 0 && <View className='ml-3 text-secondary text-large mt-3 text-center'>无可选房间</View>}

          <ScrollView scrollY style={{ height: Taro.pxTransform(700) }}>
            {rooms.map(i =>
              <View className='apartment-order-room-item' key={i.id}>
                <OrderRoomItem
                  room={i}
                  selectId={selectId}
                  onSelectRoom={this.props.onSelectRoom}
                />
              </View>
            )}
          </ScrollView>


        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>)
  }
}

export default OrderRoomListMask
