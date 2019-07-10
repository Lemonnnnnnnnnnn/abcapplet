import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import ServicesHeader from '@components/services-header'
import ServicesList from '@components/services-list'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

import Board from '../../components/board'

@connect(state => state , {
  ...appointmentActions,
})

class ServicesHome extends Component {
  config = {
    navigationBarTitleText: '找房服务',
  }
  componentWillMount() {
    this.props.dispatchAppointmentList()
  }
  onToLeft(){
    console.log('地图找房');

  }
  onToRight(){
    console.log('通勤找房');
  }

  render() {
    console.log('=======')
    console.log(this.props)
    const { appointments } = this.props
    console.log(appointments)
    return (
      <View>
        <ServicesHeader
          onClickLeft={this.onToLeft}
          onClickRight={this.onToRight}
        />
        <Board className='p-3 at-row'>
          <View className='button--dot at-col at-col-1'></View>
          <View className='at-col at-col-3 text-bold text-huge'>
            今天
          </View>
          <View className='at-col at-col-3'>
            当前时间
          </View>
        </Board>
        <ServicesList>
            items = {appointments.list}
        </ServicesList>

      </View>

    )
  }
}

export default ServicesHome
