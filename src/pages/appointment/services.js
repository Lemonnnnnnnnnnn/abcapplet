import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

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
    navigationBarTitleText: '找房服务',
  }
  state = {
    payload: PAYLOAD_APPOINTMENT_LIST,
    time: '',
    NowCurrentPage: 2,
  }

  componentDidMount() {
    const { payload } = this.state
    this.setState({ payload: { ...payload, current_page: 2 } })
  }

  componentDidShow() {
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
  }


  componentDidHide(){
    const { payload } = this.state
    this.setState({ payload: { ...payload, current_page: 1 } })
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
    // Taro.navigateTo({
    //   url:'/pages/appointment/mapHouse/index'
    // })

  }
  //调转到通勤找房
  onToRight() {
    // Taro.navigateTo({
    //   url:'/pages/appointment/commuteHouse/index'
    // })
  }

  render() {
    const { appointments } = this.props
    const { time } = this.state

    return (
      <View style={{ overflow: "hidden" }}>
        <ServicesHeader
          onClickLeft={this.onToLeft}
          onClickRight={this.onToRight}
        />
        <View className=' at-col '>
          {/* <View className='at-row mt-3  mb-3'>
            <View className='mt-2  button-yellow ml-4' ></View>
            <View className='at-col at-col-2 text-bold ml-3'>
              今天
            </View>
            <View className='at-col at-col-1 text-normal mt-1'>
              {time}
            </View>
          </View> */}
          <View >
            <ServicesList
              lists={appointments.list}
              time={time}
            />
          </View>
        </View>
      </View>

    )
  }
}

export default ServicesHome
