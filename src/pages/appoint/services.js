import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'


// 自定义组件
import ServicesHeader from '@components/services-header'
import ServicesList from '@components/services-list'
import loginButton from '@components/login-button'
import Carousel from '@components/carousel'

import { PAYLOAD_APPOINTMENT_LIST } from '@constants/api'

import { RISK_MONEY_BANNER, NONE_TRAVE } from '@constants/picture'
import { PAGE_RISK_LANDING } from '@constants/page'
import { AD_DISPATCH_DIST } from '@constants/ad'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'
import * as userActions from '@actions/user'
import * as adActions from '@actions/ad'


import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...appointmentActions,
  ...userActions,
  ...adActions
})

class ServicesHome extends Component {
  config = {
    navigationBarTitleText: '找房·行程',
    backgroundColor: '#FFFFFF',
    enablePullDownRefresh: true,
  }
  state = {
    payload: PAYLOAD_APPOINTMENT_LIST,
    time: '',
    adList: [],
  }

  refserviceList = (node) => this.ServiceList = node

  componentDidShow() {
    buryPoint()
    this.onShow()
  }

  // async componentWillMount() {
  //   const { payload: user } = await this.props.dispatchUser()
  //   const lastPage = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1].route
  //   AD_DISPATCH_DIST.find(i => i.url === lastPage &&
  //     this.props.dispatchAdList({ city: user.citycode, type: i.type }).then(
  //       ({ data: { data } }) => { this.setState({ adList: data.list }) })
  //   )
  // }

  onShow() {
    const { payload } = this.state
    this.props.dispatchAppointmentList(payload).
      then((res) => {
        res && this.setState({
          time: res.data.data.date
        })
        res && res.data.data.total === 0 &&
          Taro.showToast({
            title: '今天暂无行程',
            icon: 'none',
            duration: 2000
          })
      }
      )

  }
  async onPullDownRefresh() {
    this.ServiceList.onReset(null)

    Taro.stopPullDownRefresh()
  }

  onSetReset() {
    this.ServiceList.onReset(null)
  }

  componentDidHide() {

    this.props.user.token && this.ServiceList.onReset(null)
  }

  /**
   * 到底部加载行程下一页
   */
  onReachBottom() {
    this.ServiceList.onNextPage()

  }
  //调转到地图找房
  onToLeft() {
    Taro.navigateTo({
      url: '/pages/appointment/maphouse'
    })
  }
  //调转到通勤找房
  onToRight() {
    Taro.navigateTo({
      url: '/pages/appointment/commutehouse'
    })
  }

  onNavigateToRisk() {
    Taro.navigateTo({ url: PAGE_RISK_LANDING })
  }



  render() {
    const { appointments } = this.props
    const { time, payload, adList } = this.state

    const page = {
      backgroundColor: '#FFFFFF',
      minHeight: '100vh',
    }

    return (
      <View style={page}>
        <View style={{ overflow: "hidden" }}>
          <ServicesHeader
            onClickLeft={this.onToLeft}
            onClickRight={this.onToRight}
          />

          <View className='page-middile mt-2' onClick={this.onNavigateToRisk}>
            <Image src={RISK_MONEY_BANNER} className='appointment-ad'></Image>
          </View>
          <View className='at-row at-row__align--center  p-2' >
            <View className='at-row at-row__align--center at-row__justify--center ml-2 appointment-yellowbot' ></View>
            <View className='pl-2 text-bold text-large'>看房行程</View>

          </View>

          {
            Taro.getStorageSync('user_info').token ? <View>
              {
                appointments.list.length ?
                  <View className=' at-col'>
                    <View >
                      <ServicesList
                        lists={appointments.list}
                        ref={this.refserviceList}
                        defaultPayload={payload}
                        onSetReset={this.onSetReset}
                        dispatchList={this.props.dispatchAppointmentList}
                        dispatchNextPageList={this.props.dispatchNextPageApartmentList}
                      />
                    </View>
                  </View>
                  :
                  <View className='at-row at-row__align--center at-row__justify--center' style={{ marginTop: "50px" }}>
                    <Image src={NONE_TRAVE}></Image>
                  </View>
              }
            </View>
              :
              <View className='mt-5'>
                <loginButton message='请登录后查看行程' />
              </View>
          }



        </View>

      </View>
    )
  }
}

export default ServicesHome
