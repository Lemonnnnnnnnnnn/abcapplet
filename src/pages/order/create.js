// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as orderActions from '@actions/order'
import * as apartmentActions from '@actions/apartment'
import * as userActions from '@actions/user'

// 自定义组件
import Decorate from '@components/decorate'
import OrderRoomListMask from '@components/order-room-list-mask'
import OrderStepMask from '@components/order-step-mask'

import loginButton from '@components/login-button'
import BaseComponent from '@components/base';


// 自定义变量相关
import { PAGE_ORDER_SHOW, PAGE_RISK_LANDING, PAGE_ORDER_DOWN_PAYMENT } from '@constants/page'
import { PAYLOAD_ORDER_CREATE, PAYLOAD_ORDER_DETAIL } from '@constants/api'
import {
  LOCALE_SIGN_NOW,
  LOCALE_LOCA_ORDER_NOTICE,
  LOCALE_LOCA_ORDER_NOTICE2,
  LOCALE_COUPON_NONE,
  LOCALE_CHOISE_ROOM_FIRST,
  LOCALE_NAME,
  LOCALE_TEL,
  LOCALE_IDCARD,
  LOCALE_RENT_DATE,
  LOCALE_APPOINTMENT_APARTMENT,
  LOCALE_COUPON_CAN_USED,
  LOCALE_USER_HAVENT_INPUT,
  LOCALE_OH,
  LOCALE_ORDER_LOGIN_NOT,
  LOCALE_APPOINTMENT_DETAIL_HAVE_NO_ROOM,
  LOCALE_HAVE_CHOISE,
  LOCALE_ZHANG,
  LOCALE_LOGIN_FIRST,
  LOCALE_NONE
} from '@constants/locale'

import buryPoint from '../../utils/bury-point'
import OrderProcessGuidance from './components/order-process-guidance'
import OrderMessage from './components/order-message'
import OrderCouponMask from './components/order-coupon-mask'


@connect(state => state, {
  ...orderActions,
  ...apartmentActions,
  ...userActions,
})


class OrderCreate extends BaseComponent {
  config = {
    navigationBarTitleText: '签约下定',
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    signTime: '',

    timeList: [],
    disabled: false,
    showRoomList: false,
    showCouponList: false,
    showProcessMask: false,

    couponTotal: LOCALE_COUPON_NONE,
    couponPrice: 0,
    coupon: [],
    couponIdArr: [],

    couponStorage: [],
    couponIdArrStorage: [],
    couponPriceStorage: 0,

    rooms: [{}],
    payload: PAYLOAD_ORDER_CREATE,
    payloadDetail: PAYLOAD_ORDER_DETAIL,
    beginTime: '',//进入页面的时间
    userSign: false, //用户是否下定
    cityId: 350200
  }


  async componentDidMount() {
    // 初始化获取详情Payload
    const { room_id = 0, appointment_id = 0, type_id = 0, apartment_id = 0 } = this.$router.params
    let { payloadDetail } = this.state
    payloadDetail = { ...payloadDetail, room_id, appointment_id, type_id, apartment_id }

    let data = ''
    await this.props.dispatchOrderPreview(payloadDetail).then(res => {
      if (res) {
        data = res.data.data

        const timeList = data.tenancy
        timeList.map(i => i.id === 12 ? i.active = true : i.active = false)
        const payload = {
          room_id: room_id && data.room.id,
          appointment_id,
          tenancy: 12,
          name: data.user_info.name,
          mobile: data.user_info.mobile,
          id_code: data.user_info.id_no,
        }
        // 初始化表单
        this.setState({
          timeList,
          cost_deposit: data.cost_deposit,
          room: { ...data.room },
          rooms: [...data.rooms],
          signTime: data.sign_time,
          coupon: data.coupon.map(i => ({ ...i, active: false, canChoise: true })),
          couponStorage: data.coupon.map(i => ({ ...i, active: false, canChoise: true })),
          couponTotal: data.coupon.length + LOCALE_COUPON_CAN_USED,
          payload,
          payloadDetail
        })
      } else this.setState({ couponTotal: LOCALE_COUPON_NONE })
    })
  }

