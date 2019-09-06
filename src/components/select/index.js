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
let type_floorStorage = 0
let type_roomStorage = 0


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
    payload: {
      distance: 0, latitude: 0, longitude: 0,
      price_high: 0, price_low: 0, tags: "", type_floor: 0, type_room: 0
    },
    latitude: 0,
    longitude: 0,
    headerIndex: '',
  }

  // 创建子组件关联，用于重置数据

  refSelectCbd = (node) => this.selectCbd = node
  refSelectPrice = (node) => this.selectPrice = node
  refSelectHouseType = (node) => this.selectHouseType = node

  onPayloadReset() {
    const { cityCode, cbdId } = this.props
    this.selectCbd && this.selectCbd.onResetState()
    this.selectPrice && this.selectPrice.onResetState()
    this.selectHouseType && this.selectHouseType.onResetState()
    this.onPayloadChange({ payload: {} })
    this.setState({
      payload: {
        cbd: cbdId ? cbdId : '', distance: 0, latitude: 0, longitude: 0, city: cityCode,
        price_high: 0, price_low: 0, tags: "", type_floor: 0, type_room: 0
      }
    })
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  onPayloadChange({ value }) {
    const { payload } = this.state
    this.setState({ payload: { ...payload, ...value } })
  }


  onPaylocadHouseTypeChange({ value }) {
    const { payload } = this.state

    for (var i in value) {
      if (i === "type_floor") {
        type_floorStorage = value[i]
      } else if (i === "type_room") {
        type_roomStorage = value[i]
      } else {
        return false
      }
    }
    this.setState({ payload: { ...payload, type_floor: type_floorStorage, type_room: type_roomStorage } })
  }



  async onPayloadChangeAndRefresh({ payload = {} }) {
    // 因为是异步，不要直接用 onPayloadChange ！！！
    const { latitude, longitude } = this.state
    payload = { ...this.state.payload, ...payload, longitude, latitude }
    this.setState({ payload, headerIndex: '' })
    await this.props.onApartmentPayloadChange({ payload })

    setTimeout(() => {
      const currentPages = Taro.getCurrentPages()
      if (currentPages[currentPages.length - 1].route === 'pages/common/home') {
        Taro.createSelectorQuery()
          .in(this.$scope)
          .select('.selectTab')
          .boundingClientRect(rect =>
            Taro.pageScrollTo({
              scrollTop: parseInt(rect.right) * 2.27,
              duration: 0
            })
          ).exec()
      }
    }, 500)
  }

  async componentWillMount() {

    const { payload } = this.state
    const { cityCode } = this.props

    await Taro.getLocation({
      success: (res) => { this.setState({ payload: { ...payload, city: cityCode }, latitude: res.latitude, longitude: res.longitude }) },
      fail: () => { this.setState({ payload: { ...payload, city: cityCode }, latitude: 0, longitude: 0 }) }
    }).catch((err)=>{console.log(err)})
    // this.setState({ latitude, longitude, payload: { ...payload, city: cityCode } })
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

  onJudge() {
    const { showSelect } = this.props
    if (showSelect) {
      return Taro.pxTransform(92)
    } else {
      return Taro.pxTransform(-266)
    }
  }


  render() {
    const { headerIndex, payload } = this.state
    const { distance, cbd, price_high, price_low, type_floor, type_room } = payload
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
      cbdSelect,
    } = this.props


    // 吸附相关样式
    const rootClassName = ['select']
    // const selectStyle = { top: `${top - 1}px` }
    const selectIsFixed = isFixed || headerIndex !== ''
    const classObject = { 'select-fixed': selectIsFixed }

    const posiStyle = {
      top: this.onJudge()
    }

    // Header 相关
    let header = []
    let cbdMessage = []
    let houseTypeMessage = []
    let cbdStr = ""
    let type_floorStr = ""
    let type_roomStr = ""


    // 位置
    if (showCbd && cbdDist.length) {

      if (distance) {
        cbdDist[0].list.map(i => {
          if (i.id === distance) {
            cbdMessage.push(i.title)
            header.push({ message: cbdMessage, show: cbdDist.length > 0, index: 'cbd' })
          }
        })
      } else if (cbd) {
        cbdDist.map(i => {
          i.list.map(v => {
            v.list && v.list.map(k => {
              if (k.id === parseInt(cbd)) {


                if (k.title.length > 5) {
                  cbdStr = k.title.substring(0, 5) + "..."
                } else {
                  cbdStr = k.title
                }

                if (cbd.length > 3) {
                  cbdStr = k.title + "..."
                }
                cbdMessage.push(cbdStr)
                header.push({ message: cbdMessage, show: cbdDist.length > 0, index: 'cbd' })
              }
              return false
            })
          })
        })
      } else {
        header.push({ message: LOCALE_LOCATION, show: cbdDist.length > 0, index: 'cbd' })
      }
    }

    // 户型


    if (houseTypeDist.length !== 0) {
      if (type_floor || type_room) {

        houseTypeDist.floor.map(i => {
          if (i.id === type_floor) {
            type_floorStr = i.title
          }
        })

        houseTypeDist.room.map(v => {
          if (v.id === type_room) {
            type_roomStr = v.title
          }
        })

        if (type_floorStr && type_roomStr) {
          houseTypeMessage = type_floorStr + "、" + type_roomStr
        } else {
          houseTypeMessage = type_floorStr + type_roomStr
        }
        header.push({ message: houseTypeMessage, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'house-type' })
      } else {
        header.push({ message: LOCALE_HOUSE_TYPE, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'house-type' })
      }
    }

    // 租金

    if (houseTypeDist.length !== 0) {
      price_high || price_low
        ?
        header.push({ message: price_low + "~" + price_high, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'price' })
        :
        header.push({ message: LOCALE_RENT, show: houseTypeDist.room.length && houseTypeDist.floor.length, index: 'price' })
    }




    return (show &&
      <View className='selectTab' style={{ height: Taro.pxTransform(174) }} onTouchMove={this.onMaskTouchMove}>
        <View className={classNames(rootClassName, className, classObject)} style={cbdSelect ? '' : posiStyle} >
          {/* 头部 */}
          < SelectHeader
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
      </View >
    )
  }
}

export default Select
