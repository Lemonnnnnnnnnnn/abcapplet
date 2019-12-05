import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { AtIcon } from 'taro-ui'

import { View, Text } from '@tarojs/components'
import BaseComponent from '@components/base'
import { COLOR_YELLOW, COLOR_GREY_2, FONT_SIZE_XS } from '@constants/styles'

/**
 * Select 中的头部部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectHeader extends BaseComponent {
  static defaultProps = {
    index: '',
    items: [],
    size: FONT_SIZE_XS,
    onClick: () => { }
  }

  render() {
    const { index, items, onClick, size, className } = this.props
    const rootClassName = ['select-header']
    const classObject = {}

    return (<View className={classNames(rootClassName, classObject, className)}>
      <View className='at-row at-row__justify--around'>
        {items.map((item, key) => (item.show &&
          <View key={key} onClick={onClick.bind(this, item.index)}>
            <Text className={[
              'text-normal mr-2',
              `text-${index == item.index ? 'yellow' : 'muted'}`
            ]}
            >
              {item.message}
            </Text>
            <AtIcon
              size={size}
              color={index == item.index ? COLOR_YELLOW : COLOR_GREY_2}
              value={index == item.index ? 'chevron-up' : 'chevron-down'}
            />
          </View>
        ))}
      </View>
    </View>)
  }
}

export default SelectHeader
