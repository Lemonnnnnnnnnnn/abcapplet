import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Picker, Button } from '@tarojs/components'
import Board from '@components/board'
import { AtTag, AtIcon, AtButton } from 'taro-ui'
import { PAYLOAD_APPOINTMENT_REWARDORDER, API_UPLOAD_IMAGE } from '@constants/api'
import { PAGE_ORDER_CREATE, PAGE_APPOINTMENT_AUDIT } from '@constants/page'
import { SIGN_CASH_BACK, CALL,APPOINTMENT_DETAIL } from '@constants/picture'
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
  LOCALE_APPOINTMENT_DETAIL_HAVE_NO_ROOM,
  LOCALE_APPOINTMENT_DETAIL_MODIFY,
  LOCALE_APPOINTMENT_DETAIL_ADD_PICTURE,
  LOCALE_APPOINTMENT_DETAIL_INPUT_RENT,
  LOCALE_APPOINTMENT_DETAIL_INPUT_PHONE,
  LOCALE_APPOINTMENT_DETAIL_CANT_SUBMIT,
  LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM,
  LOCALE_APPOINTMENT_DETAIL_SIGN_PICTURE
} from '@constants/locale'

import Decorate from '@components/decorate'

import ImageUpload from '@components/image-upload'
// Redux 相关
import { connect } from '@tarojs/redux'

import * as apartmentActions from '@actions/apartment'
import * as appointmentActions from '@actions/appointment'
import BaseComponent from '../../components/base'

import '../../styles/_appointment.scss'


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
    timeList: [{ id: 6, name: "半  年" }, { id: 12, name: "一  年" }],
    mobile: '',
    mobileChecked : false,
    price: LOCALE_APPOINTMENT_DETAIL_INPUT_RENT,
    priceChecked : false,
    creatTime: '',
    apartmentTitle: '',
    signTime: '',
    houseTypeId: '',
    roomList: [],
    payload: PAYLOAD_APPOINTMENT_REWARDORDER,
    //上传图片相关

    isCanReward: 0,//是否能提交签约审核单

    text: '添加合同照片',
    isSign: 0,
  }

  componentWillMount() {

    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const signTime = myDate.getFullYear() + '-' + month + '-' + myDate.getDate()
    this.setState({
      signTime
    })

    const { payload } = this.state
    const { id, isSign } = this.$router.params
    this.props.dispatchAppointmentDetail({ id }).then((res) => {

      this.setState({
        isSign: parseInt(isSign),
        Id: id,
        mobile: res.data.data.mobile,
        isCanReward: res.data.data.is_can_reward,
        apartmentTitle: res.data.data.apartment_title,
        houseTypeId: res.data.data.house_type_id,
        payload: { ...payload, appointment_id: res.data.data.id, mobile: res.data.data.mobile, sign_time: signTime }
      })
    })

    this.props.dispatchAppointRewordOrderRoomPost({ appointment_id: parseInt(id) }).then(res => {
      let roomList = res.data.data
      roomList.map(i => ({ i, active: false, type: false }))
      this.setState({ roomList })
    })
  }

  //选择房间
  onChoiseRoom(e, index, id) {
    const { roomList, payload } = this.state
    const roomListClone = JSON.parse(JSON.stringify(roomList))
    let choiseRoom = 0
    roomListClone.map(i => {
      if (i.id === id) {
        i.active = !i.active
        i.type = !i.type

        if (i.active && i.type) {
          choiseRoom = parseInt(id)
        } else { choiseRoom = 0 }

      } else {
        i.active = false
        i.type = false
      }
    })
    this.setState({ roomList: roomListClone, payload: { ...payload, apartment_room_id: choiseRoom } })
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
      mobileChecked : true
    })
  }

  onClearPrice(){
    this.setState({
      price: '',
      priceChecked : true
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

  //检查数据
  onCheck() {
    const { payload } = this.state
    const { apartment_room_id, mobile, sign_time, tenancy, file_img, price } = payload
    let judgeArr = [
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM, value: apartment_room_id },
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_PHONE, value: mobile },
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_TIME, value: sign_time },
      { title: LOCALE_APPOINTMENT_DETAIL_RENT_TIME, value: tenancy },
      { title: LOCALE_APPOINTMENT_DETAIL_SIGN_PICTURE, value: file_img },
      { title: LOCALE_APPOINTMENT_DETAIL_RENT_PRICE, value: price }
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
  render() {
    const { timeList, mobile, apartmentTitle, signTime, isSign, roomList , price , priceChecked, mobileChecked } = this.state

    return (
      <View className='message-background appointment-detail' style={{ paddingTop: Taro.pxTransform(150), paddingBottom: Taro.pxTransform(60) }}>
        {/* 头部 */}
        <View class='board--grey board--fixed-top ' style='position:absolute;z-index:9' >
          <Decorate height='126' />
        </View >

        <Board className='py-2 px-3 mx-2 mt-4 '>
          <View className='at-row' style={{ marginTop: Taro.pxTransform(200) }}>
            <View className='border-decorate border-decorate-yellow' style={{ height: Taro.pxTransform(40) }}></View>
            <View className='text-normal text-bold ml-2'>{LOCALE_APPOINTMENT_DETAIL_SIGN_APARTMENT}</View>
          </View>
          <View className='text-huge text-bold ml-2 mt-2'>{apartmentTitle}</View>

          {/* 可选房间 */}
          <View className='my-2'>
            {
              roomList.length ? roomList.map((i, key) =>
                <AtTag
                  type={i.type ? "primary" : ""}
                  active={i.active}
                  className='my-1 mx-1'
                  circle
                  key={i}
                  size='small'
                  onClick={(e) => this.onChoiseRoom(e, key, i.id)} >
                  <View>{i.no}</View>
                </AtTag>
              ) : <View className='text-normal text-secondary ml-2 '>{LOCALE_APPOINTMENT_DETAIL_HAVE_NO_ROOM}</View>
            }
          </View>

          <View className='ml-2 appointment-detail-line '></View>
        </Board>

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
              className='text-normal text-secondary mt-2 at-col-4'
              value={price}
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
