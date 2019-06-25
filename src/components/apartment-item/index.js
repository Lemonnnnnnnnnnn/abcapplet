// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon, AtTag } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'
import ImagePlaceholder from '@components/image-placeholder'

// 自定义常量
import { TYPE_NORMAL_APARTMENT } from '@constants/apartment'
import { COLOR_YELLOW } from '@constants/styles'
import { TYPE_FAVORITE_HOUSE_TYPE, TYPE_FAVORITE_APARTMENT } from '../../../dist/constants/apartment';

class ApartmentItem extends BaseComponent {
  static defaultProps = {
    type: '',
    width: 573,
    height: 346,
    apartment: {},
    className: '',
  }

  onDeleteFavorite() {
    const { type, apartment } = this.props
    const { id } = apartment

    let payload = {}
    switch (type) {
      case TYPE_FAVORITE_HOUSE_TYPE: payload = { type_id: id }; break;
      case TYPE_FAVORITE_APARTMENT: payload = { id: id }; break;
    }

    this.props.onDeleteFavorite({ payload })
  }

  render() {
    const {
      width,
      height,
      className,
      apartment,
      type,
    } = this.props

    const {
      cbd, desc,
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
      height: `${Taro.pxTransform(height)}`,
    }

    // 格式化价格
    const price = priceTitle ? parseInt(priceTitle) : 0

    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover}?imageView2/1/w/${width}/h/${height}`

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

          {/* 爱心按钮，当 type 为 favorite-house-type、favorite-apartment 时显示 */}
          {type !== TYPE_NORMAL_APARTMENT && <View
            onClick={this.onDeleteFavorite}
            className='apartment-header-favorite'
          >
            <AtIcon value='heart-2' size='40' color={COLOR_YELLOW} />
          </View>}
        </View>
        <View className='apartment-content mx-3 py-3'>
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
      </View>
    )
  }
}

export default ApartmentItem
