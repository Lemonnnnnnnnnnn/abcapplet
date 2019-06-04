import Taro from '@tarojs/taro'
import { AtTabs } from 'taro-ui'

import { View } from '@tarojs/components'
import BaseComponent from '@components/base'
import { TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'

/**
 * Select 中的户型部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectHouseType extends BaseComponent {

  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onChange: () => { },
  }

  static defaultState = {
    // AtTabs 相关
    tabIndex: -1,
    tabItemHeight: TABS_SELECT_ITEM_HEIGHT,
  }

  state = { ...SelectHouseType.defaultProps }

  onResetState() {
    this.setState({ ...SelectHouseType.defaultState })
  }

  onTabChange(tabIndex) {
    const { items } = this.props
    const { id: house_type } = items[tabIndex]

    this.setState({ tabIndex: tabIndex })
    this.props.onChange({ payload: { house_type } })
  }

  render() {
    const { items, show } = this.props
    const { tabItemHeight, tabIndex } = this.state
    const tabsHeight = Taro.pxTransform(tabItemHeight * items.length)

    return (show && <View className='at-row at-row__justify--center'>
      <AtTabs
        scroll
        tabDirection='vertical'
        tabList={items}
        current={tabIndex}
        height={tabsHeight}
        onClick={this.onTabChange}
      />
    </View>
    )
  }
}

export default SelectHouseType
