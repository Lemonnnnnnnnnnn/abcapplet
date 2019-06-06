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
  MESSAGE_RENT,
  MESSAGE_LOCATION,
  MESSAGE_HOUSE_TYPE,
  // MESSAGE_AUTO_SORT
} from '@constants/message'

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
class Select extends BaseComponent {
  static options = {
    addGlobalClass: true,
  }

  static defaultProps = {
    top: 0,
    isFixed: false,

    cbdDist: [],
    priceDist: [],
    autoSortDist: [],
    houseTypeDist: [],
    specialSelectDist: [],
    onApartmentPayloadChange: console.log
  }

  state = {
    latitude: 0,
    longitude: 0,
    headerIndex: '',
    payload: PAYLOAD_APARTMENT_LIST,
  }

  // 创建子组件关联，用于重置数据
  refSelectCbd = (node) => this.selectCbd = node
  refSelectPrice = (node) => this.selectPrice = node
  refSelectSpecial = (node) => this.selectSpecial = node
  refSelectHouseType = (node) => this.selectHouseType = node

  onPayloadRest() {
    this.selectCbd.onResetState()
    this.selectPrice.onResetState()
    this.selectSpecial.onResetState()
    this.selectHouseType.onResetState()
    this.onPayloadChange({ payload: PAYLOAD_APARTMENT_LIST })
  }

  onPayloadChange({ payload }) {
    const { latitude, longitude } = this.state
    this.setState({
      payload: {
        ...this.state.payload,
        ...payload,
        latitude,
        longitude,
      }
    })
  }

  onPayloadChangeAndRefresh({ payload }) {
    // 不要直接用 onPayloadChange
    // 因为是异步 ！！！
    payload = {
      ...this.state.payload,
      ...payload,
    }

    this.setState({ payload, headerIndex: '' })
    this.props.onApartmentPayloadChange({ payload })
  }

  async componentWillMount() {
    const { latitude, longitude } = await Taro.getLocation()
    this.setState({ latitude, longitude })
  }

  onHeaderClick(headerIndex) {
    this.setState({ headerIndex })
  }

  onMasksClick() {
    // TODO 传递搜索数据
    this.setState({ headerIndex: '' })
  }

  render() {
    const { headerIndex } = this.state
    const {
      // 吸附相关
      top,
      isFixed,
      className,

      // 字典相关
      cbdDist,
      priceDist,
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
    const header = [
      { message: MESSAGE_LOCATION, show: cbdDist.length > 0, index: 'cbd' },
      { message: MESSAGE_HOUSE_TYPE, show: houseTypeDist.length > 0, index: 'house-type' },
      { message: MESSAGE_RENT, show: houseTypeDist.length > 0, index: 'price' },
      // TODO 接口未提供
      // { message: MESSAGE_AUTO_SORT, index: 'auto-sort' },
    ]

    return (
      <View className={classNames(rootClassName, classObject, className)} style={selectStyle}>
        {/* 头部 */}
        <SelectHeader
          className='mb-2'
          items={header}
          index={headerIndex}
          onClick={this.onHeaderClick}
        />

        {/* 对应内容 */}
        <SelectCbd
          ref={this.refSelectCbd}
          items={cbdDist}
          show={headerIndex === 'cbd'}
          onChange={this.onPayloadChange}
        />

        {/* 对应内容 */}
        <SelectHouseType
          ref={this.refSelectHouseType}
          items={houseTypeDist}
          show={headerIndex === 'house-type'}
          onChange={this.onPayloadChange}
        />

        {/* 对应内容 */}
        <SelectPrice
          ref={this.refSelectPrice}
          items={priceDist}
          show={headerIndex === 'price'}
          onChange={this.onPayloadChange}
        />

        {/* 按钮 */}
        <SelectButton
          show={headerIndex !== ''}
          onResetClick={this.onPayloadRest}
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
    )
  }
}

export default Select
