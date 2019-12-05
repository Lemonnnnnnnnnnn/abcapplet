// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import {
  LOCALE_MONEY,
  LOCALE_QI,
  LOCALE_VIEWING_CURRENT_HOUSETYPE,
  LOCALE_NO_DESCRIPTION,
  LOCALE_ORIGINAL_PRICE,
  LOCALE_COLON,
  LOCALE_PRICE_UNIT
} from '@constants/locale'

@connect(state => state, {
  ...apartmentActions,
})

class ApartmentTypeItem extends BaseComponent {
  static defaultProps = {
    item: { cover: '' },
    width: 117,
    height: 200,
  }

  onNavigation() {
    const { type } = this.props
    type === 'HouseType' ? this.props.dispatchApartmentHouseDataPost({ type: 4, city_id: Taro.getStorageSync('user_info').citycode || 350200 }) : this.props.dispatchApartmentDataPost({ type: 4 })
    const { item: { url } } = this.props
    Taro.navigateTo({ url })
  }


  render() {
    let { item, width, height, houseType, index } = this.props
    const { cover, price_title: priceTitle, title, desc, discount_price_title } = item

    // 格式化价格

    return <View className='apartment-type-item wrap-Style' onClick={this.onNavigation}>
      {
        houseType && index === 0 &&
        <View className='at-row at-row__justify--center'>
          <View className='position-absolute mask inherit-Width' ></View>
          <View className='vertical-level-center text-white text-normal font'>{LOCALE_VIEWING_CURRENT_HOUSETYPE}</View>
        </View>
      }
      <View className='wrap-Style inherit-Width' style={{ height: Taro.pxTransform(height) }}>
        {
          cover && <Image
            lazyLoad
            src={cover}
            className='inherit-Width inherit-Height'
          >
          </Image>
        }
      </View>

      <View className='mt-2 inherit-Height'>
        <View >
          <View className='text-normal text-bold ml-2'>{title}</View>
          <View className='text-secondary text-small ml-2 overtext' >{desc || LOCALE_NO_DESCRIPTION}</View>
        </View>
        <View >
          {
            discount_price_title ?
              <View className='text-yellow text-mini ml-1 ' >{`${LOCALE_MONEY}${discount_price_title}${LOCALE_QI}`}</View> :
              <View className='text-yellow text-normal mt-2 mb-2  ml-1'>{`${LOCALE_MONEY}${priceTitle}${LOCALE_QI}`}</View>
          }
          {/* 原价 */}
          {discount_price_title && <View className='at-row  at-row__align--center ml-2 mb-1 text-through' >
            <View className='text-muted text-mini' >{LOCALE_ORIGINAL_PRICE + LOCALE_COLON}</View>
            <Text className=' text-mini text-muted'>
              {priceTitle ? priceTitle : `${LOCALE_MONEY}${priceTitle}`}{LOCALE_PRICE_UNIT}
            </Text>
            <Text className='text-mini text-muted '>{LOCALE_QI}</Text>
          </View>}
        </View>
      </View>
    </View>
  }
}

export default ApartmentTypeItem
