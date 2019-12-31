// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtAvatar, AtIcon, AtButton, AtTag } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'
import * as appointmentActions from '@actions/appointment'

// 自定义变量
import { PAYLOAD_APPOINTMENT_CREATE } from '@constants/api'

import {
  LOCALE_CHANGE,
  LOCALE_APPOINTMENT_LOOKTIME,
  LOCALE_APPOINTMENT_POST,
  LOCALE_LOGIN_APPOINTMENT,
  LOCALE_MULTIPLE_SELECTION,
  LOCALE_NO_OPTIONAL_UNIT,
  LOCALE_NIGHT_LIST_NOTICE,
  LOCALE_NAME,
  LOCALE_TEL,
  LOCALE_USER_HAVENT_INPUT,
  LOCALE_OH,
  LOCALE_CHOISE_VIEW_ROOM_TIME,
  LOCALE_NO_LISTINGS,
  LOCALE_NONE,
  LOCALE_MOBILE_FORMAT_ERROR,
  LOCALE_VIEW_ROOM_DATE,
  LOCALE_VIEWING_HOUSETYPE,
  LOCALE_APPOINTMENT_SUCCESS
} from '@constants/locale'
// 自定义组件
import GetAuthorizationMask from '@components/get-authorization-mask'
import MaskTop from '@components/maskTop'
import LoginButton from '@components/login-button'
import TimePicker from '@components/time-picker'

import buryPoint from '../../utils/bury-point'
import AppointmentPostMask from './components/appointment-post-mask'
import AppointmentPostNextMask from './components/appointment-post-next-mask'
import ApartmentAppointmentHeader from './components/apartment-appointment-header'

@connect(state => state, {
  ...userActions,
  ...apartmentActions,
  ...appointmentActions,
})
class AppointmentPost extends Component {
  config = {
    navigationBarTitleText: '预约看房',
  }

  state = {
    serverId: 0,
    zeroMinTime: 29,
    zeroSecTime: 59,
    secTime: 59,
    minTime: 29,
    sectime: '',      // 计时器
    Payload: PAYLOAD_APPOINTMENT_CREATE,
    showInformation: false,
    showNext: false,
    showGetPhoneNumMask: false,

    nameStorage: LOCALE_NAME,
    mobileStorage: LOCALE_TEL,

    users: {
      headimgurl: '',
    },
    houstType: {
      swipers: [],
    },
    houseTypeList: [],
    houseTypeArr: [],

    isNight: false,//夜单时间，false:不是，true:是
  }

  refTimerPicker = node => this.TimerPicker = node

  componentWillMount() {
    buryPoint()
   }

