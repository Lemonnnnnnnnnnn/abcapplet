import Taro from '@tarojs/taro'
import { ScrollView } from '@tarojs/components'

import Tag from '@components/tag'
import BaseComponent from '@components/base'
import { CAROUSEL_SELECT_SPECIAL_HEIGHT } from '@constants/styles'

/**
 * Select 中的特殊需求部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectSpecial extends BaseComponent {

  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onChange: () => { },
  }

  static defaultState = {
    selectedItems: [],
    scrollViewHeight: CAROUSEL_SELECT_SPECIAL_HEIGHT,
  }

  state = { ...SelectSpecial.defaultState }

  onResetState() {
    this.setState({ ...SelectSpecial.defaultState })
  }

  onSelectedItemsChange({ name }) {
    let { selectedItems } = this.state

    selectedItems = selectedItems.includes(name)
      ? selectedItems.filter(i => i !== name)
      : [...selectedItems, name]

    this.setState({ selectedItems })
    this.props.onChange({ payload: { tags: selectedItems.toString() } })
  }

  render() {
    const { items, show } = this.props
    const { selectedItems, scrollViewHeight } = this.state

    const style = { height: Taro.pxTransform(scrollViewHeight) }

    return (show &&
      <ScrollView
        scrollX
        style={style}
        className='my-2 ml-2 carousel-normal'
      >
        {items.map((item, key) =>
          <Tag
            key={key}
            type='special'
            className='carousel-normal-item'
            name={item.title}
            active={selectedItems.includes(item.title)}
            onClick={this.onSelectedItemsChange}
          >{item.title}</Tag>
        )}
      </ScrollView>
    )
  }
}

export default SelectSpecial
