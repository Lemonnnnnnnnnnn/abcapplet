import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon, AtTabs, AtTabsPane, AtTag } from 'taro-ui'

import { COLOR_YELLOW, COLOR_GREY_2 } from '@constants/styles'
import { MESSAGE_RENT, MESSAGE_LOCATION, MESSAGE_HOUSE_TYPE, MESSAGE_AUTO_SORT } from '@constants/message'
import { PAYLOAD_APARTMENT_LIST } from '@constants/api'
import AutoSlider from '@components/slider'

class Select extends Component {
  static options = {
    addGlobalClass: true,
  }

  static defaultProps = {
    top: 0,
    size: 10,
    isFixed: false,
    baseItemHeight: 60,
    cbdDist: [],
    priceDist: [],
    autoSortDist: [],
    houseTypeDist: [],
    specialSelectDist: [],
  }

  state = {
    selectIndex: '',
    payload: PAYLOAD_APARTMENT_LIST,

    // cbd 相关
    cbdFirstIndex: -1,
    cbdSecondIndex: -1,
    cbdThirdIndex: -1,
    cbdMessage: '',

    // houseType 相关
    houseTypeIndex: -1,
    houseMessage: '',

    // price 相关
    priceIndex: -1,
    priceMessage: '',
    priceLow: 1000,
    priceHigh: 10000,
    priceDefaultLow: 1000,
    priceDefaultHigh: 10000,
  }

  setCBDFirstIndex(index) {
    this.setState({
      cbdFirstIndex: index,
      cbdSecondIndex: '',
    })
  }

  setCBDSecondIndex(index) {
    this.setState({
      cbdSecondIndex: index,
      cbdThirdIndex: '',
    })
  }

  setHouseTypeIndex(houseTypeIndex) {
    const { payload } = this.state
    const { houseTypeDist } = this.props

    const houseType = houseTypeDist[houseTypeIndex]
    this.setState({
      houseTypeIndex,
      houseMessage: houseType.title,
      payload: { ...payload, house_type: houseType.id },
    })
  }

  setPriceIndex(priceIndex) {
    const { payload } = this.state
    const { priceDist } = this.props

    const price = priceDist[priceIndex]

    this.setState({
      priceLow: price.low,
      priceHigh: price.high,
      priceIndex,
      priceMessage: price.title,
      payload: { ...payload, price_low: price.low, price_high: price.high },
    })
  }

  setCBDThirdIndex(cbdThirdIndex) {
    const { cbdDist } = this.props
    const { cbdFirstIndex, cbdSecondIndex, payload } = this.state
    const first = cbdDist[cbdFirstIndex]
    const second = first.list[cbdSecondIndex]
    const third = second.list[cbdThirdIndex]

    this.setState({
      selectIndex: '',
      cbdThirdIndex,
      cbdMessage: third.title,
      payload: { ...payload, cdb: third.id },
    })
  }