  async componentDidMount() {
    const { id, apartmentId } = this.$router.params
    let { Payload } = this.state
    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

    // 获取用户电话号码 如果没有电话号码则打开授权获取电话号码的弹窗
    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const name = res.data.data.user.name
        const userName = res.data.data.user.username
        const mobile = res.data.data.user.mobile

        if (name) {
          Payload = { ...Payload, name }
          this.setState({ nameStorage: name })
        } else {
          Payload = { ...Payload, name: userName }
          this.setState({ nameStorage: userName })
        }

        if (!name && !userName) { Payload = { ...Payload, name: LOCALE_NAME } }

        if (mobile) {
          Payload = { ...Payload, mobile }
          this.setState({ mobileStorage: mobile })
        } else {
          Payload = { ...Payload, mobile: LOCALE_TEL }
          this.setState({ showGetPhoneNumMask: true })
        }

      }
    })

    const { payload } = await this.props.dispatchUser()

    this.setState({
      Payload: { ...Payload, apartment: data.apartment_id, house_type: id, order_time: LOCALE_CHOISE_VIEW_ROOM_TIME },
      users: {
        headimgurl: payload.headimgurl,
      },
      houstType: {
        id: data.id,
        desc: data.desc,
        cost: data.cost,
        intro: data.one_word,
        apartmentTitle: data.apartment_title,
        swipers: data.pictures[0],
        title: `${data.title}·${data.apartment_title}`,
        priceTitle: data.price_title,
      },
    })

    // 初始化户型列表
    await this.props.dispatchApartmentShow({ id: apartmentId }).then(res => {
      const houseTypeListInal = res.data.data.house_types
      let houseTypeList = JSON.parse(JSON.stringify(houseTypeListInal))
      let index = 0
      houseTypeListInal.map((i) => {
        if (i.price_title === LOCALE_NO_LISTINGS) {
          houseTypeList.splice(index, 1)
        } else {
          index += 1
        }
      })
      const typeList = []
      houseTypeList && houseTypeList.length && houseTypeList.map((i, key) => {
        i.onlyId = key
        i.type = false
        i.active = false

        if (i.id === parseInt(id)) {
          i.type = true
          i.active = true

          this.setState({ houseTypeArr: [i.id] })
        }
        typeList.push(i)
      })

      this.setState({
        houseTypeList: [...typeList],
      })
    })

  }

  //判断是否在夜单时间内
  async componentDidShow() {
    const { code } = await Taro.login()
    Taro.setStorageSync('code', code)

    this.props.dispatchAppointmentNight().then((res) => {
      this.setState({
        isNight: res.data.data.is_night
      })
    })
  }

  async getPhoneNumber(e) {
    const { Payload } = this.state
    let code = Taro.getStorageSync('code')

    const { encryptedData: encrypt_data, iv } = e.currentTarget
    const urlCode = encodeURIComponent(code)
    const urlEncrypt_data = encodeURIComponent(encrypt_data)
    const urlIv = encodeURIComponent(iv)

    iv && encrypt_data && await this.props.dispatchUserPhone({ code: urlCode, encrypt_data: urlEncrypt_data, iv: urlIv }).then(res => {
      const mobile = res.data.data.user.mobile
      if (res) {
        this.setState({ Payload: { ...Payload, mobile } })
      }
      this.onClosePhoneMask()
    })

  }

  onClosePhoneMask() {
    this.setState({ showGetPhoneNumMask: false })
  }

  // 户型选择
  onChoiseHouseType(e, index) {
    const { houseTypeList, Payload, houseTypeArr } = this.state
    let newTypes = JSON.parse(JSON.stringify(houseTypeList))
    let newHouseTypeArr = JSON.parse(JSON.stringify(houseTypeArr))

    newTypes.map(i => {
      if (i.onlyId === index) {
        i.type = !i.type
        i.active = !i.active

        if (i.type === true && i.active === true) {
          newHouseTypeArr.push(i.id)
        } else {
          newHouseTypeArr.forEach((k, key) => {
            if (k === i.id) {
              newHouseTypeArr.splice(key, 1)
            }
          })
        }

        this.setState({ houseTypeArr: newHouseTypeArr })
      }
    })

    this.setState({
      Payload: { ...Payload, house_type: newHouseTypeArr.join(',') },
      houseTypeList: [...newTypes]
    })

  }


  //打开,关闭获取姓名和电话号码弹窗
  onOpenInputMask() {
    this.setState({ showInformation: true })
  }

  onCloseInputMask() {
    this.setState({ showInformation: false })
  }

  onConfirmInputMask() {
    const { mobileStorage, nameStorage, Payload } = this.state
    if (!(/^1[3456789]\d{9}$/.test(mobileStorage))) {
      Taro.showToast({
        title: LOCALE_MOBILE_FORMAT_ERROR,
        icon: LOCALE_NONE,
        duration: 2000
      })
      return false;
    } else {
      this.setState({
        showInformation: false,
        Payload: {
          ...Payload,
          name: nameStorage ? nameStorage : LOCALE_NAME,
          mobile: mobileStorage ? mobileStorage : LOCALE_TEL
        }
      })
    }
  }

  //获得姓名
  onGetName({ detail: { value } }) {
    this.setState({ nameStorage: value })
  }
  //获得电话号码
  onGetTel({ detail: { value } }) {
    this.setState({ mobileStorage: value })
  }

  onCloseRequirement() {
    this.onClearInterval()
    Taro.navigateBack()
  }

  componentWillUnmount() {
    this.onClearInterval()
  }
  // 清除定时器
  onClearInterval() {
    clearInterval(this.state.sectime);
    clearInterval(this.state.getPost);
  }

  // 检查数据是否有空值,提示用户填写
  onChenkPayload() {
    const { Payload } = this.state
    const { house_type, mobile, name } = Payload
    const order_time = this.TimerPicker.__state.timeStr

    let judgeArr = [
      { title: LOCALE_NAME, value: name, default: LOCALE_NAME },
      { title: LOCALE_TEL, value: mobile, default: LOCALE_TEL },
      { title: LOCALE_VIEW_ROOM_DATE, value: order_time, default: LOCALE_CHOISE_VIEW_ROOM_TIME },
      { title: LOCALE_VIEWING_HOUSETYPE, value: house_type, default: '' },
    ]

    try {
      judgeArr.forEach(i => {
        if (!i.value || i.value === i.default) {
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

  //提交预约
  onAppointmentPost() {
    let { Payload, showNext } = this.state
    const order_time = this.TimerPicker.__state.timeStr
    Payload = { ...Payload, order_time }

    this.onChenkPayload() &&
      this.props.dispatchAppointmentCreate(Payload).then(res => {
        if (res.data && res.data.msg === LOCALE_APPOINTMENT_SUCCESS) {
          //倒计时，需要优化
          const { appointment } = res.data.data
          let that = this
          that.setState({
            showNext: !showNext,
            //请求serverId ，10秒钟一次
            getPost: setInterval(function () {
              that.props.dispatchAppointmentDetail({ id: appointment.id }).then((e) => {
                let nowServerId = parseInt(e.data.data.server_id)
                that.setState({ serverId: nowServerId })
                if (e.data.data.server_id !== 0) {
                  clearInterval(that.state.sectime);
                  clearInterval(that.state.getPost);
                }
              }
              )
            }, 10000),
            //倒计时
            sectime: setInterval(function () {
              //秒钟减一
              if (that.state.secTime > 0) {
                const { secTime } = that.state
                const count = secTime - 1
                that.setState({
                  secTime: count,
                  zeroSecTime: count
                })
                if (that.state.secTime <= 10) {
                  const nowZeroSecTime = '0' + count
                  that.setState({ zeroSecTime: nowZeroSecTime })
                }
              }
              //分钟减一
              if (that.state.secTime === 0 && that.state.minTime > 0) {
                that.state.minTime--
                that.setState({
                  secTime: 59,
                  zeroSecTime: 59,
                  zeroMinTime: that.state.minTime
                })
                if (that.state.minTime <= 10) {
                  const nowZeroMinTime = '0' + that.state.minTime
                  that.setState({ zeroMinTime: nowZeroMinTime })
                }
              }
              //分秒等于0，清除
              if (that.state.secTime === 0 && that.state.minTime === 0) {
                clearInterval(that.state.sectime);
              }
            }, 1000)
          })
        }
      })
  }


  render() {
    const { houstType, users: { headimgurl }, showInformation, Payload,
      showNext, zeroSecTime, zeroMinTime, serverId, houseTypeList, showGetPhoneNumMask, isNight } = this.state

    const { mobile, name } = Payload

    const { title, swipers, intro } = houstType

    return (
      <View className='page-white apartment-appointment'>
        {/* 获取用户电话号码弹窗 */}
        <GetAuthorizationMask
          type='getPhoneNumber'
          onClose={this.onClosePhoneMask}
          show={showGetPhoneNumMask}
          onFillPhone={this.getPhoneNumber}
        />
        {/* 预约成功弹窗1 */}
        <AppointmentPostMask
          show={showInformation}
          name={name}
          mobile={mobile}
          onCloseInputMask={this.onCloseInputMask}
          onConfirmInputMask={this.onConfirmInputMask}
          onGetName={this.onGetName}
          onGetTel={this.onGetTel}
        />
        {/* 预约成功弹窗2 */}
        <AppointmentPostNextMask
          show={showNext}
          onCloseRequirement={this.onCloseRequirement}
          secTime={zeroSecTime}
          minTime={zeroMinTime}
          serverId={serverId}
        />
        <View className='wrap-Style' >
          {/* 顶部的背景板 */}
          <ApartmentAppointmentHeader swipers={swipers} />

          {/* 圆角样式 */}
          <MaskTop />

          <View >
            {/* 标题内容 */}

            <View className='pl-3'>
              <View className='text-bold text-huge mt-2' >{title}</View>
              <View className='text-secondary text-normal'>{intro}</View>
            </View>
            {/* 分割线 */}
            <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>

            {/* 主体内容 */}
            <View style='width:96%;background:#FFFFFF;border-radius:4%;box-shadow: 0 2px #FCFCFC;' className='p-2 ' border='all'>
              <View className=' mt-2' border='all' >
                {/* 姓名 电话  如果用户没有登录此块显示引导登录按钮 */}
                {
                  Taro.getStorageSync('user_info').token ?
                    <View className='at-row ml-3 mt-1'>

                      <View className='at-col-2'>
                        <AtAvatar circle image={headimgurl}></AtAvatar>
                      </View>

                      <View className='at-col-4 ml-1'>
                        <View>
                          <View className='text-bold'>{name}</View>
                          <View className='at-row'>
                            <AtIcon value='iphone' size='13'></AtIcon>
                            <View className='text-small mt-1'>{mobile}</View>
                          </View>
                        </View>
                      </View>

                      <View className='at-col-5 at-row at-row__justify--end at-row__align--center' onClick={this.onOpenInputMask}>
                        <View className='text-normal'>{LOCALE_CHANGE}</View>
                        <AtIcon value='chevron-right' size='13' color='#888888'></AtIcon>
                      </View>
                    </View>
                    :
                    <LoginButton params={this.$router.params} backTwo message={LOCALE_LOGIN_APPOINTMENT} />
                }

                {/* 选择户型 */}
                <View className='mt-2 '>

                  {/* 多选提示 */}
                  {houseTypeList.length && <View className='text-secondary text-small ml-3 mt-3 mb-1 text-red'>{LOCALE_MULTIPLE_SELECTION}</View>}
                  {
                    houseTypeList.length ? houseTypeList.map((i, key) =>
                      <AtTag
                        type={i.type ? "primary" : ""}
                        className='ml-3 mt-1 mb-3'
                        circle
                        key={i.id}
                        size='small'
                        onClick={(e) => this.onChoiseHouseType(e, key)}
                        active={i.active}
                      >
                        <View className='apartment-appointment-font' >{i.title}</View>
                      </AtTag>
                    ) : <View className='text-secondary ml-3'>{LOCALE_NO_OPTIONAL_UNIT}</View>
                  }
                </View>

                {/* 中间横线 */}
                <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>

                {/* 下面部分 夜单 */}
                {isNight && <View className='text-normal ml-3 mt-2'>{LOCALE_NIGHT_LIST_NOTICE}</View>}
                <View className='mt-3 ml-3 appointment-padding at-row at-row__justify--around ' >
                  <View className=' text-bold text-large at-col at-col__align--center' >{LOCALE_APPOINTMENT_LOOKTIME}</View>

                  <View className='p-2 at-col at-col-9 text-center' >
                    <TimePicker ref={this.refTimerPicker} />
                  </View>

                  <View className='at-col at-col-1'></View>
                </View>
                {/* 按钮 */}
                {
                  Taro.getStorageSync('user_info').token ?
                    <AtButton
                      circle
                      className='m-3 btn-yellow active'
                      onClick={this.onAppointmentPost}
                    >{LOCALE_APPOINTMENT_POST}</AtButton>
                    :
                    <AtButton
                      circle
                      className='m-3 btn-grey active'
                    >{LOCALE_APPOINTMENT_POST}</AtButton>
                }

              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

export default AppointmentPost
