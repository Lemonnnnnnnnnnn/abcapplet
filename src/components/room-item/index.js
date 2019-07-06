// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
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

  render() {
    const { className, room, width, height, type, isSign } = this.props
    const { cover, status, space, toward, is_collect: isCollect } = room

    // 兼容字段代码
    const hasIsCollect = Object.keys(room).includes('is_collect')
    const roomNo = room.room_no || room.no
    const priceTitle = room.price_title || room.price
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    const imageStyle = {
      width: Taro.pxTransform(width),
      height: Taro.pxTransform(height),
      'border-radius': Taro.pxTransform(10),
    }

    const tag = ROOM_STATUS_DIST[status]

    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    return (
      <Board
        className={classNames('room', className)}
        styleName={{ height: Taro.pxTransform(height) }}
      >
        <View className='at-row'>
          {/* 左侧 */}
          <View>
            {/* 封面 */}
            {cover
              ? <Image src={src} mode='scaleToFill' style={imageStyle} />
              : <ImagePlaceholder height={height} />
            }
          </View>

          {/* 右侧 */}
          <View className='mx-3 my-2' style={{ width: '100%' }}>
            {/* 第一行 */}
            <View className='at-row'>
              <View className='at-row at-row__justify--between at-row__align--center'>
                {/* 文字和标签 */}
                <View className='at-row'>
                  <View className='text-bold text-huge mr-2'>{roomNo}</View>
                  <Tag type={tag.color} circle small>{tag.message}</Tag>
                </View>

                <View>
                  {/* 爱心按钮，当 type 为 TYPE_NORMAL_ROOM 显示添加、TYPE_FAVORITE_ROOM 显示取消 */}
                  {hasIsCollect
                    ? (!isCollect
                      ? <AtIcon value='heart' size='25' color={COLOR_YELLOW} onClick={this.onCreateFavorite} />
                      : <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />
                    )
                    : (type === TYPE_FAVORITE_ROOM && <AtIcon value='heart-2' size='25' color={COLOR_YELLOW} onClick={this.onDeleteFavorite} />)
                  }
                </View>
              </View>
            </View>

            {/* 第二行 */}
            <View className='at-row'>
              <View className='text-secondary text-small my-2'>
                {toward} {space} {(space === '' && toward === '') ? LOCALE_NO_AWARD_AND_SPACE : ''}
              </View>
            </View>

            {/* 第三行 */}
            <View className='at-row'>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View className='text-huge text-yellow text-bold'>
                  {isNaNPrice ? priceTitle : `${parseFloat(priceTitle)}${LOCALE_PRICE_UNIT}/${LOCALE_MONTH}`}
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
