import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Picker, Button, Text } from '@tarojs/components'
import Board from '@components/board'
import { AtTag, AtIcon, AtButton } from 'taro-ui'
import { PAYLOAD_APPOINTMENT_REWARDORDER, API_UPLOAD_IMAGE } from '@constants/api'
import { PAGE_ORDER_CREATE, PAGE_APPOINTMENT_AUDIT } from '@constants/page'
import { SIGN_CASH_BACK, CALL, APPOINTMENT_DETAIL } from '@constants/picture'
import {
  LOCALE_ADVERTISING_WORD_WU,
  LOCALE_ADVERTISING_WORD_FU,
  LOCALE_APPOINTMENT_DETAIL_REVIEW,
  LOCALE_APPOINTMENT_DETAIL_RENT_PRICE,
  LOCALE_APPOINTMENT_DETAIL_RENT_TIME,
  LOCALE_APPOINTMENT_DETAIL_SIGN_TIME,
  LOCALE_APPOINTMENT_DETAIL_SIGN_PHONE,
  LOCALE_APPOINTMENT_DETAIL_SIGN_APARTMENT,
  LOCALE_APPOINTMENT_DETAIL_SIGN_MESSAGE,
  LOCALE_APPOINTMENT_DETAIL_MODIFY,
  LOCALE_APPOINTMENT_DETAIL_ADD_PICTURE,
  LOCALE_APPOINTMENT_DETAIL_INPUT_RENT,
  LOCALE_APPOINTMENT_DETAIL_INPUT_PHONE,
  LOCALE_APPOINTMENT_DETAIL_CANT_SUBMIT,
  LOCALE_APPOINTMENT_DETAIL_SIGN_PICTURE
} from '@constants/locale'

// 自定义组件
import Decorate from '@components/decorate'
import ImageUpload from '@components/image-upload'
import BaseComponent from '@components/base'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'
import * as appointmentActions from '@actions/appointment'

import buryPoint from '../../utils/bury-point'
import AppointmentDetailRoom from './components/appointment-detail-room'



@connect(state => state, {
  ...apartmentActions,
  ...appointmentActions,

})

class AppointmentDetail extends BaseComponent {
  static defaultProps = {
    placeholer: 6,
  }
  config = {
    navigationBarTitleText: '行程签约',
    navigationBarBackgroundColor: '#FFC919',
  }
  state = {
    timeList: [{ id: 6, name: "半年" }, { id: 12, name: "一年" }],
    mobile: '',
    mobileChecked: false,
    price: LOCALE_APPOINTMENT_DETAIL_INPUT_RENT,
    priceChecked: false,
    creatTime: '',
    apartmentTitle: '',
    signTime: '',
    houseTypeId: '',
    roomList: [],
    roomListArr: [],
    roomChoise: '',
    type_list: [],
    typeChoise: '',
    payload: PAYLOAD_APPOINTMENT_REWARDORDER,
    //上传图片相关

    isCanReward: 0,//是否能提交签约审核单

    text: '添加合同照片',
    isSign: 0,
    userInputView: false,
  }

  async componentWillMount() {
    buryPoint()
    let roomListArr = []
    let type = 0

    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const signTime = myDate.getFullYear() + '-' + month + '-' + myDate.getDate()
    this.setState({ signTime })

    const { payload } = this.state
    const { id, isSign } = this.$router.params
    await this.props.dispatchAppointRewordOrderRoomPost({ appointment_id: parseInt(id) }).then(res => {

      const { data } = res.data
      data.map(i => {
        roomListArr.push(i.no)
      })
      if (roomListArr.length) {
        this.setState({
          roomListArr,
          roomList: data,
          payload: { ...payload, apartment_room_id: '' }
        })
        type = 1
      } else {
        this.setState({
          userInputView: true,
          payload: { ...payload, apartment_type_id: 0, room_no: '' }
        })
        type = 2
      }
    })

    await this.props.dispatchAppointmentDetail({ id }).then((res) => {
      // 写入默认数值
      this.setState({
        roomChoise: '请选择房间号',
        isSign: parseInt(isSign),
        Id: id,
        mobile: res.data.data.mobile,
        isCanReward: res.data.data.is_can_reward,
        apartmentTitle: res.data.data.apartment_title,
        type_list: res.data.data.type_list,
        houseTypeId: res.data.data.house_type_id,
        payload: { ...payload, appointment_id: res.data.data.id, mobile: res.data.data.mobile, sign_time: signTime, type: type }
      })
    })
  }

