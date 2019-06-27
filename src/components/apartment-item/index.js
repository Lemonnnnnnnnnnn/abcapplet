// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtTag } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'

// NPM 包
import classNames from 'classnames'

// 自定义常量
import {
  TYPE_NORMAL_APARTMENT,
  TYPE_FAVORITE_APARTMENT,
  TYPE_FAVORITE_HOUSE_TYPE,
  TYPE_CBD_APARTMENT,
  TYPE_ACTIVITY_APARTMENT,
} from '@constants/apartment'

import {
  COLOR_YELLOW,
} from '@constants/styles'

class ApartmentItem extends BaseComponent {
  static defaultProps = {
    type: '',
    width: 573,
    height: 346,
    minWidth: 330,
    minHeight: 222,
    mini: false,
    apartment: {},
    className: '',
  }

  onCreateFavorite() {
    const payload = this.getFavoritePayload()
    this.props.onCreateFavorite({ payload })
  }

  onDeleteFavorite() {
    const payload = this.getFavoritePayload()
    this.props.onDeleteFavorite({ payload })
  }

  getFavoritePayload() {
    const { type, apartment } = this.props
    const { id } = apartment

    switch (type) {
      case TYPE_CBD_APARTMENT:
      case TYPE_ACTIVITY_APARTMENT:
      case TYPE_FAVORITE_HOUSE_TYPE:
      case TYPE_NORMAL_APARTMENT: return { type_id: id }
      case TYPE_FAVORITE_APARTMENT: return { id: id }
    }
  }

  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { className, apartment, type, } = this.props

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const {
      cbd, desc,
      is_collect,
      cover, rules, title,
      price_title: priceTitle,
      apartment_title: apartmentTitle
    } = apartment

    const imageStyle = {
      width: '100%',
      height: '100%',
    }

    const headerStyle = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    // 格式化价格
    const price = priceTitle ? parseInt(priceTitle) : 0

    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover}?imageView2/1/w/${width}/h/${height}`

    // 是否已收藏
    // 当 type 为 favorite-house-type、favorite-apartment 时显示，isCollect为ture时显示
    const isCollect = type === TYPE_FAVORITE_APARTMENT
      || type === TYPE_FAVORITE_HOUSE_TYPE
      || is_collect

    return (
      <View className={classNames('apartment', className)}>
        {/* 户型头部 */}
        <View className='apartment-header' style={headerStyle}>

          {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
          {cover
            ? <Image src={src} mode='scaleToFill' style={imageStyle} />
            : <ImagePlaceholder height={height} />
          }

          {/* 户型 cbd 列表 */}
          <View className='apartment-header-title'>
            {cbd && cbd.map(i => i.title).toString().replace(',', ' / ')}
          </View>

          {/* 户型种类，公寓类型是没有这个字段的 */}
          {title && <View className='apartment-header-type'>{title}</View>}

          {/* 爱心按钮*/}
          {!mini && (isCollect
            ? <View className='apartment-header-favorite' onClick={this.onDeleteFavorite}>
              <AtIcon value='heart-2' size='40' color={COLOR_YELLOW} />
            </View>
            : <View className='apartment-header-favorite' onClick={this.onCreateFavorite}>
              <AtIcon value='heart' size='40' color={COLOR_YELLOW} />
            </View>)
          }
        </View>

        {/* 正常内容 */}
        {!mini && <View className='apartment-content mx-3 py-3'>
          {/* 优惠活动 */}
          <View>{rules.map(i =>
            <AtTag className='mr-1 p-1 text-mini' key={i.id} size='small' circle>{i.title}</AtTag>
          )}
          </View>

          {/* 价格和公寓名称 */}
          <View className='at-row at-row__justify--between at-row__align--end'>
            <View className='apartment-content-main'>
              <View className='text-bold mt-2'>{apartmentTitle}</View>
              {desc && <View className='text-muted mt-2 text-small apartment-content-desc'>{desc}</View>}
            </View>
            <View className='text-yellow text-huge text-bold'>{price === 0 ? '暂无数据' : `￥${price}起`}</View>
          </View>
        </View>
        }

        {/* 迷你内容 */}
        {mini && <View className='apartment-content mx-2 py-2'>
          {/* 价格和公寓名称 */}
          <View className='mb-2 text-large'>{apartmentTitle}</View>
          <View className='text-yellow text-huge text-bold'>{price === 0 ? '暂无数据' : `￥${price}起`}</View>
        </View>
        }
      </View>
    )
  }
}

export default ApartmentItem
