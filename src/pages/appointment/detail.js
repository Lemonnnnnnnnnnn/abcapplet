import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Picker } from '@tarojs/components'
import Board from '@components/board'
import { AtTag, AtIcon, AtButton } from 'taro-ui'
import { PAYLOAD_APPOINTMENT_REWARDORDER, API_UPLOAD_IMAGE } from '@constants/api'
import { PAGE_ORDER_CREATE, PAGE_APPOINTMENT_AUDIT } from '@constants/page'

// 自定义组件
import ABCIcon from '@components/abc-icon'


// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

import Decorate from '@components/decorate'

import ImageUpload from '@components/image-upload';
// Redux 相关
import { connect } from '@tarojs/redux'

import * as apartmentActions from '@actions/apartment'
import * as appointmentActions from '@actions/appointment'
import BaseComponent from '../../components/base';


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
    creatTime: '',
    apartmentTitle: '',
    signTime: '',
    houseTypeId: '',
    payload: PAYLOAD_APPOINTMENT_REWARDORDER,
    //上传图片相关

    isCanReward: 0,//是否能提交签约审核单

    text: '添加合同照片',
    isSign:0,
  }

  componentWillMount() {

    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const signTime = myDate.getFullYear() + '-' + month + '-' + myDate.getDate()
    this.setState({
      signTime
    })

    const { payload } = this.state
    const { id ,isSign} = this.$router.params
    this.props.dispatchAppointmentDetail({ id }).then((res) => {

      this.setState({
        isSign:parseInt(isSign),
        Id: id,
        mobile: res.data.data.mobile,
        isCanReward: res.data.data.is_can_reward,
        apartmentTitle: res.data.data.apartment_title,
        houseTypeId: res.data.data.house_type_id,
        payload: { ...payload, appointment_id: res.data.data.id, mobile: res.data.data.mobile, sign_time: signTime }
      })
    })


  }

  //输入房号
  onInputRoomNo({ currentTarget: { value } }) {

    const { payload } = this.state
    this.setState({
      payload: { ...payload, room_no: value }
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
      mobile: ''
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
  //检查数据
  onCheck() {
    const { payload } = this.state
    const {  room_no, mobile, sign_time, tenancy, file_img } = payload
    let judgeArr = [
      { title: '房间号', value: room_no },
      { title: '签约手机', value: mobile },
      { title: '签约时间', value: sign_time },
      { title: '租期', value: tenancy },
      { title: '合同图片', value: file_img },
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

    if (isCanReward === 1) {
      this.onCheck()
        && this.props.dispatchAppointRewordOrder(payload).then((res) => {
          Taro.redirectTo({
            url: `${PAGE_APPOINTMENT_AUDIT}?id=${res.data.data.id}`
          })
        }
        )
    }
    if (isCanReward === 0) {
      Taro.showToast({
        title: '您还不能提交预约审核单',
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

    const { timeList, mobile, apartmentTitle, signTime, isSign } = this.state

    return (
      <View className='message-background' style={{ 'padding-top': '75px', 'padding-bottom': '30px' }}>
        {/* 头部 */}
        <View class='board--grey board--fixed-top ' style='position:absolute;z-index:9' >
          <Decorate height='126' />
        </View>

        <Board className='py-2 px-3 mx-2 mt-4 '>
          <View className='at-row' style={{marginTop : Taro.pxTransform(200)}}>
            <View className='border-decorate border-decorate-yellow' style={{ height: '20px' }}></View>
            <View className='text-normal text-bold ml-2'>签约公寓</View>
          </View>
          <View className='text-huge text-bold ml-2 mt-2'>{apartmentTitle}</View>
          <View className='text-small ml-2 mt-2'>
            <Input name='value'
              type='text'
              placeholder='请输入签约房号，支持字母、数字1-9、 “-”破折号'
              value={this.state.value}
              onInput={this.onInputRoomNo}></Input>
          </View>
          <View className='ml-2 appointment-detail-line '></View>
        </Board>

        <Board className='py-2 px-3 mx-2 mt-3 '>
          <View className='at-row'>
            <View className='border-decorate border-decorate-yellow' style={{ height: '20px' }}></View>
            <View className='text-normal text-bold ml-2'>签约信息</View>
          </View>

          <View className='at-row'>
            <View className='text-large text-secondary ml-2 mt-2 at-col-3'>签约手机:</View>
            {/* <View className='text-large ml-2 mt-2 at-col-4'>{mobile}</View> */}
            <Input
              type='number'
              className='text-large mt-2  at-col-4'
              value={mobile}
              placeholder='输入电话号码'
              onInput={this.onChangeMobile}
            />
            <View className='text-large text-yellow ml-4 mt-2 at-col-3' onClick={this.onClearMobile}>修改</View>
          </View>

          <View className='at-row'>
            <View className='text-large text-secondary ml-2 mt-2 at-col-3'>签约时间：</View>
            {/* <View className='text-large ml-2 mt-2 at-col-4'>{signTime}</View> */}
            <View className='at-col-8'>
              <Picker className='text-large ml-1 mt-2 ' mode='date' onChange={this.onDateChange}>
                <View className='at-row'>
                  <View className='text-normal at-col-7'>{signTime}</View>
                  <View className='text-large text-yellow ml-1 at-col-3' >修改</View>
                </View>
              </Picker>
            </View>
          </View>

          <View className='at-row mt-2'>
            <View className='text-large text-secondary ml-2 mt-2 at-col-2'>租期：</View>
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
              text='添加合同照片'
            />
          </View>
        </Board>

        {isSign === 1 && <Board className='py-2 px-3 mx-2 mt-3 ' >
          <View className='at-row at-row__justify--between ' onClick={this.onNavigateTo}>
            <View className=''>
              <View className='at-row'>
                <Image className='mt-1 appointmentImage' src='https://images.gongyuabc.com/image/appointmentdetail.png'></Image>
                <View className='text-bold text-large ml-2'>还没签约？选择ABC待预定服务</View>
              </View>
              <View className='text-small mt-1'>
                快速锁定房间，还可以获得最高￥800元退租押金赔付
          </View>
            </View>
            <View className='mt-2'>
              <AtIcon value='chevron-right' size='30' color='#000000'></AtIcon>
            </View>
          </View>
        </Board>}

        <View className='mx-2 mt-3 text-muted' onClick={this.onComfirm}>
          <AtButton className='mx-2 btn-yellow active' size='normal' circle >确定提交审核</AtButton>
        </View>

        <View className='appointment-detail-head'>
          <Image src='https://images.gongyuabc.com/image/signCashBack.png' mode='widthFix'   className='appointmentHead'></Image>
        </View>
      </View>



    )
  }
}

export default AppointmentDetail
