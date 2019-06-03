import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { Atbutton, AtIcon, AtTabs, AtTabsPane } from 'taro-ui'

import { COLOR_YELLOW, COLOR_GREY_2 } from '@constants/styles'
import { MESSAGE_RENT, MESSAGE_LOCATION, MESSAGE_HOUSE_TYPE, MESSAGE_AUTO_SORT } from '@constants/message'
import { PAYLOAD_APARTMENT_LIST } from '@constants/api'

class Select extends Component {
  static options = {
    addGlobalClass: true
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

  render() {
    const { selectIndex, cbdFirstIndex, cbdSecondIndex, cbdThirdIndex, cbdMessage, houseTypeIndex, houseMessage, priceIndex, priceMessage } = this.state
    const { size, cbdDist, houseTypeDist, priceDist, specialSelectDist, autoSortDist, baseItemHeight, isFixed, className, top } = this.props

    const dists = [
      { message: cbdMessage === '' ? MESSAGE_LOCATION : cbdMessage, items: cbdDist, index: 'cbd' },
      { message: houseMessage === '' ? MESSAGE_HOUSE_TYPE : houseMessage, items: houseTypeDist, index: 'houseType' },
      { message: MESSAGE_RENT, items: priceDist, index: 'price' },
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
              {selectIndex == 'price' && <View className='at-row at-row__justify--center'>
                <AtTabs
                  scroll height={Taro.pxTransform(baseItemHeight * priceDist.length)} tabDirection='vertical'
                  tabList={priceDist} current={priceIndex} onClick={this.setPriceIndex}
                />
              </View>
              }
            </View>
          }
        </View>
        {/* <View class='select-bottom'>
        <ScrollView scrollX>
          {specialSelectDist.map((item, index) => <Atbutton key={index}>{item.id}</Atbutton>)}
        </ScrollView>
      </View> */}
      </View>

      {/* 遮罩层 */}
      {selectIndex !== '' && <View className='page-mask minus-ml-2' onClick={this.setIndex.bind(this, '')} />}
    </View>
    )
  }
}

export default Select
