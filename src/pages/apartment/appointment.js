// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image, Picker, Text } from '@tarojs/components'
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
} from '@constants/locale'
// 自定义组件
import AppointmentPostMask from '@components/appointment-post-mask'
import AppointmentPostNextMask from '@components/appointment-post-next-mask'
import GetAuthorizationMask from '@components/get-authorization-mask'
import MaskTop from '@components/maskTop'
import loginButton from '@components/login-button'




const nowTime = new Date()
let currentMonth = nowTime.getMonth()
let currentDay = nowTime.getDate()
let currentHours = nowTime.getHours()
let currentYear = nowTime.getFullYear()

let payloadH = 0

if (currentHours >= 0 && currentHours < 8) {
  payloadH = '09:30'
} else if (currentHours > 19 && currentHours <= 24) {
  payloadH = '21:30'
} else {
  payloadH = currentHours + 2 + ':00'
}

// currentHours > 19 ? payloadH = '21:30' : payloadH = currentHours + 2 + ':00'

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

    dateSel: '请选择看房日期',
    timeSel: '请选择看房时间',
    name: '姓名',
    tel: '电话',
    width: 375 * 2,
    height: 200 * 2,
    users: {
      headimgurl: '',
    },
    houstType: {
      swipers: [],
    },
    screenHeight: '',
    screenWidth: '',
    houseTypeList: [],
    currentTime: [],
    secTimeClick: false,

    houseTypeArr: [],

    isNight: false,//夜单时间，false:不是，true:是
  }


  async getPhoneNumber(e) {
    let code = Taro.getStorageSync('code')
    // code ? code = code : code =  await Taro.login()

    const { encryptedData: encrypt_data, iv } = e.currentTarget
    const urlCode = encodeURIComponent(code)
    const urlEncrypt_data = encodeURIComponent(encrypt_data)
    const urlIv = encodeURIComponent(iv)

    iv && encrypt_data && await this.props.dispatchUserPhone({ code: urlCode, encrypt_data: urlEncrypt_data, iv: urlIv }).then(res => {
      const tel = res.data.data.user.mobile
      if (res) {
        this.setState({ tel: tel })
      }
      this.onClosePhoneMask()
    })

  }

  onClosePhoneMask() {
    this.setState({ showGetPhoneNumMask: false })
  }


  async componentDidMount() {

    const { id, apartmentId } = this.$router.params
    const { Payload } = this.state

    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const name = res.data.data.user.name
        const tel = res.data.data.user.mobile
        name ? this.setState({
          name: name,
        }) :
          this.setState({
            name: res.data.data.user.username,
          })
        tel ? this.setState({
          tel: tel,
        }) :
          this.setState({ showGetPhoneNumMask: true })
      }
    })

    const { payload } = await this.props.dispatchUser()

    this.setState({
      Payload: { ...Payload, apartment: data.apartment_id, house_type: id },
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
    Taro.getSystemInfo()
      .then(res => {
        this.setState({
          screenHeight: res.screenHeight - 140,
          screenWidth: res.screenWidth,
        })
      })

    // 初始化户型列表

    await this.props.dispatchApartmentShow({ id: apartmentId }).then(res => {
      const houseTypeListInal = res.data.data.house_types
      let houseTypeList = JSON.parse(JSON.stringify(houseTypeListInal))
      let index = 0
      houseTypeListInal.map((i) => {
        if (i.price_title === "暂无房源") {
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


    // 计算可供选择的时间列表

    let currentHoursIndex = 0
    if (currentHours * 2 - 15 > 24) {
      currentHoursIndex = 24
    } else if (currentHours * 2 - 15 < 0) {
      currentHoursIndex = 0
    } else {
      currentHoursIndex = currentHours * 2 - 15
    }


    let currentTime = [0, currentMonth, currentDay - 1, currentHoursIndex]
    this.setState({ currentTime: currentTime })

    const finalList = []

    // 生成用于map的空数组
    const monthList_NaN = Array.from({ length: 12 })
    const timeList_NaN = Array.from({ length: 25 })
    let dayList_NaN = []

    // 判断大小月与平年闰年

    let bigMonth = [1, 3, 5, 7, 8, 10, 12]
    let smailMonth = [4, 6, 9, 11]
    let judge = { "bigMonth": true, "flatYear": true }

    bigMonth.forEach(i => {
      if (i === currentMonth + 1) {
        judge.bigMonth = true
      }
    })
    // console.log(judge)

    smailMonth.forEach(i => {
      if (i === currentMonth + 1) {
        judge.bigMonth = false
      }
    })

    if ((currentYear % 4 === 0 && currentYear % 100 != 0) || currentYear % 400 === 0) {
      judge.flatYear = false
    } else {
      judge.flatYear = true
    }

    if (currentMonth !== 1) {
      judge.bigMonth ? dayList_NaN = Array.from({ length: 31 }) : dayList_NaN = Array.from({ length: 30 })
    } else if (currentMonth === 1) {
      judge.flatYear ? dayList_NaN = Array.from({ length: 28 }) : dayList_NaN = Array.from({ length: 29 })
    }

    //填充数据
    let yearList = [nowTime.getFullYear() + "年"]
    let monthList = []
    let dayList = []
    let timeList = []

    monthList_NaN.map((i, key) => monthList.push(key + 1 + "月"))
    dayList_NaN.map((i, key) => dayList.push(key + 1 + "日"))
    timeList_NaN.map((i, key) => {
      key % 2 === 0 && timeList.push((key / 2) + 9 + " :30")
      key % 2 === 1 && timeList.push(((key + 1) / 2) + 9 + " :00")
    })


    finalList.push(yearList)
    finalList.push(monthList)
    finalList.push(dayList)
    finalList.push(timeList)
    this.setState({ range: finalList })
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

        // i.type === true && i.active === true && newHouseTypeArr.push(i.id)
        this.setState({ houseTypeArr: newHouseTypeArr })
      }
    })

    this.setState({
      Payload: { ...Payload, house_type: newHouseTypeArr.join(',') },
      houseTypeList: [...newTypes]
    })

  }

  onClickPicker() {
    const { Payload, tel, name, range, secTimeClick } = this.state
    const year = (range[0][0]).split("年")[0]

    if (!secTimeClick) {
      currentMonth = nowTime.getMonth()
      currentDay = nowTime.getDate()
      currentHours = nowTime.getHours()

      if (currentHours >= 0 && currentHours < 8) {
        payloadH = '09:30'
      } else if (currentHours > 19 && currentHours <= 24) {
        payloadH = '21:30'
      } else {
        payloadH = currentHours + 2 + ':00'
      }

      // currentHours > 19 ? payloadH = '21:30' : payloadH = currentHours + 2 + ':00'

      let currentHoursIndex = 0
      if (currentHours * 2 - 15 > 24) {
        currentHoursIndex = 24
      } else if (currentHours * 2 - 15 < 0) {
        currentHoursIndex = 0
      } else {
        currentHoursIndex = currentHours * 2 - 15
      }

      let currentTime = [0, currentMonth, currentDay - 1, currentHoursIndex]
      this.setState({ currentTime: currentTime })

      let hoursJudge = 0

      currentHours > 19 ? hoursJudge = 21 + ':30' : hoursJudge = this.onJudgeTen(currentHours + 2) + ':00'

      const payloadStr = year + "-"
        + this.onJudgeTen(currentMonth + 1)
        + "-" + this.onJudgeTen(currentDay)
        + " " + payloadH

      this.setState({
        dateSel: payloadStr,
        Payload: { ...Payload, order_time: payloadStr, mobile: tel, name: name }
      })
    }
    this.setState({ secTimeClick: true })
  }

  onColumnChange = e => {
    const { column, value } = e.detail
    const { Payload, tel, name, range } = this.state
    const year = (range[0][0]).split("年")[0]

    if (column === 1) { currentMonth = value }
    if (column === 2) {
      currentDay = value + 1
    }
    if (column === 3) {
      if (value % 2 === 0) {
        payloadH = this.onJudgeTen(value / 2 + 9) + ':30'
      } else if (value % 2 === 1) {
        payloadH = this.onJudgeTen((value + 1) / 2 + 9) + ':00'
      }
    }

    const payloadStr = year + "-"
      + this.onJudgeTen(currentMonth + 1) + "-"
      + this.onJudgeTen(currentDay) + " "
      + payloadH


    this.setState({
      dateSel: payloadStr,
      Payload: { ...Payload, order_time: payloadStr, mobile: tel, name: name }
    })


    if (column !== 1) { return }

    let finalList = []

    const yearList = range[0]
    const monthList = range[1]
    const timeList = range[3]

    let judge = { "bigMonth": true, "flatYear": true }

    let dayList = []
    const dayBigDayList_NaN = Array.from({ length: 31 })
    const daySmailDayList_NaN = Array.from({ length: 30 })
    const dayflatDayList_NaN = Array.from({ length: 28 })
    const dayleapDayList_NaN = Array.from({ length: 29 })

    if (value === 0 || value === 2 || value === 4 || value === 6 || value === 7 || value === 9 || value === 11) {
      judge.bigMonth = true
    } else if (value === 3 || value === 5 || value === 8 || value === 10) {
      judge.bigMonth = false
    }

    if ((year % 4 === 0 && year % 100 != 0) || year % 400 === 0) {
      judge.flatYear = false
    } else {
      judge.flatYear = true
    }

    if (value !== 1) {
      judge.bigMonth ? dayBigDayList_NaN.map((i, key) => dayList.push(key + 1 + "日")) : daySmailDayList_NaN.map((i, key) => dayList.push(key + 1 + "日"))
    } else if (value === 1) {
      judge.flatYear ? dayflatDayList_NaN.map((i, key) => dayList.push(key + 1 + "日")) : dayleapDayList_NaN.map((i, key) => dayList.push(key + 1 + "日"))
    }

    finalList.push(yearList)
    finalList.push(monthList)
    finalList.push(dayList)
    finalList.push(timeList)
    this.setState({ range: finalList })

  }

  onJudgeTen(num) {
    let newNum = parseInt(num)
    if (newNum < 10) {
      return "0" + newNum
    } else {
      return newNum
    }
  }


  //打开,关闭获取姓名和电话号码弹窗
  onClose() {
    const { showInformation, name, tel, Payload } = this.state

    this.setState({
      showInformation: !showInformation,
      Payload: { ...Payload, name: name, mobile: tel }
    })
  }

  //关闭预约成功
  onCloseNext() {
    this.setState({
      showNext: false,
      zeroMinTime: 29,
      zeroSecTime: 59,
      dateSel: '请选择看房日期',
      timeSel: '请选择看房时间',
      name: '姓名',
      tel: '电话',
    })
    clearInterval(this.state.sectime);
    clearInterval(this.state.getPost);
  }

  //获得姓名
  onGetName(value) {
    const { Payload } = this.state
    this.setState({
      name: value.detail.value,
      Payload: { ...Payload, name: value.detail.value }
    })
  }
  //获得电话号码
  onGetTel(value) {
    const { Payload } = this.state
    if (!(/^1[3456789]\d{9}$/.test(value.detail.value))) {
      Taro.showToast({
        title: '电话号码填写错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      this.setState({
        tel: value.detail.value,
        Payload: { ...Payload, mobile: value.detail.value }
      })
    }
  }
  onChenkPayload() {
    const { name, tel, dateSel, timeSel, Payload } = this.state
    if (tel === '电话') {
      Taro.showToast({
        icon: 'none',
        title: '亲，请点击修改填写看房手机号码',
      })
      return false
    } else if (name === '姓名') {
      Taro.showToast({
        icon: 'none',
        title: '亲，请点击修改填写看房者姓名',
      })
      return false
    } else if (dateSel === '请选择看房日期') {
      Taro.showToast({
        icon: 'none',
        title: '亲，请选择看房日期哦',
      })
      return false
    } else if (!Payload.house_type) {
      Taro.showToast({
        icon: 'none',
        title: '亲，您还未选择所看户型呢',
      })
      return false
    }
    return true
  }


  onCloseRequirement() {
    clearInterval(this.state.sectime);
    clearInterval(this.state.getPost);
    Taro.navigateBack()
  }

  componentWillUnmount() {
    clearInterval(this.state.sectime);
    clearInterval(this.state.getPost);
  }


  //提交预约
  onAppointmentPost() {
    const { Payload, showNext } = this.state

    this.onChenkPayload() &&
      this.props.dispatchAppointmentCreate(Payload).then(res => {
        if (res.data.msg === '预约成功') {
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

  // 跳转登录页

  // onNavigation() {
  //   const cLength = Taro.getCurrentPages().length
  //   const currentPage = Taro.getCurrentPages()[cLength - 1].route
  //   Taro.setStorageSync('lastPage', '/' + currentPage)

  //   Taro.redirectTo({ url: PAGE_USER_AUTH })

  // }

  render() {
    const { houstType, height, users, tel, showInformation, name,
      showNext, zeroSecTime, zeroMinTime, serverId, houseTypeList, range, currentTime, showGetPhoneNumMask, isNight } = this.state

    const {
      title, swipers, priceTitle, intro,
    } = houstType
    const { headimgurl } = users
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))
    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
      overflow: "hidden",
    }

    const blackOpacityStyle = {
      width: '100%',
      height: Taro.pxTransform(height),
      opacity: 0.5,
      top: 0,
      backgroundColor: "#000",
      position: "absolute",
    }

    const fontStyle = {
      fontSize: "15px",
      padding: "0 5px"
    }

    const imageStyle = {
      width: '100%',

    }

    const imageFontStyle = {
      color: "#fff",
      fontWeight: "700",
      postion: "absolute",
      fontSize: Taro.pxTransform(54),
      letterSpacing: Taro.pxTransform(4),
    }

    const whiteLineStyle = {
      postion: "absolute",
      width: Taro.pxTransform(100),
      height: Taro.pxTransform(10),
      backgroundColor: '#fff',
      marginBottom: Taro.pxTransform(20),
      borderRadius: Taro.pxTransform(10),
    }

    const imageFontWholeStyle = {
      position: "absolute",
      left: Taro.pxTransform(60),
      top: Taro.pxTransform(100),
      zIndex: 9,
    }

    const borderRadiusStyle = {
      borderTopLeftRadius: Taro.pxTransform(24),
      borderTopRightRadius: Taro.pxTransform(24),
      backgroundColor: "#fff",
      position: "relative",
    }

    const page = {
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
    }

    return (
      <View style={page}>
        <View style={{ overflow: "hidden" }}>
          <View >

            <View style={imageFontWholeStyle}>
              <View style={whiteLineStyle} ></View>
              <View style={imageFontStyle} className='text-super'>即刻预约看房,</View>
              <View style={imageFontStyle} className='text-super'>线上签约0元享退租险！</View>
            </View>

            <View style={style}>
              <Image style={imageStyle} src={swipers}></Image>
              <View style={blackOpacityStyle}>
              </View>

            </View>
            {/* 头部 */}

            <MaskTop />

            <View style={borderRadiusStyle}>
              <View className='pl-3'>
                <View className='text-bold text-huge mt-2' >{title}</View>
                <View className='text-secondary text-normal'>{intro}</View>
              </View>
              <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>


              <View style='width:96%;background:#FFFFFF;border-radius:4%;box-shadow: 0 2px #FCFCFC;' className='p-2 ' border='all'>
                <View className=' mt-2' border='all' >

                  {/* 姓名 电话 */}
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
                              <View className='text-small mt-1'>{tel}</View>
                            </View>
                          </View>
                        </View>

                        <View className='at-col-5 at-row at-row__justify--end at-row__align--center' onClick={this.onClose}>
                          <View className='text-normal'>{LOCALE_CHANGE}</View>
                          <AtIcon value='chevron-right' size='13' color='#888888'></AtIcon>
                        </View>
                      </View>
                      :
                      <loginButton backTwo message='请登录后预约' />

                  }



                  {/* 选择户型 */}
                  <View className='mt-2 '>

                    {/* 多选提示 */}
                    {houseTypeList.length !== 0 && <View className='text-secondary text-small ml-3 mt-3 mb-1 text-red'>*可多选</View>}
                    {
                      houseTypeList && houseTypeList.length ? houseTypeList.map((i, key) =>
                        <AtTag
                          type={i.type ? "primary" : ""}
                          className='ml-3 mt-1 mb-3'
                          circle
                          key={key}
                          size='small'
                          onClick={(e) => this.onChoiseHouseType(e, key)}
                          active={i.active}>
                          <View style={fontStyle}>{i.title}</View>
                        </AtTag>
                      ) : <View className='text-secondary ml-3'>暂无可选户型</View>
                    }
                  </View>

                  {/* 中间横线 */}

                  <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>

                  {/* 下面部分 */}
                  {isNight && <View className='text-normal ml-3 mt-2'>提示：管家休息期间，接单会延迟</View>}
                  <View className='mt-3 ml-3 appointment-padding at-row at-row__justify--around ' >
                    <View className=' text-bold text-large at-col at-col__align--center' >{LOCALE_APPOINTMENT_LOOKTIME}</View>
                    <View className='p-2 at-col at-col-8' style={{ background: '#F8F8F8', borderRadius: '30px', textAlign: 'center' }} >


                      {/* <View className='text-small '>选择看房日期</View> */}

                      <Picker onClick={this.onClickPicker} value={currentTime} mode='multiSelector' range={range} onColumnChange={this.onColumnChange} >
                        <View className='text-small'>
                          {this.state.dateSel}
                        </View>
                      </Picker>

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
              <AppointmentPostMask
                show={showInformation}
                name={name}
                tel={tel}
                onClose={this.onClose}
                onGetName={this.onGetName}
                onGetTel={this.onGetTel}
              />
              <AppointmentPostNextMask
                show={showNext}
                onCloseRequirement={this.onCloseRequirement}
                secTime={zeroSecTime}
                minTime={zeroMinTime}
                serverId={serverId}
              />
              <GetAuthorizationMask
                type='getPhoneNumber'
                onClose={this.onClosePhoneMask}
                show={showGetPhoneNumMask}
                onFillPhone={this.getPhoneNumber} />


            </View>
            {/* </Board> */}

          </View>
        </View>

      </View>
    )
  }
}

export default AppointmentPost
