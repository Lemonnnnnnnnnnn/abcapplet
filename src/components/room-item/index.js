// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

// 自定义组件
import Tag from '@components/tag'
import Board from '@components/board'
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'

// 自定义常量
import {
  ROOM_STATUS_DIST,
  TYPE_FAVORITE_ROOM,
} from '@constants/room'

import {
  COLOR_YELLOW
} from '@constants/styles'

import {
  LOCALE_MONTH,
  LOCALE_ABC_SIGN,
  LOCALE_NO_AWARD_AND_SPACE,
  LOCALE_PRICE_UNIT,
} from '@constants/locale'
import { PAGE_ORDER_CREATE } from '@constants/page'

class RoomItem extends BaseComponent {
  static defaultProps = {
    room: { cover: '' },
    type: '',
    width: 220,
    height: 220,
    className: '',
    isSign: true,
  }

  state = {
    releaseDate: "",
    showYear: false,
    year: 0,
  }

  componentDidMount() {
    const { room } = this.props
    const { open_time, status } = room
    status === 2 && this.changeTime(open_time)
  }

  onSignRoom() {
    const { room } = this.props
    const id = room.room_id || room.id
    Taro.navigateTo({ url: `${PAGE_ORDER_CREATE}?room_id=${id}` })
  }

  // onCreateFavorite() {
  //   const { room } = this.props
  //   const id = room.room_id || room.id

  //   this.props.onCreateFavorite({ payload: { room_id: id } })
  // }

  // onDeleteFavorite() {
  //   const { room } = this.props
  //   const id = room.room_id || room.id

  //   this.props.onDeleteFavorite({ payload: { room_id: id } })
  // }


  // onViewPic() {
  //   const { room, roomList } = this.props
  //   const { cover } = room
  //   let picList = []

  //   roomList.map((value) => {
  //     picList.push(value.cover)
  //   })
  //   Taro.previewImage({
  //     current: cover,
  //     urls: picList
  //   })
  // }

  changeTime(time) {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const timeArr = time.split("-")
    const yearLease = parseInt(timeArr[0])
    const monthLease = parseInt(timeArr[1])
    const dayLease = parseInt(timeArr[2])

    const releaseDate = monthLease + "月" + dayLease + "日"


    if (yearLease !== year) {
      this.setState({
        showYear: true,
        year: yearLease
      })
    }

    this.setState({
      releaseDate: releaseDate
    })
  }


  render() {
    const { className, room, height, type, isSign } = this.props
    const { status, space, toward, is_collect: isCollect, discount_price, price } = room

    const { showYear, year, releaseDate } = this.state

    // 兼容字段代码
    const roomNo = room.room_no || room.no
    // const priceTitle = room.price_title || room.price

    const whiteBorderStyle = {
      backgroundColor: "#F8F8F8",
      borderRadius: Taro.pxTransform(24),
      borderBottom: '1px solid #fff',
    }
    const tag = ROOM_STATUS_DIST[status]


    const hasRoomStyle = {
      borderRadius: Taro.pxTransform(10),
      height: Taro.pxTransform(32),
      textAlign: 'center',
      lineHeight: Taro.pxTransform(32),
      padding: ' 2px 7px',
      whiteSpace: 'nowrap',
    }

    return (
      <Board
        className={classNames('room', className)}
        styleName={{ height: Taro.pxTransform(height) }}
      >
        <View className='at-row' style={whiteBorderStyle} >

          <View className='mx-3 my-2' style={{ width: '100%' }}>
            {/* 第一行 */}
            <View className='at-row'>
              {/* 文字和标签 */}
              <View className='at-row  at-row__align--center'>
                <Text className='text-bold text-huge mr-2'>
                  {roomNo}
                </Text>
                <Text className='text-secondary text-small my-2'>
                  {toward}, {space} ㎡  {(space === '' && toward === '') ? LOCALE_NO_AWARD_AND_SPACE : ''}
                </Text>

              </View>
            </View>

            {/* 第二行 */}

            <View >
              <View className='at-row at-row__justify--between  at-row__align--center'>

                <View className='at-row  at-row__align--center'>
                  {/* 平台折扣价 */}
                  {
                    discount_price !== price ? <Text className=' text-mini badge-hasRoom mr-2' style={hasRoomStyle}>ABC价</Text>
                      : <Text></Text>
                  }
                  {/* 价格 */}

                  <Text className='text-large text-bold text-yellow '>{discount_price}</Text>
                  <Text className='text-large text-yellow '>{LOCALE_PRICE_UNIT}/{LOCALE_MONTH}</Text>

                  {/* 折扣价 */}
                  {
                    discount_price !== price ? <Text className='ml-2 text-small' style={{ textDecoration: 'line-through' }}>{price}{LOCALE_PRICE_UNIT}/{LOCALE_MONTH}</Text>
                      : <Text></Text>
                  }

                </View>

                {/* 图片预览暂时取消 */}
                {/* <View className='mr-3'>
                  <AtIcon value='image' size='25' color={COLOR_YELLOW} onClick={this.onViewPic} ></AtIcon>
                </View> */}
                {
                  status === 2 ?
                    <View className='badge-hasNoRoom text-mini' style={hasRoomStyle}>{showYear ? year + releaseDate + tag.message : releaseDate + tag.message}</View>
                    :
                    <Text></Text>
                }

                {status === 1 && isSign && <AtButton
                  circle className='btn-yellow active' size='small'
                  onClick={this.onSignRoom}
                >
                  {LOCALE_ABC_SIGN}
                </AtButton>}


              </View>
            </View>
          </View>
        </View>
      </Board>
    )
  }
}

export default RoomItem
