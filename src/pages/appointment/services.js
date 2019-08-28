import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import ServicesHeader from '@components/services-header'
import ServicesList from '@components/services-list'

import {
  PAYLOAD_APPOINTMENT_LIST
} from '@constants/api'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

@connect(state => state, {
  ...appointmentActions,
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
    NowCurrentPage: 2,
  }

  refAppointmentList = (node) => this.appointmentList = node

  componentDidShow() {
    this.onShow()
  }

  onShow() {
    const { payload } = this.state
    this.props.dispatchAppointmentList(payload).
      then((res) => {
        this.setState({
          time: res.data.data.date
        })
        if (res.data.data.total === 0) {
          Taro.showToast({
            title: '今天暂无行程',
            icon: 'none',
            duration: 2000
          })
        }
      }
      )
    this.setState({ payload: { ...payload, current_page: 2 } })
  }
  async onPullDownRefresh() {
    await this.onHide()
    const { payload } = this.state
    this.props.dispatchAppointmentList({ payload: { ...payload, current_page: 1 } }).
      then((res) => {
        this.setState({
          time: res.data.data.date,
          NowCurrentPage: 2,
          payload: { ...payload, current_page: 2 }
        })
      })
      Taro.stopPullDownRefresh()
  }
  componentDidHide() {
    this.onHide()
  }
  onHide() {
    const { payload } = this.state
    this.props.dispatchAppointmentList({ current_page: 100000, page_size: 10 }).then(() =>
      this.setState({
        NowCurrentPage: 2,
        payload: { ...payload, current_page: 1 }
      })
    )
  }



  /**
   * 到底部加载行程下一页
   */
  onReachBottom() {
    const { payload, NowCurrentPage } = this.state
    const currentPageNow = NowCurrentPage + 1
    this.setState({
      NowCurrentPage: currentPageNow,
      payload: {
        ...payload, current_page: currentPageNow
      }
    })
    this.props.dispatchNextPageApartmentList(payload).
      then((res) => {
        if (res.data.data.list.length === 0) {
          Taro.showToast({
            title: '加载完毕',
            icon: 'none',
            duration: 2000
          })
        }
      }

      )
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

  render() {
    const { appointments } = this.props
    const { time, payload } = this.state



    const yellowPointStyle = {
      height: '8px',
      width: '8px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255, 201, 25, 1)'
    }

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
          <View className='at-row at-row__align--center  p-2' >
            <View className='at-row at-row__align--center at-row__justify--center ml-2' style={yellowPointStyle}></View>
            <View className='pl-2 text-bold text-large'>看房行程</View>

          </View>
          {
            appointments.list.length ?
              <View className=' at-col'>
                <View >
                  <ServicesList
                    lists={appointments.list}
                    time={time}
                    ref={this.refApartmentList}
                    defaultPayload={payload}
                    dispatchList={this.props.dispatchApartmentList}
                    dispatchNextPageList={this.props.dispatchNextPageApartmentList}
                  />
                </View>
              </View>
              :
              <View className='at-row at-row__align--center at-row__justify--center' style={{ marginTop: "50px" }}>
                <Image src='https://images.gongyuabc.com/image/noneTravelOne.png'></Image>
              </View>
          }
        </View>
      </View>
    )
  }
}

export default ServicesHome
