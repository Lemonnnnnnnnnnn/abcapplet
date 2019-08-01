// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'


// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as orderActions from '@actions/order'
import * as apartmentActions from '@actions/apartment'
import * as apartmentLookActions from '@actions/apartmentlook'

// NPM 包
import day from 'dayjs'

// 自定义组件
import Board from '@components/board'
import ABCIcon from '@components/abc-icon'
import Decorate from '@components/decorate'
import OrderDesc from '@components/order-desc'
import OrderTimer from '@components/order-timer'
import TabBarBoard from '@components/tab-bar-board'
import ApartmentList from '@components/apartment-list'
import OrderRoomList from '@components/order-room-list'
import OrderSignCode from '@components/order-sign-code'

// 自定义常量
import { PAGE_HOME } from '@constants/page'
import { COLOR_WHITE } from '@constants/styles'

import {

  ORDER_STATUS_DIST,
  ORDER_STATUS_CANCEL,
  ORDER_STATUS_SUCCESS,

  ORDER_STATUS_LOCK_FAIL,
  ORDER_STATUS_PAY_WAITING,
  ORDER_STATUS_LOCK_WAITING,
  ORDER_STATUS_LOCK_SUCCESS,

  ORDER_PAY_WAITING,
} from '@constants/order'

import {
  LOCALE_PAY,
  LOCALE_NOTICE,
  LOCALE_SEMICOLON,
  LOCALE_WARM_PROMPT,
  LOCALE_RECOMMEND_SEARCH,
  LOCALE_CONTACT_HOUSEKEEPER,

  LOCALE_ORDER_SIGN,
  LOCALE_ORDER_CANCEL,
  LOCALE_ORDER_CANCEL_CONFIRM,
  LOCALE_ORDER_STATUS_CANCEL,
  LOCALE_ORDER_STATUS_SUCCESS,
  LOCALE_ORDER_STATUS_CANCEL_NOTICE,
  LOCALE_ORDER_STATUS_SUCCESS_NOTICE,
  LOCALE_ORDER_STATUS_LOCK_FAIL_NOTICE,
  LOCALE_ORDER_STATUS_LOCK_WAITING_NOTICE,
  LOCALE_ORDER_STATUS_LOCK_SUCCESS_NOTICE,

  LOCALE_SIGNED_CODE_SHOW,
} from '@constants/locale'


