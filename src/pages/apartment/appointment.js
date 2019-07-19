// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'
import { AtAvatar ,AtIcon, AtButton,Picker } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义变量
import { PAYLOAD_APPOINTMENT_CREATE} from '@constants/api'
import {
  LOCALE_PRICE_START,
  LOCALE_PRICE_SEMICOLON,
  LOCALE_CHANGE,
  LOCALE_APPOINTMENT_LOOKTIME ,
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
    serverId:0,
    zeroMinTime:29,
    zeroSecTime:59,
    secTime:59,
    minTime:29,
    sectime:'',			// 计时器
    Payload: PAYLOAD_APPOINTMENT_CREATE,
    showInformation:false,
    showNext:false,
    dateSel:'请选择看房日期',
    timeSel:'请选择看房时间',
    name:'姓名',
    tel:'电话',
    width: 375 * 2,
    height: 250 * 2 ,
    users:{
      headimgurl:''
    },
    houstType: {
      swipers: [],
    },
  }


  async componentDidMount () {
    const { id = 83 } = this.$router.params
    const { data: { data } } = await this.props.dispatchHouseTypeShow({ id })
    const  { payload } = await this.props.dispatchUser()
    const { Payload } = this.state
    this.setState({

      Payload:{ ...Payload, apartment:data.apartment_id,house_type:data.id}   ,
      users:{
        headimgurl:payload.headimgurl,
      },
      houstType: {
        id: data.id,
        desc: data.desc,
        cost: data.cost,
        apartmentTitle: data.apartment_title,
        swipers: data.pictures.map(i => ({ url: i })),
        title: `${data.title}·${data.apartment_title}`,
        priceTitle: data.price_title,

      },

    })
  }
  //获取日期
  onDateChange = e => {
    const { Payload,  timeSel} = this.state
    const nowOrderTime = e.detail.value + " " +timeSel
    this.setState({
      dateSel: e.detail.value,
      Payload:{ ...Payload, order_time:nowOrderTime}
    })

  }

   //获取时间
   onTimeChange = e => {
    const { Payload,  dateSel} = this.state
    const nowOrderTime = dateSel + " " +e.detail.value
    this.setState({
      timeSel: e.detail.value,
      Payload:{ ...Payload, order_time:nowOrderTime}
    })
  }
  //打开,关闭获取姓名和电话号码弹窗
  onClose(){
    const { showInformation } = this.state
    this.setState({showInformation:!showInformation})
  }
  //关闭预约成功
  onCloseNext(){
    this.setState({
      showNext:false,
      zeroMinTime:29,
      zeroSecTime:59,
      secTime:59,
      minTime:29,
    })
    clearInterval(this.state.sectime);
    clearInterval(this.state.getPost);
  }

  //获得姓名
  onGetName(value){
    const { Payload } = this.state
    this.setState({
      name:value.detail.value,
      Payload:{ ...Payload, name:value.detail.value}
    })
  }
  //获得电话号码
  onGetTel(value){
    const {  Payload } = this.state
    if(!(/^1[3456789]\d{9}$/.test(value.detail.value))){
      Taro.showToast({
        title: '电话号码填写错误',
        icon: 'none',
        duration: 2000
      })
      return false;
    }else{
      this.setState({
        tel:value.detail.value,
        Payload:{ ...Payload, mobile:value.detail.value}
      })
    }
  }
  onChenkPayload(){
    const { name,tel, dateSel,timeSel} = this.state
    if(name === '姓名'
      || tel === '电话'
      || dateSel==='请选择放日期'
      || timeSel==='请选择看房时间'){
        Taro.showToast({
          icon: 'none',
          title: '请检查数据是否正确',
        })
        return false
      }
      return true
  }

  //提交预约
  onAppointmentPost(){
    const {Payload,showNext }=this.state
    this.onChenkPayload() &&
    this.props.dispatchAppointmentCreate( Payload).then(res=>
    {
      if(res.data.msg==='预约成功'){
        //倒计时，需要优化
        const { appointment } = res.data.data
        let that = this
        that.setState({
          showNext:!showNext,
          //请求serverId ，10秒钟一次
          getPost:setInterval(function(){
            that.props.dispatchAppointmentDetail({id:appointment.id}).then((e)=>
            {
              let nowServerId = parseInt(e.data.data.server_id)
               that.setState({serverId:nowServerId})
              if(e.data.data.server_id!==0){
                clearInterval(that.state.sectime);
                clearInterval(that.state.getPost);
              }
            }
          )
          },10000),
          //倒计时
          sectime:setInterval(function(){
            //秒钟减一
            if(that.state.secTime>0){
                const { secTime } = that.state
                const count = secTime - 1
                that.setState({
                  secTime:count,
                  zeroSecTime:count
                })
                if(that.state.secTime<=10){
                  const nowZeroSecTime = '0' + count
                  that.setState({zeroSecTime:nowZeroSecTime})
                }
            }
            //分钟减一
            if(that.state.secTime===0 && that.state.minTime>0){
                that.state.minTime--
                that.setState({
                  secTime:59,
                  zeroSecTime:59,
                  zeroMinTime:that.state.minTime
                })
                if(that.state.minTime<=10){
                  const nowZeroMinTime = '0' + that.state.minTime
                  that.setState({zeroMinTime:nowZeroMinTime})
                }
            }
            //分秒等于0，清除
            if(that.state.secTime===0 && that.state.minTime===0){
                clearInterval(that.state. sectime);
            }
          },1000)
        })
      }})
  }
  render() {
    const { houstType,height ,width,users ,name,tel,showInformation,showNext,zeroSecTime,zeroMinTime,serverId } = this.state
    const {
      title, swipers,  cost, priceTitle, intro,
    } = houstType
    const { headimgurl } = users
    const isNaNPrice = Number.isNaN(parseInt(priceTitle))
    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    return (
      <View >
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
              // src={i.url}
              src={`${i.url.split('?')[0]}?imageView2/1/w/${width}/h/${height}`}
            />
          </SwiperItem>)}
        </Swiper>
  {/* 头部 */}
            <Board className='p-3' border='bottom'>
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

            <Board className='p-3 mt-2' border='top'>
              <View className='at-row'>
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
                <View className='at-col-6 at-row at-row__justify--end at-row__align--center' onClick={this.onClose}>
                  <View className='text-small text-muted'>{LOCALE_CHANGE}</View>
                  <AtIcon value='chevron-right' size='13' color='#888888'></AtIcon>
                </View>
              </View>
              {/* 中间横线 */}

                <View className='at-row at-row__justify--center mt-3' style='width:100%;height:2px;background:#F8F8F8'></View>
                {/* 下面部分 */}
                <View className='mt-3 at-row'>
                  <View className='at-col-3 text-bold text-large at-row at-row__align--center'>{LOCALE_APPOINTMENT_LOOKTIME }</View>
                  <View className='at-col-4 p-1 at-row at-row__justify--center' style='background:#F8F8F8; border-radius: 30px'>

                    {/* <View className='text-small '>选择看房日期</View> */}
                    <Picker mode='date' onChange={this.onDateChange}>
                      <View className='text-small'>
                        {this.state.dateSel}
                      </View>
                    </Picker>
                  </View>
                  <View className='at-col-4 p-1 at-row at-row__justify--center ml-1' style='background:#F8F8F8; border-radius: 30px'>
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
                  className='mt-3 mb-2 btn-yellow active'
                  onClick={this.onAppointmentPost}
                >{LOCALE_APPOINTMENT_POST}</AtButton>
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
            </Board>
      </View>
    )
  }
}

export default AppointmentPost
