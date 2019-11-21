import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'


// 自定义组件
import ServicesHeader from '@components/services-header'
import ServicesList from '@components/services-list'
import loginButton from '@components/login-button'
import Carousel from '@components/carousel'

import { PAYLOAD_APPOINTMENT_LIST } from '@constants/api'
import {
  LOCALE_NO_TRIP_TODAY,
  LOCALE_NONE,
  LOCALE_APPOINTMENT_VIEW_TRIP,
  LOCALE_LOGIN_VIEW_TRIP
} from '@constants/locale'
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
    flag: false,
  }

  refserviceList = (node) => this.ServiceList = node

  componentDidShow() {
    buryPoint()
    Taro.showTabBarRedDot({ index: 2 })
    const { flag } = this.state
    flag && this.onSetReset()
  }

  onShow() {
    const { payload } = this.state
    this.props.dispatchAppointmentList(payload).
      then((res) => {
        res && !res.data.data.total &&
          Taro.showToast({
            title: LOCALE_NO_TRIP_TODAY,
            icon: LOCALE_NONE,
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
    Taro.pageScrollTo({ scrollTop: 0, duration: 0 })
  }

  componentDidHide() {
    this.setState({ flag: true })
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
    const { payload } = this.state



    return (
      <View className='page-white'>
        <View className='wrap-Style' >
          <ServicesHeader
            onClickLeft={this.onToLeft}
            onClickRight={this.onToRight}
          />

          <View className='page-middile mt-2' onClick={this.onNavigateToRisk}>
            <Image lazyLoad src={RISK_MONEY_BANNER} mode='widthFix' className='appointment-ad'></Image>
          </View>
          <View className='at-row at-row__align--center  p-2' >
            <View className='at-row at-row__align--center at-row__justify--center ml-2 appointment-yellowbot' ></View>
            <View className='pl-2 text-bold text-large'>{LOCALE_APPOINTMENT_VIEW_TRIP}</View>
          </View>

          {/* 未登录 */}
          {!Taro.getStorageSync('user_info').token && <View className='mt-5'>
            <loginButton message={LOCALE_LOGIN_VIEW_TRIP} />
          </View>}

          <ServicesList
            lists={appointments.list}
            ref={this.refserviceList}
            defaultPayload={payload}
            onSetReset={this.onSetReset}
            dispatchList={this.props.dispatchAppointmentList}
            dispatchNextPageList={this.props.dispatchNextPageApartmentList}
          />

          {/* 没有数据 */}
          {!appointments.list.length && Taro.getStorageSync('user_info').token &&
            <View className='at-row at-row__align--center at-row__justify--center' style={{ marginTop: Taro.pxTransform(100) }}>
              <Image lazyLoad src={NONE_TRAVE}></Image>
            </View>}

        </View>

      </View>
    )
  }
}

export default ServicesHome
