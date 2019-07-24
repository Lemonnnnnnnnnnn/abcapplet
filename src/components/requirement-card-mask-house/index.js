// Taro 相关
import Taro from '@tarojs/taro'

import { View } from '@tarojs/components'
import { AtTabs, AtButton, AtTag } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2, TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'
import { LOCALE_RESET, LOCALE_CONFIRM, LOCALE_ROOM_HOUSETYPE } from '@constants/locale'

class RequirementHouseMask extends BaseComponent {
  static defaultProps = {
    show: true,
    apartments: [],
    headerIndex: 'price',
    priceDist: [],

    tabItemHeight: TABS_SELECT_ITEM_HEIGHT,

  }

  state = {
    room: [
      { id: 0, title: "", active: false }
    ],
    floor: [
      { id: 0, title: "", active: false }
    ],
    initialRoom: [],
    initialFloor: [],
  }

  componentWillMount() {

      const { houseDist } = this.props

      const floorList = [{ id: 0, title: "不限", active: true }]
      const roomList = [{ id: 0, title: "不限", active: true }]

      houseDist.floor.map(i => {
        i.active = false
        floorList.push(i)
      })
      houseDist.room.map(i => {
        i.active = false
        roomList.push(i)
      })

      this.setState({
        initialFloor: [...floorList],
        initialRoom: [...roomList],
        floor: [...floorList],
        room: [...roomList],
      })

  }



  onTabFloorChange(e, index) {
    const { floor } = this.state
    const { onhandleClickFloor } = this.props
    let newFloor = JSON.parse(JSON.stringify(floor))

    newFloor.map(i => {

      if (i.id === index) {
        i.active = !i.active
        const { id: type_floor } = floor[i.id]

        onhandleClickFloor(type_floor)
      } else {
        i.active = false
      }
    })
    this.setState({
      floor: [...newFloor]
    })

  }

  onTabRoomChange(e, index) {
    const { room } = this.state
    const { onhandleClickRoom } = this.props
    let newRoom = JSON.parse(JSON.stringify(room))

    newRoom.map(i => {

      if (i.id === index) {
        i.active = !i.active
        const { id: type_room } = room[i.id]
        onhandleClickRoom(type_room)
      } else {
        i.active = false
      }
    })
    this.setState({
      room: [...newRoom]
    })
  }


  onResetState() {
    const { initialRoom, initialFloor } = this.state
    this.setState({
      room: initialRoom,
      floor: initialFloor
    })
  }


  render() {
    let { show } = this.props

    const { room, floor } = this.state



    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>{LOCALE_ROOM_HOUSETYPE}</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          {/* 主体 */}

          {/*  */}

          <View >
            <View style={{ marginLeft: "10px", fontSize: "14px", fontWeight: "bold" }} >户型选择</View>
            {
              room.map((i, key) =>
                <AtTag type='primary' className='ml-3 mr-2 mt-3 mb-3' circle onClick={(e) => this.onTabRoomChange(e, key)} key={key} active={i.active}>
                  {i.title}
                </AtTag>)
            }
          </View>
          <View >
            <View style={{ marginLeft: "10px", fontSize: "14px", fontWeight: "bold" }}>类型选择</View>
            {
              floor.map((i, key) =>
                <AtTag type='primary' className='ml-3 mr-2 mt-3 mb-3' circle onClick={(e) => this.onTabFloorChange(e, key)} key={key} active={i.active}>
                  {i.title}
                </AtTag>)
            }
          </View>

        </View>
        {/* 按钮 */}
        <View>
          <View className='select-button my-2 at-row at-row__justify--between'>
            <View className='at-col at-col-4'>
              <AtButton
                circle
                onClick={this.props.onResetClick}
                className='ml-2 btn-yellow'
              >
                {LOCALE_RESET}
              </AtButton>
            </View>
            <View className='at-col at-col-8'>
              <AtButton
                circle
                onClick={this.props.onComfireHouse}
                className='mx-2 btn-yellow active'
              >
                {LOCALE_CONFIRM}
              </AtButton>
            </View>
          </View>
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} style='position:relative;z-index:1' />
    </View >
  }
}

export default RequirementHouseMask
