import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

import { PAYLOAD_APARTMENT_LIST } from '@constants/api'
import SelectHeader from '@components/select/header'
import SelectPrice from '@components/select/price'
import SelectButton from '@components/select/button'
import SelectHouseType from '@components/select/house-type'
import SelectCbd from '@components/select/cbd'
import SelectSpecial from '@components/select/special'
import BaseComponent from '@components/base'
import Masks from '@components/masks'

import {
  LOCALE_RENT,
  LOCALE_LOCATION,
  LOCALE_HOUSE_TYPE,
  // LOCALE_AUTO_SORT
} from '@constants/locale'

/**
 * 公寓选择器
 * ----------------------------
 **说明
 * 1.这部分基本上都是固定死的，继续拆分组件的意义不大可复用性较低。
 * 2.细分组件还是可以做的，有利于代码的可读性。
 * 3.样式还可以重新整理一下，部分样式为旧代码。
 * ----------------------------
 **实现
 * 1.位置
 * 2.户型
 * 3.租金
 * 4.特殊需求
 * ----------------------------
 **未实现
 * 智能推荐：由于后端接口未提供，
 * 如果提供后可以参照户型部分，
 * 使用 AtTabs 来完成
 * ----------------------------
 */
let type_floor = 0
let type_room = 0

class Select extends BaseComponent {
  static options = {
    addGlobalClass: true,
  }

  static defaultProps = {
    top: 0,
    show: true,
    showCbd: true,
    isFixed: false,

    cbdDist: [],
    priceDist: [],
    autoSortDist: [],
    houseTypeDist: [],
    specialSelectDist: [],
    onApartmentPayloadChange: () => { }
  }

  state = {
    payload: {},
    latitude: 0,
    longitude: 0,
    headerIndex: '',

  }

  // 创建子组件关联，用于重置数据

  refSelectCbd = (node) => this.selectCbd = node
  refSelectPrice = (node) => this.selectPrice = node
  refSelectHouseType = (node) => this.selectHouseType = node

  onPayloadReset() {
    this.selectCbd && this.selectCbd.onResetState()
    this.selectPrice && this.selectPrice.onResetState()
    this.selectHouseType && this.selectHouseType.onResetState()
    this.onPayloadChange({ payload: {} })
  }

  onPayloadChange({ payload }) {
    const { latitude, longitude } = this.state
    this.setState({ payload: { ...payload, latitude, longitude } })
  }


  onPaylocadHouseTypeChange({ payload }) {

    for (var i in payload) {
      if (i === "type_floor") {
        type_floor = payload[i]
      } else if (i === "type_room") {
        type_room = payload[i]
      } else {
        return false
      }
    }
    this.setState({ payload: { type_floor: type_floor, type_room: type_room } })
  }



 async onPayloadChangeAndRefresh({ payload = {} }) {
    // 因为是异步，不要直接用 onPayloadChange ！！！
    payload = { ...this.state.payload, ...payload }
    this.setState({ payload, headerIndex: '' })
    await this.props.onApartmentPayloadChange({ payload })

    setTimeout(()=>{
      Taro.createSelectorQuery()
      .in(this.$scope)
      .select('.selectTab')
      .boundingClientRect(rect =>
        Taro.pageScrollTo({
          scrollTop:parseInt(rect.right) *2.27,
          duration:0
      })
      ).exec()
    },500)


  }

  async componentWillMount() {
    const { latitude, longitude } = await Taro.getLocation()
    this.setState({ latitude, longitude })
  }

  //筛选器选择下拉
  onHeaderClick(headerIndex) {
    this.setState({ headerIndex })
    this.props.onSearchTrue()
  }

  onMasksClick() {
    // TODO 传递搜索数据
    this.setState({ headerIndex: '' })
  }

  render() {
    const { headerIndex } = this.state
    const {
      // 选项控制
      show,
      showCbd,

      // 吸附相关
      top,
      isFixed,
      className,

      // 字典相关
      cbdDist,
      priceDist,//预算
      // autoSortDist,
      houseTypeDist,
      specialSelectDist,
    } = this.props


    // 吸附相关样式
    const rootClassName = ['select']
    const selectStyle = { top: `${top - 1}px` }
    const selectIsFixed = isFixed || headerIndex !== ''
    const classObject = { 'select-fixed': selectIsFixed }

    // Header 相关
    let header = []

    showCbd && cbdDist.length && header.push({ message: LOCALE_LOCATION, show: cbdDist.length > 0, index: 'cbd' })

    if (houseTypeDist.length !== 0) {
      header = [
        ...header,
        { message: LOCALE_HOUSE_TYPE, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'house-type' },
        { message: LOCALE_RENT, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'price' },
        // TODO 接口未提供 { message: LOCALE_AUTO_SORT, index: 'auto-sort' },
      ]
    }


    return (show &&<View className='selectTab'>
        <View className={classNames(rootClassName, classObject, className)} style={selectStyle}>
          {/* 头部 */}
          <SelectHeader
            className='mb-2'
            items={header}
            index={headerIndex}
            onClick={this.onHeaderClick}
          />
          {/* 对应内容(想住的区域) */}
          <SelectCbd
            ref={this.refSelectCbd}
            items={cbdDist}
            show={headerIndex === 'cbd'}
            onChange={this.onPayloadChange}
          />

          {/* 对应内容(房子类型) */}
          <SelectHouseType
            ref={this.refSelectHouseType}
            items={houseTypeDist}
            show={headerIndex === 'house-type'}
            onChange={this.onPaylocadHouseTypeChange}
          />

          {/* 对应内容（预期价格） */}
          <SelectPrice
            ref={this.refSelectPrice}
            items={priceDist}
            show={headerIndex === 'price'}
            onChange={this.onPayloadChange}
          />

          {/* 按钮 */}
          <SelectButton
            show={headerIndex !== ''}
            onResetClick={this.onPayloadReset}
            onConfirmClick={this.onPayloadChangeAndRefresh}
          />

          {/* 特殊需求 */}
          <SelectSpecial
            show={headerIndex === ''}
            ref={this.refSelectSpecial}
            items={specialSelectDist}
            onChange={this.onPayloadChangeAndRefresh}
          />

          {/* 遮罩层 */}
          <Masks show={headerIndex !== ''} onClick={this.onMasksClick}></Masks>
        </View >
      </View>
    )
  }
}

export default Select
