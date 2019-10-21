import Taro from '@tarojs/taro'
import classNames from 'classnames'
import { AtTabs } from 'taro-ui'

import { View, Text, Icon, ScrollView } from '@tarojs/components'
import BaseComponent from '@components/base'
import { TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'

/**
 * Select 中的位置部分
 * ----------------------------
 **参数
 * ----------------------------
 */

const KEYWORD_FJ = 'FJ' // 附近
const KEYWORD_XZQ = 'XZQ' // 行政区
const KEYWORD_DT = 'DT' // 地铁
const KEYWORD_BRT = 'BRT' // BRT

class SelectCbd extends BaseComponent {
  static defaultProps = {
    index: '',
    items: [],
    show: false,
    onChange: () => { },
  }

  static defaultState = {
    areaSelected: 0,
    placeSelected: [],

    // AtTabs 相关
    cbdIndex: -1,
    areaIndexs: [],
    placeIndex: [],
    tabItemHeight: 100,
    cbdIndexItem:0
  }

  state = { ...SelectCbd.defaultState }

  onResetState() {
    this.setState({ ...SelectCbd.defaultState })
  }

  onCbdChange(cbdIndex) {
    const { items } = this.props
    console.log(items)
    console.log('start'+ cbdIndex)
    this.setState({ cbdIndex })
    console.log(this.props.dists)
    // console.log(this.props.dists.cbd_list[cbdIndex])
  }

  onAreaChange(areaIndex) {
    const { items } = this.props
    const { cbdIndex, areaIndexs } = this.state
    const item = items[cbdIndex]

    const id = items[cbdIndex].list[areaIndex].id

    areaIndexs[cbdIndex] = areaIndex
    this.setState({ areaIndexs })

    // if (item.keyword === KEYWORD_FJ || item.keyword === KEYWORD_XZQ) {
      this.setState({ areaSelected: id,cbdIndexItem:item.id })
      this.onPropsOnChange({ areaSelected: id })
    // }
  }

  onPropsOnChange({ areaSelected = null, placeSelected = null }) {

    areaSelected = areaSelected || this.state.areaSelected
    placeSelected = placeSelected || this.state.placeSelected

    placeSelected.length?
    this.props.onChange({
      value:
      {
        cbdIndex:this.state.cbdIndexItem,
        distance: areaSelected,
        cbd: [...placeSelected,].toString()
      }
    }):
    this.props.onChange({
      value:
      {
        cbdIndex:this.state.cbdIndexItem,
        distance: areaSelected,
        cbd: areaSelected.toString()
      }
    })
  }

  onPlaceChange(id) {
    let { placeSelected } = this.state

    placeSelected = placeSelected.includes(id)
      ? placeSelected.filter(i => i != id)
      : [...placeSelected, id]

    this.setState({ placeSelected })
    this.onPropsOnChange({ placeSelected })
  }

  render() {
    const { cbdIndex, areaIndexs, tabItemHeight, placeSelected } = this.state
    const { show, items, className } = this.props

    const rootClassName = ['at-row', 'select-cbd' ,'mb-3']
    const classObject = {}
    const tabsHeight = Taro.pxTransform(tabItemHeight * items.length)

    const cbd = items
    const areaIndex = typeof (areaIndexs[cbdIndex]) == "undefined" ? -1 : areaIndexs[cbdIndex]
    const area = cbdIndex != -1 && cbd[cbdIndex].list
    const plase = areaIndex != -1 && area[areaIndex].list

    return (show && <View className={classNames(rootClassName, classObject, className)}>
      <View className='select-cbd-item '>
        {cbd && <AtTabs
          scroll
          tabDirection='vertical'
          className='mt-2'
          tabList={cbd || []}
          current={cbdIndex}
          height={tabsHeight}
          onClick={ this.onCbdChange}
        />
        }
      </View>
{/* 位置二级选择框 */}
      <View className='select-cbd-item'>
        {cbdIndex != -1 && <AtTabs
          scroll
          tabDirection='vertical'
          tabList={area || []}
          className='mt-2'
          current={areaIndex}
          height={tabsHeight}
          onClick={this.onAreaChange}
        />}
      </View>

      <View className='select-cbd-item ml-2'>
        {plase &&
          <ScrollView scrollY style={{ height: tabsHeight }}>{plase.map(i =>
            <View  key={i.id}
              onClick={this.onPlaceChange.bind(this, i.id)}
              className={`ml-3 mt-3 multi-${placeSelected.includes(i.id) ? 'selected' : 'unselect'}`}
            >
              <View className='at-row'>
                <View>
                  <Icon  />
                </View>
                <View>
                  <Text className='mt-1 text-small'>{i.title}</Text>
                </View>

              </View>

            </View>)}
          </ScrollView>
        }
      </View>

    </View>)
  }
}

export default SelectCbd
