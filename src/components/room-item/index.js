// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

// 自定义组件
import Tag from '@components/tag'
import Board from '@components/board'
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'

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

  onCreateFavorite() {
    const { room } = this.props
    const id = room.room_id || room.id

    this.props.onCreateFavorite({ payload: { room_id: id } })
  }

  onDeleteFavorite() {
    const { room } = this.props
    const id = room.room_id || room.id

    this.props.onDeleteFavorite({ payload: { room_id: id } })
  }


  onViewPic() {
    const { room, roomList } = this.props
    const { cover } = room
    let picList = []

    roomList.map((value) => {
      picList.push(value.cover)
    })
    Taro.previewImage({
      current: cover,
      urls: picList
    })
  }

  changeTime(time) {
    const nowDate = new Date()
    const year = nowDate.getFullYear()
    const timeArr = time.split("-")
    const yearLease = parseInt(timeArr[0])
    const monthLease = parseInt(timeArr[1])
    const dayLease = parseInt(timeArr[2])

    const releaseDate = monthLease + "月" + dayLease + "日"


    if (yearLease != year) {
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
    const { className, room, width, height, type, isSign } = this.props
    const { cover, status, space, toward, is_collect: isCollect, open_time } = room

    const { showYear, year, releaseDate } = this.state

    // 兼容字段代码
    const hasIsCollect = Object.keys(room).includes('is_collect')
    const roomNo = room.room_no || room.no
    const priceTitle = room.price_title || room.price
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    const grayBg = {
      backgroundColor: "#F8F8F8",
      borderRadius: "12px"
    }
    const tag = ROOM_STATUS_DIST[status]

    // 设置图片宽高，方便七牛云格式化图片

    return (
      <Board
        className={classNames('room', className)}
        styleName={{ height: Taro.pxTransform(height) }}
      >
        <View className='at-row mt-3' style={grayBg}>
          {/* 左侧 */}
          {/* 封面 */}

          {/* <View>
            {cover
              ? <Image src={src} mode='scaleToFill' style={imageStyle} />
              : <ImagePlaceholder height={height} />
            }
          </View> */}

          {/* 右侧 */}
          <View className='mx-3 my-2' style={{ width: '100%' }}>
            {/* 第一行 */}
            <View className='at-row'>
              <View className='at-row  at-row__align--center'>
                {/* 文字和标签 */}
                <View className='at-row at-row__justify--between' >
                  <View >
                    <Text className='text-bold text-huge mr-2'>
                      {roomNo}
                    </Text>
                    <Text className='text-secondary text-small my-2'>
                      {toward} {space} {(space === '' && toward === '') ? LOCALE_NO_AWARD_AND_SPACE : ''}
                    </Text>
                  </View>
                  {
                    status === 2 ? <Tag className='mt-2' type={tag.color} circle small>{showYear ? year + releaseDate + tag.message : releaseDate + tag.message}</Tag> :
                      <Tag className='mt-2' type={tag.color} circle small>{tag.message}</Tag>
                  }

                </View>

              </View>
            </View>

            {/* 第二行 */}

            <View className=' mt-3'>
              <View className='at-row at-row__justify--between  '>

                {/* 左侧 */}

                <View className='at-row text-huge text-yellow text-bold at-row__align--center'>
                  {isNaNPrice ? priceTitle : `${parseFloat(priceTitle)}`}
                  <Text className='text-normal text-yellow '>
                    {LOCALE_PRICE_UNIT}/{LOCALE_MONTH}
                  </Text>
                </View>

                {/* 右侧 */}

                {/* 爱心按钮，当 type 为 TYPE_NORMAL_ROOM 显示添加、TYPE_FAVORITE_ROOM 显示取消 */}
                <View className='mr-3'>
                  <AtIcon value='image' size='25' color={COLOR_YELLOW} onClick={this.onViewPic} ></AtIcon>
                </View>
                <View className='mr-3'>
                  {hasIsCollect
                    ? (!isCollect
                      ? <AtIcon value='heart' size='25' color={COLOR_YELLOW} onClick={this.onCreateFavorite} />
                      : <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />
                    )
                    : (type === TYPE_FAVORITE_ROOM && <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />)
                  }
                </View>
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