  //选择房间
  onChoiseRoom({ currentTarget: { value } }) {
    const { roomList, payload } = this.state
    this.setState({
      roomChoise: roomList[value].no,
      payload: { ...payload, apartment_room_id: roomList[value].id }
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

  //上传图片
  onChangeImage(files) {
    const { payload } = this.state
    this.setState({ payload: { ...payload, file_img: files } })
  }
  //修改时间
  onDateChange({ currentTarget: { value } }) {

    const { payload } = this.state
    this.setState({
      signTime: value,
      payload: { ...payload, sign_time: value }
    })

  }

  //修改电话号码
  onClearMobile() {
    this.setState({
      mobile: '',
      mobileChecked: true
    })
  }

  onClearPrice() {
    this.setState({
      price: '',
      priceChecked: true
    })
  }

  //输入电话号码
  onChangeMobile({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      mobile: value,
      payload: { ...payload, mobile: value }
    })
  }

  // 输入租金
  onChangePrice({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      price: value,
      payload: { ...payload, price: value }
    })
  }

  // 选择户型
  onChoiseHouseType({ currentTarget: { value } }) {
    const { type_list, payload } = this.state
    this.setState({
      typeChoise: type_list[value].title,
      payload: { ...payload, apartment_type_id: type_list[value].id }
    })
  }
  // 输入房间号
  onInputRoomId({ currentTarget: { value } }) {
    const { payload } = this.state
    this.setState({
      price: value,
      payload: { ...payload, room_no: value }
    })
  }

  //检查数据
  onCheck() {
    const { payload } = this.state
    const { mobile, sign_time, tenancy, file_img, price, type } = payload
    const { apartment_room_id = 0, apartment_type_id = 0, room_no = 0 } = payload

    let judgeArr = [
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_PHONE, value: mobile },
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_TIME, value: sign_time },
      { title: LOCALE_APPOINTMENT_DETAIL_RENT_TIME, value: tenancy },
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_PICTURE, value: file_img },
      { title: LOCALE_APPOINTMENT_DETAIL_RENT_PRICE, value: price }
    ]

    type === 1 && judgeArr.unshift({ title: '房间号', value: apartment_room_id })
    type === 2 && judgeArr.unshift({ title: '户型', value: apartment_type_id })
    type === 2 && judgeArr.unshift({ title: '房间号', value: room_no })

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
  //提交
  onComfirm() {
    const { payload, isCanReward } = this.state

    if (isCanReward) {
      this.onCheck()
        && this.props.dispatchAppointRewordOrder(payload).then((res) => {
          Taro.redirectTo({
            url: `${PAGE_APPOINTMENT_AUDIT}?id=${res.data.data.id}`
          })
        }
        )
    } else {
      Taro.showToast({
        title: LOCALE_APPOINTMENT_DETAIL_CANT_SUBMIT,
        icon: 'none',
        duration: 2000
      })
    }

  }
  //跳转签约下定页面
  onNavigateTo() {
    const { houseTypeId } = this.state
    Taro.navigateTo({
      url: `${PAGE_ORDER_CREATE}?type_id=${houseTypeId}`
    })
  }

  // 切换成用户主动输入房间信息的板块
  onChangeBoard() {
    this.setState({ userInputView: true })
  }



  render() {
    const { timeList, mobile, apartmentTitle, signTime, isSign, priceChecked,
      mobileChecked, roomListArr, roomChoise, userInputView, type_list, typeChoise } = this.state

    const house_type_list = type_list.map(i => i.title)

    return (
      <View className='inherit-Width appointment-detail' style={{ paddingTop: Taro.pxTransform(150), paddingBottom: Taro.pxTransform(60) }}>
        {/* 头部 */}
        <View class='board--grey board--fixed-top ' style='position:absolute;z-index:9' >
          <Decorate height='126' />
        </View >

        <View className='appointment-detail-board'>
          {/* 上半部分 */}
          <Board className='py-2 px-3 mx-2 mt-4 '>
            <View className='at-row'>
              <View className='border-decorate border-decorate-yellow' style={{ height: Taro.pxTransform(40) }}></View>
              <View className='text-normal text-bold ml-2'>{LOCALE_APPOINTMENT_DETAIL_SIGN_APARTMENT}</View>
            </View>
            <View className='text-large text-bold ml-2 mt-2'>{apartmentTitle}</View>

            {/* 房间号板块用户可以单向切换，如果没有房间则默认为用户输入的板块 */}

            <AppointmentDetailRoom
              userInputView={userInputView}
              house_type_list={house_type_list}
              roomListArr={roomListArr}
              typeChoise={typeChoise}
              roomChoise={roomChoise}
              onChoiseHouseType={this.onChoiseHouseType}
              onInputRoomId={this.onInputRoomId}
              onChoiseRoom={this.onChoiseRoom}
              onChangeBoard={this.onChangeBoard}
            />
          </Board>

          {/* 下半部分 */}

          <Board className='py-2 px-3 mx-2 mt-3 '>
            <View className='at-row'>
              <View className='border-decorate border-decorate-yellow' style={{ height: Taro.pxTransform(40) }}></View>
              <View className='text-normal text-bold ml-2'>{LOCALE_APPOINTMENT_DETAIL_SIGN_MESSAGE}</View>
            </View>

            <View className='at-row'>
              <View className='text-large text-secondary ml-2 mt-2 at-col-3'>{LOCALE_APPOINTMENT_DETAIL_SIGN_PHONE}</View>
              <Input
                type='number'
                focus={mobileChecked}
                className='text-large mt-2  at-col-4'
                value={mobile}
                placeholder={LOCALE_APPOINTMENT_DETAIL_INPUT_PHONE}
                onInput={this.onChangeMobile}
              />
              <View className='text-large text-yellow ml-4 mt-2 at-col-3' onClick={this.onClearMobile}>{LOCALE_APPOINTMENT_DETAIL_MODIFY}</View>
            </View>

            <View className='at-row'>
              <View className='text-large text-secondary ml-2 mt-2 at-col-3'>{LOCALE_APPOINTMENT_DETAIL_SIGN_TIME}</View>
              <View className='at-col-8'>
                <Picker className='text-large ml-1 mt-2 ' mode='date' onChange={this.onDateChange}>
                  <View className='at-row'>
                    <View className='text-normal at-col-7'>{signTime}</View>
                    <View className='text-large text-yellow ml-1 at-col-3' >{LOCALE_APPOINTMENT_DETAIL_MODIFY}</View>
                  </View>
                </Picker>
              </View>
            </View>

            {/* 签约价格 */}
            <View className='at-row'>
              <View className='text-large text-secondary ml-2 mt-2 at-col-3'>{LOCALE_APPOINTMENT_DETAIL_RENT_PRICE}</View>
              <Input
                type='number'
                className='text-normal mt-2 at-col-4'
                focus={priceChecked}
                placeholder={LOCALE_APPOINTMENT_DETAIL_INPUT_RENT}
                onInput={this.onChangePrice}
              />
              <View className='text-large text-yellow ml-4 mt-2 at-col-3' onClick={this.onClearPrice}>{LOCALE_APPOINTMENT_DETAIL_MODIFY}</View>
            </View>

            <View className='at-row mt-2'>
              <View className='text-large text-secondary ml-2 mt-2 at-col-2'>{LOCALE_APPOINTMENT_DETAIL_RENT_TIME}</View>
              <View className='at-col-6 at-row'>
                {timeList.map((item) => (
                  <View className='at-row ml-2 ' key={item.id}>
                    <AtTag
                      type='primary'
                      size='normal'
                      className='mt-1'
                      circle
                      active={item.active}
                      onClick={this.onTimeChange.bind(this, item.id)}
                    >{item.name}</AtTag>
                  </View>
                ))}
              </View>
            </View>
            <View className='mt-2'>

              {/* 上传图片 */}
              <ImageUpload
                onChange={this.onChangeImage}
                text={LOCALE_APPOINTMENT_DETAIL_ADD_PICTURE}
              />
            </View>
          </Board>

          {
            isSign === 1 && <Board className='py-2 px-3 mx-2 mt-3 ' >
              <View className='at-row at-row__justify--between ' onClick={this.onNavigateTo}>
                <View className=''>
                  <View className='at-row'>
                    <Image className='mt-1 appointment-image' src={APPOINTMENT_DETAIL}></Image>
                    <View className='text-bold text-large ml-2'>{LOCALE_ADVERTISING_WORD_WU}</View>
                  </View>
                  <View className='text-small mt-1'>
                    {LOCALE_ADVERTISING_WORD_FU}
                  </View>
                </View>
                <View className='mt-2'>
                  <AtIcon value='chevron-right' size='30' color='#000000'></AtIcon>
                </View>
              </View>
            </Board>
          }

          <View className='mx-2 mt-3 text-muted' onClick={this.onComfirm}>
            <AtButton className='mx-2 btn-yellow active' size='normal' circle >{LOCALE_APPOINTMENT_DETAIL_REVIEW}</AtButton>
          </View>
        </View>

        {/* 广告图片 */}
        <View className='appointment-detail-head'>
          <Image src={SIGN_CASH_BACK} mode='widthFix' className='appointment-head'></Image>
        </View>

        {/* 客服悬浮入口 */}
        <Button open-type='contact' >
          <Image className='appointment-fix-icon' src={CALL}></Image>
        </Button>

      </View >



    )
  }
}

export default AppointmentDetail
