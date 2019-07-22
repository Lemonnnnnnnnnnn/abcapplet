// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义变量
import {
    LOCALE_PRICE_UNIT,
    LOCALE_MONTH,
    LOCALE_MONEY,
    LOCALE_QI,
} from '@constants/locale'

class ApartmentTypeItem extends BaseComponent {
  static defaultProps = {
    item: { cover: '' },
    width: 100,
    height: 100,
  }

  onNavigation() {
    const { item: { url } } = this.props
    Taro.navigateTo({ url })
  }

  render() {
    let { item, width, height } = this.props
    const { cover, price_title: priceTitle, title, desc } = item

    // 格式化价格
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))

    return <View className='py-2' onClick={this.onNavigation}>
      <View className='at-row'>
        {cover && <Image
          src={`${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`}
          style={{ width: `${width}px`, height: `${height}px`, 'border-radius': '20px' }}
        />}
        <View className='at-col ml-3'>
          <View
            className='at-row at-row__justify--between'
            style={{ 'flex-direction': 'column', height: '100%' }}
          >
            <View>
              <View className='text-huge text-bold'>{title}</View>
              <View className='text-secondary text-small'>{desc || '暂无描述'}</View>
            </View>
            <View>
              <View className='text-yellow'>{isNaNPrice ? priceTitle : `${LOCALE_MONEY}${parseFloat(priceTitle)}${LOCALE_QI}`}</View>
            </View>
          </View>
        </View>
      </View>
    </View>
  }
}

export default ApartmentTypeItem
