import Taro, { Component } from '@tarojs/taro'
import { AtTabs, AtTag, AtButton } from 'taro-ui'

import { View } from '@tarojs/components'
import BaseComponent from '@components/base'
import { TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'

/**
 * Select 中的户型部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectHouseType extends Component {

  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onChange: () => { },
  }

  // static defaultState = {
  //   // AtTabs 相关
  //   tabIndex: -1,
  //   tabItemHeight: TABS_SELECT_ITEM_HEIGHT,
  // }

  // state = { ...SelectHouseType.defaultProps }

  onResetState() {
    const { initialRoom, initialFloor } = this.state
    this.setState({
      room: initialRoom,
      floor: initialFloor
    })
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
    setTimeout(() => {
      const { items } = this.props

      const floorList = [{id : 0 , title : "不限",active : true}]
      const roomList = [{id : 0 , title : "不限",active : true}]

      items.floor.map(i => {
        i.active = false
        floorList.push(i)
      })
      items.room.map(i => {
        i.active = false
        roomList.push(i)
      })

      this.setState({
        initialFloor: [...floorList],
        initialRoom: [...roomList],
        floor: [...floorList],
        room: [...roomList],
      })
    }, 500)

  }





  // onTabRoomChange(tabIndex) {
  //   const { items } = this.props
  //   const { id: type_floor } = items.floor[tabIndex]

  //   this.setState({ tabIndex: tabIndex })
  //   this.props.onChange({ payload: { type_floor } })
  // }

  // onTabFloorChange(tabIndex) {
  //   const { items } = this.props
  //   const { id: type_floor } = items.floor[tabIndex]

  //   this.setState({ tabIndex: tabIndex })
  //   this.props.onChange({ payload: { type_floor } })
  // }

  // onTabRoomChange(e,index) {
  //   const { items } = this.props
  //   const { id: type_floor } = items.floor[index]

  //   this.setState({ tabIndex: tabIndex })
  //   this.props.onChange({ payload: { type_floor } })
  // }

  onTabFloorChange(e, index) {
    const { floor } = this.state
    let newFloor = JSON.parse(JSON.stringify(floor))

    newFloor.map(i => {

      if (i.id === index ) {
        i.active = !i.active
        const { id: type_floor } = floor[i.id ]

        this.props.onChange({ payload: { type_floor } })
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
    let newRoom = JSON.parse(JSON.stringify(room))

    newRoom.map(i => {

      if (i.id === index ) {
        i.active = !i.active
        const { id: type_room } = room[i.id ]
        this.props.onChange({ payload: { type_room } })
      } else {
        i.active = false
      }
    })
    this.setState({
      room: [...newRoom]
    })


  }

  render() {
    const { show, items } = this.props
    const { room, floor } = this.state

    // const { tabItemHeight, tabIndex } = this.state
    // const tabsHeight = Taro.pxTransform(tabItemHeight * items.length)

    return (show && <View className='at-row '>
      <View >
        <View style={{marginLeft : "10px",fontSize : "14px",fontWeight : "bold"}} >户型选择</View>
        {
          room.map((i, key) =>
            <AtTag type='primary' className='ml-3 mr-3 mt-3 mb-3' circle onClick={(e) => this.onTabRoomChange(e, key)} key={key} active={i.active}>
              {i.title}
            </AtTag>)
        }
      </View>
      <View >
        <View style={{marginLeft : "10px",fontSize : "14px",fontWeight : "bold"}}>类型选择</View>
        {
          floor.map((i, key) =>
            <AtTag type='primary' className='ml-3 mr-3 mt-3 mb-3' circle onClick={(e) => this.onTabFloorChange(e, key)} key={key} active={i.active}>
              {i.title}
            </AtTag>)
        }
      </View>

    </View>
    )
  }
}

export default SelectHouseType
