// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Borad from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import { COLOR_YELLOW } from '@constants/styles'
import { LOCALE_LOCK_NOTICE } from '@constants/locale';

class OrderHeader extends BaseComponent {

  static defaultProps = {
    items: [],
  }

  render() {
    const { items, className } = this.props
    return (
      <Borad color='black' className={className}>
        <View className='px-3 py-3'>
          <View className='at-row at-row__justify--center'>
            <View className='text-small text-secondary mb-2'>{LOCALE_LOCK_NOTICE}</View>
          </View>
          <View className='at-row at-row__justify--around'>
            {items.map(i => <View key={i.id}>
              <View className='at-row at-row__justify--center'>
                <ABCIcon icon={i.icon} color={COLOR_YELLOW} size='45' />
              </View>
              <View className='at-row at-row__justify--center mt-2'>
                <View className='text-white text-normal'>{i.title}</View>
              </View>
              <View className='at-row at-row__justify--center mt-1'>
                <View className='text-secondary text-small'>{i.desc}</View>
              </View>
            </View>
            )}
          </View>
        </View>
      </Borad>
    )
  }
}

export default OrderHeader
