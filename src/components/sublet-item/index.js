// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_PRICE_SEMICOLON, LOCALE_QI } from '@constants/locale'
import { SUBLET_FINISH_NEW } from '@constants/picture'


class SubletItem extends BaseComponent {

  render() {
    const { item } = this.props

    return (
      <View className='at-row at-row__justify--center py-2 inherit-Width ' >
        {item && <View className='at-row page-sublet' onClick={this.props.onNavicatSublet.bind(this, item)}>
          <View className='at-col-5 position-relative'>
            <Image src={item.url} className='inherit-Width inherit-Height page-sublet-image' mode='aspectFill'></Image>
            {item && item.status === 2 && <View className=' position-absolute inherit-Width inherit-Height mask' >
              <Image
                className='vertical-level-center'
                src={SUBLET_FINISH_NEW}
                mode='widthFix'
                style={{ height: Taro.pxTransform(130), width: Taro.pxTransform(130) }}
              />
            </View>}
          </View>

          <View className='at-col at-col-6 m-2 position-relative' >
            <View className='text-normal text-bold  at-col--wrap'>
              <Text >
                {item.title}
              </Text>

            </View>
            <View className='at-row at-row__justify--between position-absolute' style={{ bottom: '2%' }} >
              <View className='at-col-4 page-middile text-small page-house'>{item.dict_house_type}</View>
              <View className='at-col-6 at-row'>
                <View className='text-yellow'>{LOCALE_PRICE_SEMICOLON}</View>
                <View className='text-yellow'>{parseInt(item.price)}</View>
                <View className='text-yellow text-small mt-2 ml-1'>{LOCALE_QI}</View>
              </View>
            </View>
          </View>

        </View>}

      </View>
    )
  }
}

export default SubletItem