@connect(state => state, {
  ...userActions,
  ...orderActions,
  ...apartmentActions,
  ...apartmentLookActions,
})
class OrderShow extends Component {
  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    id: 0,
    city: 0,
    roomId: 0,
    order: {},
    showSignCode: false,
  }

  componentWillMount() {
    const { id = 176 } = this.$router.params

    // 获取用户数据
    const { payload: user } = this.props.dispatchUser()
    this.setState({ city: user.citycode, id }, () => this.onReset())
  }

  // 获取订单数据
  onReset() {
    const { id } = this.state

    this.props.dispatchOrderShow({ id })
      .then(() => {
        const order = this.props.orders.list.find(i => i.id == id)

        // 设置订单
        this.setState({ order })

        // 设置标题
        const { message } = ORDER_STATUS_DIST[order.status]
        Taro.setNavigationBarTitle({ title: message })
      })
      .catch(() => Taro.reLaunch({ url: PAGE_HOME }))
  }

  // 显示签约码
  onShowSignCode() {
    this.setState({ showSignCode: true })
    this.onOpenTimer()
  }

  onOpenTimer() {
    // 开定时器刷新数据
    if (!this.timer) {
      this.onReset()
      this.timerCount = 0
      this.timer = setInterval(() => {
        this.onReset()
        this.timerCount++
        this.timerCount === 5 && clearInterval(this.timer)
      }, 10000)
    }
  }

  // 取消订单
  onOrderDelete() {
    const { id } = this.state

    Taro.showModal({
      title: LOCALE_NOTICE,
      content: LOCALE_ORDER_CANCEL_CONFIRM,
    }).then(res => res.confirm
      && this.props
        .dispatchOrderDelete({ id })
        .then(() => this.onReset())
    )
  }

  // 创建订单
  onOrderCreate() {
    const { roomId: room_id, order } = this.state
    const { name, mobile, id_code, sign_time } = order
    this.props.dispatchOrderCreate({
      name,
      mobile,
      id_code,
      room_id,
      sign_time,
    }).then(({ data: { data } }) =>
      this.setState({ id: data.order.id }, () => this.onReset()))
  }

  // 选择房间
  onSelectRoom(id) {
    const { roomId } = this.state
    this.setState({ roomId: roomId == id ? 0 : id })
  }

  // 联系管家
  onMakePhoneCall() {
    const { order: { server_user: { mobile } } } = this.state

    Taro.makePhoneCall({
      phoneNumber: mobile
    })
  }

  // 付款
  async onOrderPayment() {
    const { order: { id } } = this.state
    const { data: { data } } = await this.props.dispatchOrderPayment({ id })

    Taro.requestPayment({
      timeStamp: String(data.timeStamp),
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign
    }).then(() => this.onOpenTimer())
  }



  render() {
    const { apartmentlook } = this.props
    const { order, city, roomId, showSignCode } = this.state
    let { status, sign_time: signTime, app_code: appCode, countdown_time: countdownTime } = order

    signTime = day.unix(signTime).format('YYYY年MM月DD日')
    const signSeccessStyle = {
      position: "absolute",
      left: "50%",
      transform: " translate(-50% 0 )",
    }

    // 签约成功头部
    const statusSuccess = <View style={{ height: Taro.pxTransform(250) }}>
      {/* 背景底色 */}
      <Decorate height='250' />

      {/* 计时器 */}
      <View className='at-row at-row__justify--center'  style={signSeccessStyle}>
        <ABCIcon className='mt-2' icon='check_circle_outline' color={COLOR_WHITE} size='46' />
      </View>

      {/* 签约完成 */}
      <View className='at-row at-row__justify--center '>
        <View className='text-huge text-bold' style={{marginTop : "61px"}}>{LOCALE_ORDER_STATUS_SUCCESS}</View>
      </View>

      {/* 提示词 */}
      <View className='at-row at-row__justify--center'>
        <View className='text-normal mt-2'>{LOCALE_ORDER_STATUS_SUCCESS_NOTICE}</View>
      </View>
    </View>

    // 签约取消头部
    const statusCancel = <View style={{ height: Taro.pxTransform(250) }}>
      {/* 背景底色 */}
      <Decorate height='250' />

      {/* 计时器 */}
      <View className='at-row at-row__justify--center'>
        <ABCIcon className='mt-2' icon='cancel' color={COLOR_WHITE} size='46' />
      </View>

      {/* 签约完成 */}
      <View className='at-row at-row__justify--center'>
        <View className='text-huge text-bold mt-2'>{LOCALE_ORDER_STATUS_CANCEL}</View>
      </View>

      {/* 提示词 */}
      <View className='at-row at-row__justify--center'>
        <View className='text-normal mt-2'>{LOCALE_ORDER_STATUS_CANCEL_NOTICE}</View>
      </View>
    </View>

    // 待签约头部
    const statusLockWaiting = <View>
      {/* 背景底色 */}
      <Decorate height='330' />

      {/* 计时器  */}
      {!!countdownTime && <OrderTimer
        status={status}
        initTimer={countdownTime}
        onTimeOut={this.onReset}
      />}


      {/* 文本介绍 */}
      <Board>
        <View className='p-3 text-small'>
          <Text className='text-secondary'>
            {LOCALE_WARM_PROMPT}{LOCALE_SEMICOLON}
          </Text>
          <Text>
            {LOCALE_ORDER_STATUS_LOCK_WAITING_NOTICE}
          </Text>
        </View>
      </Board>
    </View>

    // 锁定失败头部
    const statusLockFail = <View>
      {/* 背景底色 */}
      <Decorate height='330' />

      {/* 计时器  */}
      {/* TODO 需要和宝哥沟通倒计时时间 */}
      <OrderTimer
        status={status}
        initTimer={countdownTime}
        onTimeOut={this.onReset}
      />

      {/* 文本介绍 */}
      <Board color='danger'>
        <View className='p-3 text-small'>
          <Text>
            {LOCALE_ORDER_STATUS_LOCK_FAIL_NOTICE}
          </Text>
        </View>
      </Board>
    </View>

    // 已锁定
    const statusLockSuccess = <View>
      {/* 背景底色 */}
      <Decorate height='330' />

      {/* 计时器  */}
      <OrderTimer
        status={status}
        initTimer={countdownTime}
        onTimeOut={this.onReset}
      />

      {/* 文本介绍 */}
      <Board>
        <View className='p-3 text-small'>
          <Text className='text-secondary'>
            {LOCALE_WARM_PROMPT}{LOCALE_SEMICOLON}
          </Text>
          <Text>
            {LOCALE_ORDER_STATUS_LOCK_SUCCESS_NOTICE.replace('%s', signTime)}
          </Text>
        </View>
      </Board>
    </View>

    // 待付款倒计时
    const statusPayWaiting = <View>
      <View className='mt-3'>
        {/* 背景底色 */}
        <Decorate height='150' />

        {/* 计时器  */}
        <OrderTimer
          status={status}
          initTimer={countdownTime}
          onTimeOut={this.onReset}
        />
      </View>
    </View>

    return (
      <View className='px-3' hidden={Object.keys(order).length === 0}>
        {/* 签约码 */}
        <OrderSignCode show={showSignCode} code={appCode} />

        {/* 预订成功头部 */}
        {ORDER_STATUS_SUCCESS == status && statusSuccess}

        {/* 取消成功头部 */}
        {ORDER_STATUS_CANCEL == status && statusCancel}

        {/* 锁定失败头部 */}
        {ORDER_STATUS_LOCK_FAIL == status && statusLockFail}

        {/* 待锁定头部 */}
        {ORDER_STATUS_LOCK_WAITING == status && statusLockWaiting}

        {/* 已锁定头部 */}
        {ORDER_STATUS_LOCK_SUCCESS == status && statusLockSuccess}

        {/* 待付款 */}
        {ORDER_STATUS_PAY_WAITING == status && statusPayWaiting}

        {/* 看了又看 */}
        <View>
          {ORDER_STATUS_CANCEL == status &&
            <View className='my-2 at-row at-row__justify--between at-row__align--center' >
              <View className='text-bold'>{LOCALE_RECOMMEND_SEARCH}</View>
            </View >
          }
          <ApartmentList
            mini
            show={ORDER_STATUS_CANCEL == status}
            key={apartmentlook.type}
            type={apartmentlook.type}
            items={apartmentlook.list}

            defaultPayload={{ city }}
            dispatchList={this.props.dispatchRecommendHouseType}
          />
        </View>

        {/* 预约详情 */}
        {
          ORDER_STATUS_LOCK_FAIL != status
          && ORDER_STATUS_CANCEL != status
          && !!order.sign_time
          && <OrderDesc order={order} className='pb-2' />
        }

        {/* 预订房源 */}
        <OrderRoomList
          selectId={roomId}
          rooms={order.room_list}
          onSelectRoom={this.onSelectRoom}
          show={ORDER_STATUS_LOCK_FAIL == status}
        />

        {/* 预订房源按钮 */}
        {ORDER_STATUS_PAY_WAITING == status &&
          <TabBarBoard>
            <View className='at-row'>
              <View className='at-col'>
                <AtButton
                  circle
                  className='btn-grey'
                  onClick={this.onOrderDelete}
                >
                  {LOCALE_ORDER_CANCEL}
                </AtButton>
              </View>
              <View className='at-col-9'>
                <View className='px-2'>
                  <AtButton
                    circle
                    className='btn-yellow active'
                    onClick={this.onOrderPayment}
                  >{LOCALE_PAY}</AtButton>
                </View>
              </View>
            </View>
          </TabBarBoard>
        }

        {/* 预订房源按钮 */}
        {ORDER_STATUS_LOCK_FAIL == status &&
          <TabBarBoard>
            <View className='at-row'>
              <View className='at-col'>
                <AtButton
                  circle
                  className='btn-grey'
                  onClick={this.onOrderDelete}
                >
                  {LOCALE_ORDER_CANCEL}
                </AtButton>
              </View>
              {roomId != 0 && <View className='at-col-9'>
                <View className='px-2'>
                  <AtButton
                    circle
                    className='btn-yellow active'
                    onClick={this.onOrderCreate}
                  >{LOCALE_ORDER_SIGN}</AtButton>
                </View>
              </View>}
            </View>
          </TabBarBoard>
        }

        {/* 预订成功按钮 */}
        {ORDER_STATUS_LOCK_SUCCESS == status &&
          <TabBarBoard>
            <View className='at-row'>
              <View className='at-col'>
                <AtButton
                  circle
                  className='btn-grey'
                  onClick={this.onMakePhoneCall}
                >
                  {LOCALE_CONTACT_HOUSEKEEPER}
                </AtButton>
              </View>
              <View className='at-col-9'>
                <View className='px-2'>
                  <AtButton
                    circle
                    className='btn-yellow active'
                    onClick={this.onShowSignCode}
                  >{LOCALE_SIGNED_CODE_SHOW}</AtButton>
                </View>
              </View>
            </View>
          </TabBarBoard>
        }
      </View>
    )
  }
}

export default OrderShow
