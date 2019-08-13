// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'
import { pxTransform } from '../../../dist/npm/taro-ui/dist/weapp/common/utils';



class ApartmentTypeItem extends BaseComponent {
  static defaultProps = {
    item: { cover: '' },
    width: 117,
    height: 100,
  }

  onNavigation() {
    const { item: { url } } = this.props
    Taro.navigateTo({ url })
  }


  render() {
    let { item, width, height, houseType, index } = this.props
    const { cover, price_title: priceTitle, title, desc } = item

    const wrapStyle = {
      overflow: 'hidden',
      position: 'relative'
    }

    const maskStyle = {
      background: "#000",
      opacity: 0.5,
      width: '100%',
      height: Taro.pxTransform(200),
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
      height: Taro.pxTransform(200)
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
      {
        cover && <Image
          src={cover}
          style={{ width: '100%', height: Taro.pxTransform(200)}}
        >
        </Image>
      }

      <View style={{ height: '100%' }}>
        <View >
          <View className='text-normal text-bold ml-2'>{title}</View>
          <View className='text-secondary text-small ml-2'>{desc || '暂无描述'}</View>
        </View>
        <View>
          <View className='text-yellow mb-1 text-large ml-2'>
            {priceTitle}
            {
              isNaNPrice ? <View></View> : <Text className='text-small '>元/月</Text>
            }

          </View>
        </View>
      </View>
    </View>
  }
}

export default ApartmentTypeItem
