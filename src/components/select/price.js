import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { AtTabs } from 'taro-ui'

import { View } from '@tarojs/components'
import AutoSlider from '@components/slider'
import BaseComponent from '@components/base'
import { TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'

/**
 * Select 中的价格部分
 * ----------------------------
 **参数
 * ----------------------------
 */
class SelectPrice extends BaseComponent {

  static defaultProps = {
    items: [],
    show: false,
    className: '',
    reset: false,
    onChange: () => { },
  }

  static defaultState = {
    // 租金双向选择器 相关
    step: 100,
    min: 1000,
    max: 10000,
    minValue: 1000,
    maxValue: 10000,

    // AtTabs 相关
    tabIndex: -1,
    tabItemHeight: TABS_SELECT_ITEM_HEIGHT,
  }

  state = { ...SelectPrice.defaultState }

  onResetState() {
    this.setState({ ...SelectPrice.defaultState })
  }

  onTabChange(tabIndex) {
    const { items } = this.props
    const { low: price_low, high: price_high } = items[tabIndex]
    this.setState({ minValue: price_low, maxValue: price_high, tabIndex })
    this.props.onChange({ payload: { price_low, price_high } })
  }

  onSliderChange({ minValue, maxValue }) {
    this.setState({ minValue: minValue, maxValue: maxValue, tabIndex: -1 })
    this.props.onChange({ payload: { price_low: minValue, price_high: maxValue } })
  }

  onPriceValueChange({ minValue, maxValue }) {
    const { payload } = this.state

    this.setState({
      priceIndex: -1,
      priceLow: minValue,
      priceHigh: maxValue,
      priceMessage: `${minValue}元~${maxValue}元`,
      payload: { ...payload, price_low: minValue, price_high: maxValue },
    })
  }

  onSelectPriceTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    const { show, className, items } = this.props
    const { step, min, max, minValue, maxValue, tabItemHeight, tabIndex } = this.state

    const rootClassName = []
    const classObject = {}

    const tabsHeight = Taro.pxTransform(tabItemHeight * items.length)

    return (show && items.length > 0 &&
      <View className={classNames(rootClassName, classObject, className)}>

        {/* 系统默认租金选择器 */}
        <View className='at-row at-row__justify--center'>
          <AtTabs
            scroll
            tabDirection='vertical'
            tabList={items}
            current={tabIndex}
            height={tabsHeight}
            onClick={this.onTabChange}
          />
        </View>


        {/* 自定义租金 */}
        <View className='mt-2 pb-2 at-row at-row__justify--around text-small'>
          <View>￥租金</View>
          <View class='text-yellow'>
            ￥{minValue}-{maxValue === max ? `不限` : `￥${maxValue}`}
          </View>
          <View>￥不限</View>
        </View>

        {/* 租金双向选择器 */}
        <View className='mt-3'>
          <AutoSlider
            step={step}
            min={min}
            max={max}
            minValue={minValue}
            maxValue={maxValue}
            onChangeValue={this.onSliderChange}
          />
        </View>
      </View>)
  }
}

export default SelectPrice
