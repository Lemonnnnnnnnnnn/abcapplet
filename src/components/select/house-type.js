import Taro, { Component } from '@tarojs/taro'
import { AtTag, } from 'taro-ui'

import { View } from '@tarojs/components'

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


  onResetState() {
    const { initialRoom, initialFloor } = this.state
    this.setState({
      room: initialRoom,
      floor: initialFloor
    })
  }

  state = {
    room: [
      { id: 0, title: "", active: true, type: false }
    ],
    floor: [
      { id: 0, title: "", active: true, type: false }
    ],
    initialRoom: [],
    initialFloor: [],
  }

  componentWillMount() {
    const { items } = this.props

    const floorList = [{ id: 0, title: "不限", active: true, type: true }]
    const roomList = [{ id: 0, title: "不限", active: true, type: true }]

    items.floor.map(i => {
      i.type = false
      i.active = true

      floorList.push(i)
    })
    items.room.map(i => {
      i.type = false
      i.active = true
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
    let newFloor = JSON.parse(JSON.stringify(floor))

    newFloor.map(i => {

      if (i.id === index) {
        i.type = !i.type
        const { id: type_floor } = floor[i.id]
        this.props.onChange({ payload: { type_floor } })
      } else {
        i.type = false
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

      if (i.id === index) {
        i.type = !i.type
        const { id: type_room } = room[i.id]
        this.props.onChange({ payload: { type_room } })
      } else {
        i.type = false
      }
    })
    this.setState({
      room: [...newRoom]
    })


  }

  render() {
    const { show } = this.props
    const { room, floor } = this.state

    const fontStyle = {
      fontSize: "15px",
      padding: "0 5px"
    }



    return (show && <View className='at-row '>
      <View >
        <View style={{ marginLeft: "10px", fontSize: "16px", marginTop: "25px" }} >户型选择</View>
        {
          room.map((i, key) =>
            <AtTag type={i.type ? "primary" : ""} className='ml-3 mr-1 mt-3 mb-3' circle onClick={(e) => this.onTabRoomChange(e, key)} key={key} active={i.active}>
              <View style={fontStyle}>{i.title}</View>
            </AtTag>)
        }
      </View>
      <View style={{marginBottom : "20px"}}>
        <View style={{ marginLeft: "10px", fontSize: "16px", marginTop: "15px" }}>类型选择</View>
        {
          floor.map((i, key) =>
            <AtTag type={i.type ? "primary" : ""} className='ml-3 mr-1 mt-3 mb-3' circle onClick={(e) => this.onTabFloorChange(e, key)} key={key} active={i.active}>
              <View style={{ fontSize: "15px", padding: "0 5px" }}>{i.title}</View>
            </AtTag>)
        }
      </View>

    </View>
    )
  }
}

export default SelectHouseType
