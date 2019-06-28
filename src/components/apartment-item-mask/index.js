// Taro 组件
import Taro from '@tarojs/taro'
import { AtAvatar } from 'taro-ui'
import { View } from '@tarojs/components'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class ApartmentItemMask extends BaseComponent {

  static defaultProps = {
    apartment: {}
  }

  render() {
    const { apartment } = this.props

    return (
      <View className='apartment-item-mask mb-2 p-3'>

        <View className='at-row at-row__justify--between at-row__align--center'>
          {/* 左边 */}
          <View className='at-row at-row__align--center'>
            <AtAvatar circle image={apartment.cover} />
            <View className='ml-2'>
              <View className='text-normal'>{apartment.title}</View>
              <View className='text-small text-secondary mt-2'>{apartment.one_word}</View>
            </View>
          </View>

          {/* 右边 */}
          <View>
            <ABCIcon icon='chevron_right' color={COLOR_GREY_2} />
          </View>
        </View>

      </View>

    )
  }
}

export default ApartmentItemMask
