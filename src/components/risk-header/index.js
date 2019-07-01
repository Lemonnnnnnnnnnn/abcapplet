// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import Borad from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import { COLOR_BLACK } from '@constants/styles'

class RiskHeader extends BaseComponent {

  static defaultProps = {
    items: [],
  }

  render() {
    const { items, className } = this.props
    return (
      <Borad color='black' className={className}>
        <View className='px-3 py-4'>
          <View className='at-row at-row__justify--between'>
            {items.map(i => <View key={i.id}>
              <View className='at-row at-row__align--center'>
                <View className='btn-risk-header-item at-row at-row__justify--center at-row__align--center'>
                  <ABCIcon icon={i.icon} color={COLOR_BLACK} size='30' />
                </View>
                <View className='text-white text-normal ml-2'>
                  <View>{i.title}</View>
                  <View className='mt-2'>{i.desc}</View>
                </View>
              </View>
            </View>
            )}
          </View>
        </View>
      </Borad>
    )
  }
}

export default RiskHeader