  componentWillMount() {
    // 数据埋点
    buryPoint()
    // 将进入页面的时间存进状态里
    const beginTime = new Date()
    this.setState({ beginTime })
    const { citycode } = Taro.getStorageSync('user_info')
    citycode && this.setState({ cityId: citycode })
  }

  componentWillUnmount() {
    // //获取离开这个页面的时间
    const { cityId } = this.state
    const { beginTime, userSign } = this.state
    if (!userSign) {
      const OutTime = new Date()
      const remainTime = ((OutTime.getMinutes() - beginTime.getMinutes()) * 60) + (OutTime.getSeconds() - beginTime.getSeconds())
      this.props.dispatchApartmentRemainTime({ time: remainTime, sign: 0, city_id: cityId })
    }
  }

  // 选择租期
  onTimeChange(id) {
    let { payloadDetail } = this.state
    const { payload, timeList } = this.state

    const timeListClone = timeList.map(i => ({ ...i, active: i.active = i.id === id ? true : false }))
    payloadDetail = { ...payloadDetail, tenancy: id, coupon_user_id: '' }

    // 置空优惠券列表
    this.props.dispatchOrderPreview(payloadDetail).then(({ data: { data } }) => {
      this.setState({
        timeList: timeListClone,
        room: { ...data.room },
        payload: { ...payload, tenancy: id },
        payloadDetail,
        couponTotal: data.coupon.length + LOCALE_COUPON_CAN_USED,
        couponPrice: 0,
        coupon: data.coupon.map(i => ({ ...i, active: false, canChoise: true })),
        couponIdArr: [],
      })
    })
  }

