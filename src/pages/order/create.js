// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text, Image } from '@tarojs/components'
import { AtButton, AtTag, AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as orderActions from '@actions/order'
import * as apartmentActions from '@actions/apartment'
import * as userActions from '@actions/user'

// 自定义组件
import Board from '@components/board'
import Decorate from '@components/decorate'
import OrderHeader from '@components/order-header'
import OrderRoomListMask from '@components/order-room-list-mask'
import OrderCouponMask from '@components/order-coupon-mask'
import OrderStepMask from '@components/order-step-mask'
import OrderProcessGuidance from '@components/order-process-guidance'

import ABCIcon from '@components/abc-icon'
import loginButton from '@components/login-button'
import BaseComponent from '@components/base';


// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

// 自定义变量相关
import { ORDER_HEADERS } from '@constants/order'
import { ORDER_LEASE_INSURANCE } from '@constants/picture'
import { PAGE_ORDER_SHOW, PAGE_APARTMENT_SHOW, PAGE_HOUSE_TYPE_SHOW, PAGE_ORDER_CREATE, PAGE_RISK_LANDING, PAGE_ORDER_DOWN_PAYMENT } from '@constants/page'
import { PAYLOAD_ORDER_CREATE } from '@constants/api'
import {
  LOCALE_SCHEDULED_MESSAGE,
  LOCALE_DOWN_PAYMENT,
  LOCALE_DOWN_PAYMENT_RATIO,
  LOCALE_SIGN_USER,
  LOCALE_MONTH,
  LOCALE_SEMICOLON,
  LOCALE_RENT,
  LOCALE_PRICE_UNIT,
  LOCALE_SIGN_APARTMENT,
  LOCALE_SIGN_NOW,
  LOCALE_VIEW_SERVICE_AGREEMENT,
  LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_CHANGE,
  LOCALE_ROOM_CHOISE,
  LOCALE_LOCA_ORDER_NOTICE,
  LOCALE_COUPON,
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
  LOCALE_ORDER_RISK,
  LOCALE_CHOISE,
  LOCALE_INPUT_NAME,
  LOCALE_INPUT_TEL,
  LOCALE_INPUT_IDCARD,
  LOCALE_COLON,
  LOCALE_MINUS,
  LOCALE_MONEY,
  LOCALE_APPOINTMENT_DETAIL_HAVE_NO_ROOM
} from '@constants/locale'

import buryPoint from '../../utils/bury-point'

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
    couponTotal: '',
    couponPrice: 0,
    room: {
      id: 0,
      apartment_title: "",
      no: '',
      price: '',
      risk_money: '',
      discount_price: '',
    },
    rooms: [{}],
    payload: PAYLOAD_ORDER_CREATE,
    typeId: 0,
    beginTime: '',//进入页面的时间
    userSign: false, //用户是否下定

  }


  async componentWillMount() {
    buryPoint()
    const { room_id = 0, appointment_id = 0, type_id = 0, apartment_id = 0 } = this.$router.params
    this.setState({ typeId: type_id })

    // 将进入页面的时间存进状态里
    const beginTime = new Date()
    this.setState({ beginTime })

    let data = ''
    await this.props.dispatchOrderPreview({ room_id, appointment_id, type_id, apartment_id }).then(res => {
      if (res) {
        data = res.data.data
        const selectedCoupon = data.coupon.find(i => i.is_select)
        selectedCoupon && this.setState({ payload: { coupon_user_id: selectedCoupon.id } })

        // 初始化表单
        this.setState({
          timeList: data.tenancy,
          cost_deposit: data.cost_deposit,
          room: { ...data.room },
          rooms: [...data.rooms],
          signTime: data.sign_time,
          coupon: data.coupon,
          couponTotal: data.coupon.length + LOCALE_COUPON_CAN_USED,
          payload: {
            room_id: room_id && data.room.id,
            appointment_id,
            tenancy: 12,
            name: data.user_info.name,
            mobile: data.user_info.mobile,
            id_code: data.user_info.id_no,
          }
        })

      } else this.setState({ couponTotal: LOCALE_COUPON_NONE })
    })

  }


  componentDidMount() {
    const { timeList } = this.state
    let timeListinit = JSON.parse(JSON.stringify(timeList))
    timeListinit.map(i => {
      if (i.id === 12) {
        i.active = true
      } else {
        i.active = false
      }
    })

    this.setState({
      timeList: timeListinit
    })
  }

  componentWillUnmount() {
    // //获取离开这个页面的时间
    const { beginTime, userSign } = this.state
    if (!userSign) {
      const OutTime = new Date()
      const remainTime = ((OutTime.getMinutes() - beginTime.getMinutes()) * 60) + (OutTime.getSeconds() - beginTime.getSeconds())
      this.props.dispatchApartmentRemainTime({ time: remainTime, sign: 0 })
    }
  }

  // 选择租期
  onTimeChange(id) {
    const { payload, timeList } = this.state
    const timeListLength = timeList.length
    for (var timeSelect = 0; timeSelect < timeListLength; timeSelect++) {
      if (timeList[timeSelect].id === id) {
        timeList[timeSelect].active = true
      } else {
        timeList[timeSelect].active = false
      }
    }
    this.setState({
      timeList,
      payload: { ...payload, tenancy: id }
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

    const { appointment_id = 0, type_id = 0 } = this.$router.params
    const { payload } = this.state
    const { data: { data } } = await this.props.dispatchOrderPreview({ room_id: id, appointment_id, type_id })

    let [worthText, couponPrice] = ['', '']

    for (let i = 0; i < data.coupon.length; i++) {
      if (data.coupon[i].is_select) {
        if (data.coupon[i].coupon_type === 1) {
          worthText = data.coupon[i].worth * 100
          worthText = worthText.toString()
          if (worthText[worthText.length - 1] === '0') {
            worthText = worthText[0]
          }
          couponPrice = worthText + LOCALE_ACTIVITY_TYPE_SIMPLE_DISCOUNT
        } else {
          worthText = parseFloat(data.coupon[i].worth)
          couponPrice = LOCALE_PRICE_SEMICOLON + worthText
        }
        break
      }
    }

    const selectedCoupon = data.coupon.find(i => i.is_select)
    selectedCoupon && this.setState({ payload: { coupon_user_id: selectedCoupon.id } })

    this.setState({
      couponPrice,
      showRoomList: false,
      payload: {
        ...payload,
        room_id: id,
      },
      room: { ...data.room },
      rooms: [...data.rooms],
      coupon: [...data.coupon]
    })

  }

  // 选择优惠券
  onSelectCoupon(id, price) {
    const { payload } = this.state
    const { appointment_id = 0, type_id = 0, apartment_id = 0 } = this.$router.params
    const { room_id } = payload

    this.setState({
      showCouponList: false,
      payload: { ...payload, coupon_user_id: id },
      couponPrice: price,
    })

    this.props.dispatchOrderPreview({ room_id, appointment_id, type_id, apartment_id, coupon_user_id: id }).then(res => {
      const { data: { data } } = res
      this.setState({ coupon: data.coupon, room: data.room })
    })
  }

  onSearchRoom({ detail: { value } }) {
    const { room_id = 0, appointment_id = 0, type_id = 0, apartment_id = 0 } = this.$router.params
    this.props.dispatchOrderPreview({ room_id, appointment_id, type_id, apartment_id, search_key: value }).then(res => {
      const { data: { data } } = res
      this.setState({ rooms: data.rooms })
    })
  }


  // 显示房间列表
  onShowRoomList() {
    this.setState({ showRoomList: true })
  }

  // 显示优惠券列表
  onShowCouponList() {
    const { payload: { room_id } } = this.state

    room_id ? this.setState({ showCouponList: true }) : Taro.showToast({ title: LOCALE_CHOISE_ROOM_FIRST, icon: 'none' })
  }

  // 打开流程引导窗口
  onShowProcessMask() {
    this.setState({ showProcessMask: true })
  }

  // 关闭弹窗
  onCloseMask() {
    this.setState({ showProcessMask: false, showCouponList: false, showRoomList: false })
  }

  // 检查数据
  onCheckPayload() {
    const { payload } = this.state
    const { room_id, name, mobile, id_code, tenancy } = payload
    let judgeArr = [
      { title: LOCALE_NAME, value: name },
      { title: LOCALE_TEL, value: mobile },
      { title: LOCALE_IDCARD, value: id_code },
      { title: LOCALE_RENT_DATE, value: tenancy },
      { title: LOCALE_APPOINTMENT_APARTMENT, value: room_id },
    ]


    try {
      judgeArr.forEach(i => {
        if (!i.value) {
          Taro.showToast({
            icon: 'none',
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
  onOrderCreate() {
    const { payload, typeId } = this.state

    if (!this.onCheckPayload()) return;

    //获取离开这个页面的时间
    const { beginTime } = this.state
    const OutTime = new Date()
    const remainTime = ((OutTime.getMinutes() - beginTime.getMinutes()) * 60) + (OutTime.getSeconds() - beginTime.getSeconds())
    this.setState({ userSign: true })
    this.props.dispatchApartmentRemainTime({ time: remainTime, sign: 1 })

    // 执行下定操作并进行跳转
    this.props.dispatchOrderCreate(payload).then(({ data: { data } }) => {
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
    const { payload, room, rooms, showRoomList, disabled, timeList, cost_deposit,
      showCouponList, couponTotal, couponPrice, coupon, showProcessMask } = this.state
    const { name, mobile, id_code: idCode, room_id } = payload
    const { no: roomNo, discount_price: discountPrice, price, apartment_title: apartmentTitle, risk_money, id, coupon_money } = room

    return (
      <View>
        {/* 修改房间 */}

        <OrderRoomListMask
          rooms={rooms}
          show={showRoomList}
          onSelectRoom={this.onSelectRoom}
          onSearchRoom={this.onSearchRoom}
          onClose={this.onCloseMask}
          className='apartment-order-room-mask'
        />

        {/* 选择优惠券 */}
        <OrderCouponMask
          show={showCouponList}
          onClose={this.onCloseMask}
          couponList={coupon}
          onSelectCoupon={this.onSelectCoupon}
        />

        {/* 流程引导mask */}
        <OrderStepMask show={showProcessMask} onClose={this.onCloseMask} />

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

          <View className='mb-2'>
            <Text className='text-bold text-huge'>{LOCALE_SCHEDULED_MESSAGE}</Text>
          </View>

          {/* 预订公寓 */}
          <Board className='px-3 py-2 mb-3'>
            {/* 内容头部 */}
            <View className='pb-2 border-bottom at-row at-row__justify--between'>
              <View>
                <View className='at-row at-row__align--center'>
                  <View className='border-decorate border-decorate-yellow' style={{ height: Taro.pxTransform(36) }}></View>
                  <View className='ml-2 text-normal text-secondary'>{LOCALE_SIGN_APARTMENT}</View>
                </View>
              </View>

              {
                room_id && <View onClick={this.onShowRoomList} className='at-col at-col-3' style={{ height: '100%' }}>
                  <View className='at-row at-row__align--center at-row__justify--end'>
                    <View className='text-secondary text-small'>{LOCALE_CHANGE}</View>
                    <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon>
                  </View>
                </View>
              }


            </View>

            {/* 具体内容 */}

            {
              room_id
                ? <View className='at-row at-row__align--center at-row__justify--between'>
                  <View>
                    <View className='at-row at-row__align--center'>
                      <View className='pt-3 ml-3 pb-1'>
                        <View className=' text-normal'>{apartmentTitle}{roomNo}</View>
                        {rooms.length !== 0 && <View className='text-normal  mt-1'>
                          {LOCALE_RENT}{LOCALE_SEMICOLON}
                          <Text className='text-normal'>{LOCALE_PRICE_SEMICOLON}</Text>
                          <Text className='text-huge'>{discountPrice}</Text>
                          {LOCALE_PRICE_UNIT}/{LOCALE_MONTH}
                        </View>}
                      </View>
                    </View>
                  </View>
                </View>

                : <View className='apartment-order-room'>
                  <View className='text-center text-large mt-2'>{LOCALE_ROOM_CHOISE}</View>
                  <View className='mt-3 at-row at-row__justify--center mb-2' style={{ width: '100%' }}>
                    <AtButton
                      circle
                      className='btn-yellow active'
                      onClick={this.onShowRoomList}
                    >{LOCALE_CHOISE}</AtButton>
                  </View>
                </View>
            }



          </Board>

          {/* 租期*/}
          <Board className='px-3 py-2  mb-3'>
            {/* 内容头部 */}
            <View className='py-1'>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View >
                  <View className='at-row'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>{LOCALE_RENT_DATE}</View>
                  </View>
                </View>

                <View className='at-col-4 at-row'>
                  {timeList.map((item, index) => (
                    <View className='at-row at-row__justify--around ml-2 ' key={index}>
                      <AtTag
                        type='primary'
                        size='small'
                        name={item.name}
                        active={item.active}
                        circle
                        onClick={this.onTimeChange.bind(this, item.id)}
                      >{item.name}</AtTag>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </Board>

          {/* 预订人 */}
          <Board className='px-3 py-2 mb-3'>
            {/* 内容头部 */}
            <View className='pb-2 border-bottom'>
              <View className='at-row at-row at-row__align--center'>
                <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                <View className='ml-2 text-normal text-secondary'>{LOCALE_SIGN_USER}</View>
              </View>
            </View>

            {/* 具体内容 */}
            <View>
              <View className='at-row at-row__align--center pt-2'>
                <View class='at-col-3 text-normal text-secondary'>
                  {LOCALE_NAME}
                </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={name} placeholder={LOCALE_INPUT_NAME} onInput={this.onNameInput} />
                </View>
              </View>
              <View className='at-row at-row__align--center pt-2'>
                <View class='at-col-3 text-normal text-secondary'>
                  {LOCALE_TEL}
                </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={mobile} placeholder={LOCALE_INPUT_TEL} onInput={this.onMobileInput} />
                </View>
              </View>
              <View className='at-row at-row__align--center pt-2'>
                <View class='at-col-3 text-normal text-secondary'>
                  {LOCALE_IDCARD}
                </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={idCode} placeholder={LOCALE_INPUT_IDCARD} onInput={this.onIdCodeInput} />
                </View>
              </View>
            </View>
          </Board>

          {/* 优惠券 */}
          <Board className='px-3 py-2 mb-3'>
            <View className='py-1' onClick={this.onShowCouponList}>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View>
                  <View className='at-row'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>{LOCALE_COUPON}</View>
                  </View>
                </View>

                <View>

                  <View className='text-small'>
                    <View className='at-row at-row__align--center'>
                      <View className='apartment-order-coupon-icon mr-2'>
                        <View>{couponPrice || couponTotal}</View>
                        <View className='apartment-order-coupon-icon-angle vertical-center' style={{ left: Taro.pxTransform(-10) }}></View>
                        <View className='apartment-order-coupon-icon-angle vertical-center' style={{ right: Taro.pxTransform(-10) }}></View>
                      </View>
                      <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon>
                    </View>
                  </View>

                </View>
              </View>
            </View>

          </Board>

          {/* 风险金 */}
          <Board className='px-3 py-2 mb-3 apartment-order-lease-insurance'>
            <View onClick={this.onNavigateToRisk} className='at-row at-row__justify--between at-row__align--center'>
              <Image src={ORDER_LEASE_INSURANCE} className='picture' ></Image>
              <View className='text-small'>{LOCALE_ORDER_RISK}</View>
              <View className='text-bold '>
                <View className='at-row at-row__align--end'>
                  <View className='text-small mb-1'>{LOCALE_PRICE_SEMICOLON}</View>
                  <View className='text-huge'>{room_id && risk_money}</View>
                </View>
              </View>
            </View>
          </Board>

          {/* 定金 */}
          <View className='my-3'>
            <View className='at-row at-row__align--start at-row__justify--between '>
              <View>
                <View className='text-brand text-super text-bold'>{LOCALE_DOWN_PAYMENT}</View>
                {!cost_deposit && <View className='text-normal text-secondary mt-1'>{LOCALE_DOWN_PAYMENT_RATIO}</View>}
              </View>
              <View>
                <View className='text-brand text-super text-bold'>{LOCALE_PRICE_SEMICOLON}{room_id ? price : 0}</View>
                {room_id && coupon_money && <View className='text-normal text-secondary mt-1'>{LOCALE_COUPON}{LOCALE_COLON}{LOCALE_MINUS}{LOCALE_MONEY}{parseInt(coupon_money)}</View>}
              </View>
            </View>
          </View>

          {/* 提示信息 */}
          <View className='text-secondary text-normal text-center mt-5 mb-3'>{LOCALE_LOCA_ORDER_NOTICE}</View>

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