  setIndex(index) {
    this.setState({ selectIndex: this.state.selectIndex !== index ? index : '' })
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

  render() {
    const {
      selectIndex,
      houseTypeIndex, houseMessage,
      cbdFirstIndex, cbdSecondIndex, cbdThirdIndex, cbdMessage,
      priceIndex, priceMessage, priceDefaultLow, priceDefaultHigh, priceLow, priceHigh,
    } = this.state
    const { size, cbdDist, houseTypeDist, priceDist, specialSelectDist, autoSortDist, baseItemHeight, isFixed, className, top } = this.props

    const dists = [
      { message: cbdMessage === '' ? MESSAGE_LOCATION : cbdMessage, items: cbdDist, index: 'cbd' },
      { message: houseMessage === '' ? MESSAGE_HOUSE_TYPE : houseMessage, items: houseTypeDist, index: 'houseType' },
      { message: priceMessage === '' ? MESSAGE_RENT : priceMessage, items: priceDist, index: 'price' },
      { message: MESSAGE_AUTO_SORT, items: autoSortDist, index: 'autoSort' },
    ]

    return (<View className={className}>
      <View className={`select ${isFixed || selectIndex !== '' ? 'select-fixed' : ''}`} style={{ 'top': `${top - 1}px` }}>
        <View className='select-header at-row at-row__justify--around'>
          {dists.map(dist => (dist.items.length &&
            <View key={dist.index} onClick={this.setIndex.bind(this, dist.index)}>
              <Text
                className={`text-${selectIndex == dist.index ? 'yellow' : 'muted'} text-small mr-2`}
              >{dist.message}</Text>

              <AtIcon
                size={size}
                color={selectIndex == dist.index ? COLOR_YELLOW : COLOR_GREY_2}
                value={selectIndex == dist.index ? 'chevron-up' : 'chevron-down'}
              />
            </View>
          ))}
        </View>

        <View className='select-content'>
          {selectIndex !== '' &&
            <View className='mt-2'>
              {/* 位置列表 */}
              {selectIndex == 'cbd' &&
                <AtTabs
                  scroll height={Taro.pxTransform(baseItemHeight * cbdDist.length)} tabDirection='vertical'
                  tabList={cbdDist} current={cbdFirstIndex} onClick={this.setCBDFirstIndex}
                >
                  {cbdDist.map((i, firstIndex) =>
                    <AtTabsPane key={i.id} index={firstIndex} current={cbdFirstIndex} tabDirection='vertical' >
                      {firstIndex === cbdFirstIndex &&
                        <AtTabs
                          scroll current={cbdSecondIndex} tabDirection='vertical'
                          onClick={this.setCBDSecondIndex} tabList={cbdDist[firstIndex].list} height={Taro.pxTransform(baseItemHeight * cbdDist.length)}
                        >
                          <AtTabs
                            className='cbd-third'
                            scroll height={Taro.pxTransform(baseItemHeight * cbdDist.length)} tabDirection='vertical'
                            tabList={cbdDist[firstIndex].list[cbdSecondIndex].list}
                            current={cbdThirdIndex}
                            onClick={this.setCBDThirdIndex}
                          ></AtTabs>
                        </AtTabs>
                      }
                    </AtTabsPane>
                  )}
                </AtTabs>
              }

              {/* 户型 */}
              {selectIndex == 'houseType' && <View className='at-row at-row__justify--center'>
                <AtTabs
                  scroll height={Taro.pxTransform(baseItemHeight * houseTypeDist.length)} tabDirection='vertical'
                  tabList={houseTypeDist} current={houseTypeIndex} onClick={this.setHouseTypeIndex}
                />
              </View>
              }

              {/* 价格 */}
              {selectIndex == 'price' && <View>
                <View className='at-row at-row__justify--center'>
                  <AtTabs
                    scroll height={Taro.pxTransform(baseItemHeight * priceDist.length)} tabDirection='vertical'
                    tabList={priceDist} current={priceIndex} onClick={this.setPriceIndex}
                  />
                </View>
                <View className='mt-2 pb-2 at-row at-row__justify--around text-small'>
                  <View>￥租金</View>
                  <View class='text-yellow'>
                    ￥{priceLow}-{priceHigh === priceDefaultHigh ? `不限` : `￥${priceHigh}`}
                  </View>
                  <View>￥不限</View>
                </View>
                <View className='mt-3'>
                  <AutoSlider
                    step='100'
                    min={priceDefaultLow}
                    max={priceDefaultHigh}
                    minValue={priceLow}
                    maxValue={priceHigh}
                    onChangeValue={this.onPriceValueChange}
                  />
                </View>
              </View>
              }
            </View>
          }
        </View>

        {selectIndex == '' &&
          <View className='mt-2 at-row at-row__justify--around'>
            {specialSelectDist.map((item, index) =>
              <AtTag className='mr-1 p-1 text-mini'
                type='primary'
                key={index} size='small' circle active
              >{item.title}</AtTag>
            )}
          </View>
        }
      </View>

      {/* 遮罩层 */}
      {selectIndex !== '' && <View className='page-mask minus-ml-2' onClick={this.setIndex.bind(this, '')} />}
    </View>
    )
  }
}

export default Select
