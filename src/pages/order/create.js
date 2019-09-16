// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Input, Text } from '@tarojs/components'
import { AtButton, AtTag } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as orderActions from '@actions/order'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Board from '@components/board'
import Decorate from '@components/decorate'
import OrderHeader from '@components/order-header'
import OrderRoomListMask from '@components/order-room-list-mask'
import ABCIcon from '@components/abc-icon'
import loginButton from '@components/login-button'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

// 自定义变量相关
import { ORDER_HEADERS } from '@constants/order'
import { PAGE_ORDER_SHOW } from '@constants/page'
import { PAYLOAD_ORDER_CREATE } from '@constants/api'
import {
  LOCALE_SCHEDULED_MESSAGE,
  LOCALE_CHANGE,
  LOCALE_DOWN_PAYMENT,
  LOCALE_DOWN_PAYMENT_RATIO,
  LOCALE_SIGN_USER,
  LOCALE_MONTH,
  LOCALE_SEMICOLON,
  LOCALE_RENT,
  LOCALE_PRICE_UNIT,
  LOCALE_RISK_NOTICE,
  LOCALE_SIGN_APARTMENT,
  LOCALE_SIGN_NOW,
  LOCALE_VIEW_SERVICE_AGREEMENT,
} from '@constants/locale'



@connect(state => state, {
  ...orderActions,
  ...apartmentActions,
})
class OrderCreate extends Component {
  config = {
    navigationBarTitleText: '签约下定',
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    signTime: '',

    timeList: [],
    disabled: false,
    showRoomList: false,
    room: {
      id: 0,
      apartment_title: "",
      no: '',
      price: '',
      risk_money: '',
      discount_price: '',
    },
    rooms: [{}],
    payload: PAYLOAD_ORDER_CREATE
  }


