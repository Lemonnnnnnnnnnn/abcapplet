// Taro 相关
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { COLOR_YELLOW } from '@constants/styles'

// 自定义组件
import BaseComponent from '@components/base'
import Borad from '@components/board'
import { LOCALE_MY_ORDER } from '@constants/locale'

class UserOrderOptions extends BaseComponent {
  static defaultProps = {
    lists: [],
    size: 30,
  }

  onNavigation({ url }) {
    Taro.navigateTo({ url })
  }

  render() {
    const { lists, size, className } = this.props

    return (
      <Borad className={`${className} p-3`}>
        <View className='text-bold border-bottom pb-3 text-normal'>
          {LOCALE_MY_ORDER}
        </View>
        <View className='at-row at-row__justify--between pt-3'>
          {lists.map(i =>
            <View key={i.id} className='mx-2'>
              <View className='button-order at-row at-row__justify--center at-row__align--center'>
                <AtIcon
                  value={i.icon}
                  color={COLOR_YELLOW}
                  size={size}
                />
              </View>
              <View className='at-row at-row__justify--center'>
                <View className='text-small mt-2'>{i.title}</View>
              </View>
            </View>
          )}
        </View>
      </Borad>
    )
  }
}

export default UserOrderOptions
