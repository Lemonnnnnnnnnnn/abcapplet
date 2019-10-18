// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'
import { LOCALE_MONEY, LOCALE_QI } from '@constants/locale'
// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

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
    type === 'HouseType' ? this.props.dispatchApartmentHouseDataPost({ type: 4 }) : this.props.dispatchApartmentDataPost({ type: 4 })
    const { item: { url } } = this.props
    Taro.navigateTo({ url })
  }


  render() {
    let { item, width, height, houseType, index } = this.props
    const { cover, price_title: priceTitle, title, desc, discount_price_title } = item

    const wrapStyle = {
      overflow: 'hidden',
      position: 'relative'
    }

    const maskStyle = {
      background: "#000",
      opacity: 0.5,
      width: '100%',
      height: Taro.pxTransform(height),
      position: 'absolute',
      zIndex: 20
    }

    const fontStyle = {
      color: "#fff",
      position: 'absolute',
      zIndex: 30,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      height: Taro.pxTransform(height)
    }

    // 格式化价格
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))


    return <View className='apartment-type-item' style={wrapStyle} onClick={this.onNavigation}>
      {
        houseType && index === 0 &&
        <View className='at-row at-row__justify--center'>
          <View style={maskStyle}></View>
          <View style={fontStyle} className='text-normal'>您正在浏览此户型</View>
        </View>
      }
      <View style={{ width: '100%', height: Taro.pxTransform(height), overflow: 'hidden', position: 'relative' }}>
        {
          cover && <Image
            src={cover}
            style={{ width: '100%', height: '100%' }}
          >
          </Image>
        }
      </View>

      <View className='mt-2' style={{ height: '100%' }}>
        <View >
          <View className='text-normal text-bold ml-2'>{title}</View>
          <View className='text-secondary text-small ml-2 overtext' >{desc || '暂无描述'}</View>
        </View>
        <View className=''>
          {
            discount_price_title ?
              <View className='text-yellow text-mini ml-1 ' >{`${LOCALE_MONEY}${discount_price_title}${LOCALE_QI}`}</View> :
              <View className='text-yellow text-normal mt-3 mb-2  ml-1'>{`${LOCALE_MONEY}${priceTitle}${LOCALE_QI}`}</View>
          }
          {/* 原价 */}
          {discount_price_title && <View className='at-row  at-row__align--center ml-2 mb-1'  style='text-decoration:line-through;' >
            <View className='text-muted text-mini' >原价：</View>
            <Text className=' text-mini text-muted'>
              {priceTitle ? priceTitle : `${LOCALE_MONEY}${priceTitle}`}元
            </Text>
            <Text className='text-mini text-muted '>{LOCALE_QI}</Text>
          </View>}
        </View>
      </View>
    </View>
  }
}

export default ApartmentTypeItem