  async componentWillMount() {
    const { room_id = 0, appointment_id = 0, type_id = 0 } = this.$router.params
    
    const { data: { data } } = await this.props.dispatchOrderPreview({ room_id, appointment_id, type_id })

    // 初始化表单
    this.setState({
      timeList: data.tenancy,
      room: { ...data.room },
      rooms: [...data.rooms],
      signTime: data.sign_time,
      payload: {
        room_id: data.room.id,
        appointment_id,
        tenancy: 12,
        name: data.user_info.name,
        mobile: data.user_info.mobile,
        id_code: data.user_info.id_no,
      }
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
    const { data: { data } } = await this.props.dispatchOrderPreview({ room_id: id, appointment_id, type_id })
    this.setState({
      room: { ...data.room },
      rooms: [...data.rooms],
    })

    const { payload } = this.state
    this.setState({
      showRoomList: false,
      payload: { ...payload, room_id: id }
    })
  }

  // 显示房间列表
  onShowRoomList() {
    this.setState({ showRoomList: true })
  }

  // 关闭房间列表

  onClose() {
    this.setState({ showRoomList: false })
  }

  // 检查数据
  onCheckPayload() {
    const { payload } = this.state
    const { room_id, name, mobile, id_code, tenancy } = payload
    let judgeArr = [
      { title: '姓名', value: name },
      { title: '电话', value: mobile },
      { title: '身份证号码', value: id_code },
      { title: '租期', value: tenancy },
      { title: '预约公寓', value: room_id },
    ]


    try {
      judgeArr.forEach(i => {
        if (!i.value) {
          Taro.showToast({
            icon: 'none',
            title: '亲，您还没有填写' + i.title + '哦',
          })
          throw '亲，您还没有填写' + i.title + '哦'
        }
      })
    } catch (e) {
      return false
    }
    return true
  }

  // 创建
  onOrderCreate() {
    const { payload } = this.state
    if (!this.onCheckPayload()) return;

    this.props.dispatchOrderCreate(payload).then(({ data: { data } }) => {
      this.setState({ disabled: true })
      Taro.navigateTo({ url: `${PAGE_ORDER_SHOW}?id=${data.order.id}` })
    })
  }

  onNavigation() {
    Taro.navigateTo({ url: '/pages/order/down-payment' })
  }

  render() {
    const { payload, room, rooms, showRoomList, disabled, timeList, signTime } = this.state
    const { name, mobile, id_code: idCode } = payload
    const { no: roomNo, discount_price: discountPrice, price, apartment_title: apartmentTitle, risk_money, id } = room

    return (
      <View>
        {/* 修改房间 */}

        <OrderRoomListMask
          rooms={rooms}
          selectId={id}
          show={showRoomList}
          onSelectRoom={this.onSelectRoom}
          onClose={this.onClose}
        />

        <View className='p-3'>
          {/* 背景底色 */}
          <Decorate height='180' />

          {/* 头部 */}
          <OrderHeader
            className='mb-3'
            items={ORDER_HEADERS}
          />

          {/* 如果用户没有登录 */}
          {!Taro.getStorageSync('user_info').token &&
            <View className='mb-3'>
              <loginButton params={this.$router.params} color='black' message='您暂未登录，无法签约下定' />
            </View>
          }

          <View className='mb-2'>
            <Text className='text-bold text-huge'>{LOCALE_SCHEDULED_MESSAGE}</Text>
            <View onClick={this.onNavigation} className='text-normal text-secondary' style='float:right'>
              <ABCIcon style='float:right' icon='chevron_right' size='20' color={COLOR_GREY_2} />
              <View style='float:right'>{LOCALE_VIEW_SERVICE_AGREEMENT} </View>
            </View>
          </View>

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
                  姓名
              </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={name} placeholder='请输入您的姓名' onInput={this.onNameInput} />
                </View>
              </View>
              <View className='at-row at-row__align--center pt-2'>
                <View class='at-col-3 text-normal text-secondary'>
                  电话
              </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={mobile} placeholder='请输入您的电话号码' onInput={this.onMobileInput} />
                </View>
              </View>
              <View className='at-row at-row__align--center pt-2'>
                <View class='at-col-3 text-normal text-secondary'>
                  身份证号码
              </View>
                <View class='at-col-9'>
                  <Input className='pl-2 text-normal' value={idCode} placeholder='请输入您的身份证号码' onInput={this.onIdCodeInput} />
                </View>
              </View>
            </View>
          </Board>

          {/* 租期*/}
          <Board className='px-3 py-2  mb-3'>
            {/* 内容头部 */}
            <View className='py-1'>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View >
                  <View className='at-row'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>租期</View>
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
          {/* 签约时间 */}
          <Board className='px-3 py-2  mb-3'>
            {/* 内容头部 */}
            <View className='py-1'>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View>
                  <View className='at-row'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>签约时间</View>
                  </View>
                </View>

                <View>

                  <View className='picker text-normal'>
                    {signTime}
                  </View>

                </View>
              </View>
            </View>
          </Board>

          {/* 预订公寓 */}
          <Board className='px-3 py-2 mb-3'>
            {/* 内容头部 */}
            <View className='pb-2 border-bottom'>
              <View className='at-row at-row__align--center at-row__justify--between'>
                <View>
                  <View className='at-row at-row__align--center'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>{LOCALE_SIGN_APARTMENT}</View>
                  </View>
                </View>

                <View className='text-normal text-secondary' onClick={this.onShowRoomList}>
                  {LOCALE_CHANGE}
                </View>
              </View>
            </View>

            {/* 具体内容 */}
            <View className='at-row at-row__align--center at-row__justify--between'>
              {/* 左边 */}
              <View>
                <View className='at-row at-row__align--center'>
                  <View className='pt-3'>
                    <View className='text-bold text-normal'>{apartmentTitle}{roomNo}</View>
                    {rooms.length !== 0 && <View className='text-small text-yellow mt-2'>
                      {LOCALE_RENT}{LOCALE_SEMICOLON}
                      <Text className='text-normal'>{discountPrice}</Text>
                      {LOCALE_PRICE_UNIT}/{LOCALE_MONTH}
                    </View>}
                  </View>
                </View>
              </View>
            </View>
          </Board>

          {/* 风险金 */}
          <Board className='px-3 py-2 mb-3'>
            {/* 内容头部 */}
            <View className='py-1'>
              <View className='at-row at-row__justify--between at-row at-row__align--center'>
                <View>
                  <View className='at-row'>
                    <View className='border-decorate border-decorate-yellow' style={{ height: '18px' }}></View>
                    <View className='ml-2 text-normal text-secondary'>{LOCALE_RISK_NOTICE}</View>
                  </View>
                </View>

                <View className='ml-2 text-normal'>{risk_money}{LOCALE_PRICE_UNIT}</View>
              </View>
            </View>
          </Board>

          {/* 定金 */}
          <View className='my-3'>
            <View className='at-row at-row__align--start at-row__justify--between '>
              <View>
                <View className='text-brand text-super text-bold'>{LOCALE_DOWN_PAYMENT}</View>
                <View className='text-normal text-secondary mt-1'>{LOCALE_DOWN_PAYMENT_RATIO}</View>

              </View>

              <View className='text-brand text-super text-bold'>{price || 0}{LOCALE_PRICE_UNIT}</View>
            </View>
          </View>

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

                >暂无可选房间</AtButton>
              </View>
            </View>}
        </View>
      </View>
    )
  }
}

export default OrderCreate