  // 名字
  onNameInput({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      payload: { ...payload, name: value }
    })
  }
  // 电话
  onMobileInput({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      payload: { ...payload, mobile: value }
    })
  }
  // 身份证
  onIdCodeInput({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      payload: { ...payload, id_code: value }
    })
  }
  // 选择房间
  async onSelectRoom(id) {
    let { payload, payloadDetail } = this.state
    payloadDetail = { ...payloadDetail, room_id: id, coupon_user_id: '' }
    const { data: { data } } = await this.props.dispatchOrderPreview(payloadDetail)

    // 置空优惠券列表
    this.setState({
      showRoomList: false,
      room: { ...data.room },
      rooms: [...data.rooms],
      payload: { ...payload, room_id: id, },
      couponTotal: data.coupon.length + LOCALE_COUPON_CAN_USED,
      couponPrice: 0,
      coupon: data.coupon.map(i => ({ ...i, active: false, canChoise: true })),
      payloadDetail,
      couponIdArr: [],
    })
  }



  // 选择优惠券
  onSelectCoupon(id, price) {
    const { coupon, couponIdArr } = this.state
    // 浅克隆数组
    let couponIdArrClone = JSON.parse(JSON.stringify(couponIdArr))
    let couponClone = JSON.parse(JSON.stringify(coupon))

    // 遍历coupon数组，找出选中的数组，把active设为相反数
    let coupon_link_id = null

    couponClone.forEach(i => {
      if (i.id === id) {
        i.active = !i.active
        coupon_link_id = i.coupon_link_id
      }
      if (i.active) {
        const index = couponIdArrClone.indexOf(i.id)
        index === -1 && couponIdArrClone.push(i.id)
      } else {
        const index = couponIdArrClone.indexOf(i.id)
        index > -1 && couponIdArrClone.splice(index, 1)
      }
    })

    // 把不同组优惠券的canChoise设为false，如果link_id为0，其他所有优惠券默认canChoise为false
    coupon_link_id
      ? couponClone.forEach(i => {
        if (i.coupon_link_id !== coupon_link_id) {
          i.canChoise = false
        }
        // 如果没有选中任何优惠券  把所有的canChoise设为true
        if (!couponIdArrClone.length) i.canChoise = true
      })
      : couponClone.forEach(i => {
        i.active ? i.canChoise = true : i.canChoise = false
        if (!couponIdArrClone.length) i.canChoise = true
      })


    this.setState({
      coupon: couponClone,
      couponPriceStorage: price,
      couponIdArr: couponIdArrClone,
    })

  }
  // 选择优惠券按钮的确认按钮
  onSelectCouponConfirm() {
    let { payloadDetail } = this.state
    const { coupon, couponIdArr, couponPriceStorage, payload } = this.state

    // 生成id字符串
    const coupon_user_id = couponIdArr.toString()
    // 生成Tag展示文本 couponPrice
    let couponPrice = ''
    couponIdArr.length > 1
      ? couponPrice = LOCALE_HAVE_CHOISE + couponIdArr.length + LOCALE_ZHANG
      : couponPrice = couponPriceStorage

    payloadDetail = { ...payloadDetail, coupon_user_id }


    // 发送请求
    this.props.dispatchOrderPreview(payloadDetail).then(res => {
      const { data: { data } } = res
      this.setState({
        room: data.room,
        showCouponList: false,
        couponStorage: coupon,
        couponIdArrStorage: couponIdArr,
        couponPrice: couponIdArr.length ? couponPrice : data.coupon.length + LOCALE_COUPON_CAN_USED,
        payloadDetail,
        payload: { ...payload, coupon_user_id },
      })
    })
  }

  onSearchRoom({ detail: { value } }) {
    let { payloadDetail } = this.state
    payloadDetail = { ...payloadDetail, search_key: value }
    this.props.dispatchOrderPreview(payloadDetail).then(res => {
      const { data: { data } } = res
      this.setState({ rooms: data.rooms })
    })
  }

  // 显示房间列表
  onShowRoomList() {
    Taro.getStorageSync('user_info').token
      ? this.setState({ showRoomList: true })
      : Taro.showToast({ title: LOCALE_LOGIN_FIRST, icon: LOCALE_NONE })
  }

  // 显示优惠券列表
  onShowCouponList() {
    const { payload: { room_id } } = this.state
    room_id
      ? this.setState({ showCouponList: true })
      : Taro.showToast({ title: LOCALE_CHOISE_ROOM_FIRST, icon: LOCALE_NONE })
  }

  // 关闭优惠券列表
  onCloseCouponList() {
    const { couponStorage, couponIdArrStorage } = this.state
    this.setState({
      showCouponList: false,
      coupon: couponStorage,
      couponIdArr: couponIdArrStorage
    })
  }

  // 打开流程引导窗口
  onShowProcessMask() {
    this.setState({ showProcessMask: true })
  }

  // 关闭弹窗
  onCloseMask() {
    this.setState({ showProcessMask: false, showRoomList: false })
  }

  // 检查数据
  onCheckPayload() {
    const { payload } = this.state
    const { room_id, name, mobile, id_code, tenancy } = payload
    let judgeArr = [
      { title: LOCALE_APPOINTMENT_APARTMENT, value: room_id },
      { title: LOCALE_NAME, value: name },
      { title: LOCALE_TEL, value: mobile },
      { title: LOCALE_IDCARD, value: id_code },
      { title: LOCALE_RENT_DATE, value: tenancy },
    ]

    try {
      judgeArr.forEach(i => {
        if (!i.value) {
          Taro.showToast({
            icon: LOCALE_NONE,
            title: LOCALE_USER_HAVENT_INPUT + i.title + LOCALE_OH,
          })
          throw LOCALE_USER_HAVENT_INPUT + i.title + LOCALE_OH
        }
      })
    } catch (e) {
      return false
    }
    return true
  }

  // 创建(立即预定)
  async onOrderCreate() {
    const { payload, cityId } = this.state
    if (!this.onCheckPayload()) return;

    //获取离开这个页面的时间
    const { beginTime } = this.state
    const OutTime = new Date()
    const remainTime = ((OutTime.getMinutes() - beginTime.getMinutes()) * 60) + (OutTime.getSeconds() - beginTime.getSeconds())
    this.setState({ userSign: true })
    await this.props.dispatchApartmentRemainTime({ time: remainTime, sign: 1, city_id: cityId })

    // 执行下定操作并进行跳转
    await this.props.dispatchOrderCreate(payload).then(({ data: { data } }) => {
      this.setState({ disabled: true })
      Taro.navigateTo({ url: `${PAGE_ORDER_SHOW}?id=${data.order.id}` })
    })
  }

  onNavigation() {
    Taro.navigateTo({ url: PAGE_ORDER_DOWN_PAYMENT })
  }

  onNavigateToRisk() {
    Taro.navigateTo({ url: PAGE_RISK_LANDING })
  }


  render() {
    const { payload, room, rooms, showRoomList, disabled, timeList, cost_deposit, showCouponList, couponTotal,
      couponPrice, coupon, showProcessMask } = this.state

    return (
      <View>
        {/* 修改房间 */}

        <OrderRoomListMask
          rooms={rooms}
          show={showRoomList}
          onSelectRoom={this.onSelectRoom}
          onSearchRoom={this.onSearchRoom}
          onClose={this.onCloseMask}
          className='order-room-mask'
        />

        {/* 选择优惠券 */}
        <OrderCouponMask
          show={showCouponList}
          onClose={this.onCloseCouponList}
          onSelectCouponConfirm={this.onSelectCouponConfirm}
          couponList={coupon}
          onSelectCoupon={this.onSelectCoupon}
        />

        {/* 流程引导mask */}
        <OrderStepMask
          show={showProcessMask}
          onClose={this.onCloseMask}
        />

        <View className='p-3'>
          {/* 背景底色 */}
          <Decorate height='180' />

          {/* 头部 */}
          <OrderProcessGuidance onShowProcessMask={this.onShowProcessMask} />

          {/* 如果用户没有登录 */}
          {!Taro.getStorageSync('user_info').token &&
            <View className='mb-3'>
              <loginButton params={this.$router.params} color='black' message={LOCALE_ORDER_LOGIN_NOT} />
            </View>
          }

          {/* 预定信息 */}
          <OrderMessage
            payload={payload}
            room={room}
            rooms={rooms}
            timeList={timeList}
            couponPrice={couponPrice}
            couponTotal={couponTotal}
            cost_deposit={cost_deposit}

            onShowRoomList={this.onShowRoomList}
            onTimeChange={this.onTimeChange}
            onNameInput={this.onNameInput}
            onMobileInput={this.onMobileInput}
            onIdCodeInput={this.onIdCodeInput}
            onShowCouponList={this.onShowCouponList}
            onNavigateToRisk={this.onNavigateToRisk}
          />

          {/* 提示信息 */}
          <View className='text-secondary text-normal text-center mt-5 '>{LOCALE_LOCA_ORDER_NOTICE}</View>
          <View className='text-secondary text-normal text-center mb-3'>{LOCALE_LOCA_ORDER_NOTICE2}</View>

          {/* 立即预订 */}
          {rooms.length !== 0 ? <View className='at-row'>
            <View className='at-col-12'>
              <AtButton
                circle
                disabled={Taro.getStorageSync('user_info').token ? disabled : true}
                className={Taro.getStorageSync('user_info').token ? 'btn-yellow active' : 'btn-grey btn-light-writh'}
                onClick={this.onOrderCreate}
              >{LOCALE_SIGN_NOW}</AtButton>
            </View>
          </View>
            :
            <View className='at-row'>
              <View className='at-col-12'>
                <AtButton
                  circle
                  disabled={disabled}
                  className='btn-grey btn-light-writh'

                >{LOCALE_APPOINTMENT_DETAIL_HAVE_NO_ROOM}</AtButton>
              </View>
            </View>}
        </View>
      </View>
    )
  }
}

export default OrderCreate
