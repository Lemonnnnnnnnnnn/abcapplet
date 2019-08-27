import Taro, { Component } from '@tarojs/taro'
import { View, Input, Image, Picker } from '@tarojs/components'
import Board from '@components/board'
import { AtTag, AtIcon, AtButton } from 'taro-ui'
import { PAYLOAD_APPOINTMENT_REWARDORDER, API_UPLOAD_IMAGE } from '@constants/api'
import { PAGE_ORDER_CREATE} from '@constants/page'

// 自定义组件
import ABCIcon from '@components/abc-icon'


// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

import Decorate from '@components/decorate'


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
    houseTypeId:'',
    payload: PAYLOAD_APPOINTMENT_REWARDORDER,
    //上传图片相关
    index: 0,
    files: [],
  }

  componentWillMount() {

    const myDate = new Date()
    const month = myDate.getMonth() + 1
    const signTime = myDate.getFullYear() + '-' + month + '-' + myDate.getDate()
    this.setState({
      signTime
    })

    const { payload } = this.state
    const { id } = this.$router.params
    this.props.dispatchAppointmentDetail({ id }).then((res) => {

      this.setState({
        mobile: res.data.data.mobile,
        // creatTime: time,
        apartmentTitle: res.data.data.apartment_title,
        houseTypeId:res.data.data.house_type_id,
        payload: { ...payload, appointment_id: res.data.data.id, mobile: res.data.data.mobile, sign_time: signTime }
      })
    })
    //上传图片相关
    const { placeholer } = this.props
    const files = Array.from({ length: placeholer - 1 }).map((i, key) => ({
      id: key,
      url: '',
    }))

    this.setState({ files })

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
  async onClick() {
    let { files, index,paylod } = this.state
    const { placeholer } = this.props
    const { tempFilePaths } = await Taro.chooseImage({
      count: placeholer - 1,
      sizeType: ['compressed'],
    })

    Taro.showLoading({ title: '正在上传照片' })

    for (let i = 0; i < tempFilePaths.length; i++) {
      if (index >= placeholer - 1) return;

      let { data } = await Taro.uploadFile({
        name: 'risk',
        url: API_UPLOAD_IMAGE,
        filePath: tempFilePaths[i],
      })

      const file = (JSON.parse(data)).data[0]

      files[index++] = {
        ...files[index],
        url: file.path,
      }

      this.setState({
        files,
        // payload:{...paylod,file_img:files},
        index: index - 1 })
    }

    Taro.hideLoading()
    // this.props.onChange(files.filter(i => i.url !== '').map(i => i.url))

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
  //提交
  onComfirm() {
    const { payload,files } = this.state
    console.log(payload)
    this.props.dispatchAppointRewordOrder({...payload,file_img:files}).then(()=>{
      Taro.navigateTo(
        // url:
      )
    }
    )
  }
  //跳转签约下定页面
  onNavigateTo(){
    const { houseTypeId } = this.state
    Taro.navigateTo({
      url: `${PAGE_ORDER_CREATE}?type_id=${houseTypeId}`
    })
  }
  render() {

    const { timeList, mobile, apartmentTitle, signTime, files } = this.state



    return (
      <View className='message-background' style={{ 'padding-top': '75px', 'padding-bottom': '30px' }}>
        {/* 头部 */}
        <View class='board--grey board--fixed-top ' style='position:absolute;z-index:9' >
          <Decorate height='126' />
        </View>

        <Board className='py-2 px-3 mx-2 mt-4 '>
          <View className='at-row'>
            <View className='border-decorate border-decorate-yellow' style={{ height: '20px' }}></View>
            <View className='text-normal text-bold ml-2'>预约看房公寓</View>
          </View>
          <View className='text-huge text-bold ml-2 mt-2'>{apartmentTitle}</View>
          <View className='text-small ml-2 mt-2'>
            <Input name='value'
              type='text'
              placeholder='请输入签约房号，支持字母、数字1-9、 “-”破折号'
              value={this.state.value}
              onInput={this.onInputRoomNo}></Input>
          </View>
          <View style='width:95%;height:0px;border:1px solid rgba(232,232,232,1);opacity:1;' className='ml-2'></View>
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
              type='text'
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
                  <View className='text-large text-yellow  at-col-3' >修改</View>
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
            <View className='at-row at-row--wrap'>
              <View className='at-col at-col-4' onClick={this.onClick}>
                <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                  <View>
                    <View className='at-row at-row__justify--center'>
                      <ABCIcon icon='add' color={COLOR_GREY_2} size='32' />
                    </View>
                    <View className='text-normal text-secondary mt-2'>添加合同照片</View>
                  </View>
                </View>
              </View>
              {
                files.map(i =>
                  <View key={i.id} className='at-col at-col-4'>
                    <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                      <Image src={i.url} style={{ width: '80%', height: '80%' }} />
                    </View>
                  </View>
                )
              }
            </View >



          </View>
        </Board>

        <Board className='py-2 px-3 mx-2 mt-3 ' >
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
        </Board>
        <View className='mx-2 mt-3 text-muted' onClick={this.onComfirm}>
          <AtButton type='primary' size='normal' circle >确定提交审核</AtButton>
        </View>

        <View className=' ml-2 mt-3' style='position:absolute;top:1%;z-index:999;'>
          <Image src='https://images.gongyuabc.com/image/appointmenthead.png' className='appointmentHead'></Image>
        </View>
      </View>



    )
  }
}

export default AppointmentDetail
