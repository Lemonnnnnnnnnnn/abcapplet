// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Picker } from '@tarojs/components'
import { AtAvatar, AtIcon, AtButton, AtTag } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义变量
import { PAYLOAD_APPOINTMENT_CREATE } from '@constants/api'
import {
  LOCALE_PRICE_START,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_CHANGE,
  LOCALE_APPOINTMENT_LOOKTIME,
  LOCALE_APPOINTMENT_POST,
} from '@constants/locale'
// 自定义组件
import Board from '../../components/board'
import AppointmentPostMask from '@components/appointment-post-mask'
import AppointmentPostNextMask from '@components/appointment-post-next-mask'



@connect(state => state, {
  ...userActions,
  ...apartmentActions,
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
    sectime: '',			// 计时器
    Payload: PAYLOAD_APPOINTMENT_CREATE,
    showInformation: false,
    showNext: false,

    dateSel: '请选择看房日期',
    timeSel: '请选择看房时间',
    name: '姓名',
    tel: '电话',
    width: 375 * 2,
    height: 250 * 2,
    users: {
      headimgurl: '',
    },
    houstType: {
      swipers: [],
    },
    screenHeight: '',
    screenWidth: '',
    types: [],
  }


  async componentDidMount() {
    const { id = 83 } = this.$router.params
    const { Payload } = this.state

    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })

    await this.props.dispatchGetUserMsg().then(res => {
      const name = res.data.data.user.name
      const tel = res.data.data.user.mobile
      name && this.setState({
        name: name,
      })
      tel && this.setState({
        tel: tel,
      })
    })

    const { payload } = await this.props.dispatchUser()
    this.setState({
      Payload: { ...Payload, apartment: data.apartment_id, house_type: data.id },
      users: {
        headimgurl: payload.headimgurl,
      },
      houstType: {
        id: data.id,
        desc: data.desc,
        cost: data.cost,
        intro: data.one_word,
        apartmentTitle: data.apartment_title,
        swipers: data.pictures.map(i => ({ url: i })),
        title: `${data.title}·${data.apartment_title}`,
        priceTitle: data.price_title,
      },
      types: data.other_house_type
    })
    Taro.getSystemInfo()
      .then(res => {
        this.setState({
          screenHeight: res.screenHeight - 140,
          screenWidth: res.screenWidth,
        })
      })

    // 初始化户型列表
    const types = data.other_house_type

    const typeList = []

    types.map((i, key) => {
      i.onlyId = key
      i.type = false
      i.active = false
      typeList.push(i)
    })

    typeList[0].type = true
    typeList[0].active = true

    this.setState({
      types: [...typeList],
    })
  }

  // 户型选择


  onChoiseHouseType(e, index) {
    const { types } = this.state
    let newTypes = JSON.parse(JSON.stringify(types))

    newTypes.map(i => {

      if (i.onlyId === index) {
        i.type = !i.type
        i.active = !i.active
        // const { id: type_floor } = types[i.id]
        // this.props.onChange({ payload: { type_floor } })
      } else {
        i.type = false
        i.active = false
      }
    })
    this.setState({
      types: [...newTypes]
    })

  }



  //获取日期
  onDateChange = e => {
    const { Payload, timeSel, tel, name } = this.state
    const nowOrderTime = e.detail.value + " " + timeSel
    this.setState({
      dateSel: e.detail.value,
      Payload: { ...Payload, order_time: nowOrderTime, mobile: tel, name: name }
    })
  }

  //获取时间
  onTimeChange = e => {
    const { Payload, dateSel } = this.state
    const nowOrderTime = dateSel + " " + e.detail.value
    this.setState({
      timeSel: e.detail.value,
      Payload: { ...Payload, order_time: nowOrderTime }
    })
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
      secTime: 59,
      minTime: 29,
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
    const { name, tel, dateSel, timeSel } = this.state
    if (name === '姓名'
      || tel === '电话'
      || dateSel === '请选择放日期'
      || timeSel === '请选择看房时间') {
      Taro.showToast({
        icon: 'none',
        title: '请检查数据是否正确',
      })
      return false
    }
    return true
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
  render() {
    const { houstType, height, width, users, name, tel, showInformation,
      showNext, zeroSecTime, zeroMinTime, serverId, screenHeight, screenWidth, types } = this.state
    const allStyle = { height: screenHeight + 'px', width: screenWidth + 'px' }

    console.log(types)

    const {
      title, swipers, cost, priceTitle, intro,
    } = houstType
    const { headimgurl } = users
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))
    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    const fontStyle = {
      fontSize: "15px",
      padding: "0 5px"
    }

    return (
      <View >
        <View style={allStyle}>
          <View style={style}>
            <Swiper
              autoplay
              circular
              style={style}
              displayMultipleItems={1}
            >
              {swipers.map(i => <SwiperItem key={i.url}>
                <Image
                  style={style}
                  mode='scaleToFill'
                  src={`${i.url.split('?')[0]}?imageView2/1/w/${width}/h/${height}`}
                />
              </SwiperItem>)}
            </Swiper>
          </View>
          {/* 头部 */}

          <Board className='p-3 height:20%;width:100%' border='bottom' >
            <View className='text-bold text-huge' >{title}</View>
            <View className='text-secondary text-normal'>{intro}</View>

            <View className='at-row  mt-2'>
              <View className='at-col-5 text-huge text-bold text-yellow'>{isNaNPrice ? priceTitle : `${LOCALE_PRICE_SEMICOLON}${parseFloat(priceTitle)}${LOCALE_PRICE_START}`}</View>
              <View className='at-col-7'>
                <View className='p-1 at-row at-row__justify--center' style='background:#F8F8F8; border-radius: 30px'>
                  <View className='text-mini text-secondary'>{cost}</View>
                </View>
              </View>

            </View>
          </Board>

          <View style='height:36%;width:96%;background:#FFFFFF;border-radius:4%;box-shadow: 0 2px #FCFCFC;' className='p-2 mt-2' border='all'>
            <View className=' mt-2' border='all' >
              <View className='at-row ml-3 mt-3'>
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
                  <View className='text-small text-muted'>{LOCALE_CHANGE}</View>
                  <AtIcon value='chevron-right' size='13' color='#888888'></AtIcon>
                </View>
              </View>

              {/* 选择户型 */}
              {
                types && types.map((i, key) =>
                  <AtTag
                    type={i.type ? "primary" : ""}
                    className='ml-3 mr-1 mt-3 mb-3'
                    circle
                    onClick={(e) => this.onChoiseHouseType(e, key)}
                    key={key}
                    active={i.active}>
                    <View style={fontStyle}>{i.title}</View>
                  </AtTag>)
              }




              {/* 中间横线 */}

              <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>
              {/* 下面部分 */}
              <View className='mt-3 at-row ml-3'>
                <View className='at-col-4 text-bold text-large at-row at-row__align--center'>{LOCALE_APPOINTMENT_LOOKTIME}</View>
                <View className='at-col-3 p-1 at-row at-row__justify--center' style='background:#F8F8F8; border-radius: 30px'>

                  {/* <View className='text-small '>选择看房日期</View> */}
                  <Picker mode='date' onChange={this.onDateChange}>
                    <View className='text-small'>
                      {this.state.dateSel}
                    </View>
                  </Picker>
                </View>
                <View className='at-col-3 p-1 at-row at-row__justify--center ml-1' style='background:#F8F8F8; border-radius: 30px'>
                  {/* <View className='text-small '>选择看房时间</View> */}
                  <Picker mode='time' onChange={this.onTimeChange}>
                    <View className='text-small'>
                      {this.state.timeSel}
                    </View>
                  </Picker>
                </View>
              </View>
              {/* 按钮 */}
              <AtButton
                circle

                className='m-3 btn-yellow active'
                onClick={this.onAppointmentPost}
              >{LOCALE_APPOINTMENT_POST}</AtButton>

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
            secTime={zeroSecTime}
            minTime={zeroMinTime}
            serverId={serverId}
            onClose={this.onCloseNext}
          />
        </View>
      </View>
    )
  }
}

export default AppointmentPost
