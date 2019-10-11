import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import Decorate from '@components/decorate'


// Redux 相关
import { connect } from '@tarojs/redux'

import * as apartmentActions from '@actions/apartment'
import * as appointmentActions from '@actions/appointment'
import BaseComponent from '../../components/base';

import buryPoint from '../../utils/bury-point'

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
    apartmentTitle: '',
    roomNo: '',
    tenancy: '',
    status: 0,
  }
  componentWillMount() {

    buryPoint()
    const { id } = this.$router.params
    this.props.dispatchAppointRewordOrderDetail({ id }).then((res) => {

      this.setState({
        apartmentTitle: res.data.data.apartment_title,
        roomNo: res.data.data.room_no,
        tenancy: res.data.data.tenancy,
        status: res.data.data.status,
      })
    }
    )
  }
  render() {

    const { apartmentTitle, roomNo, tenancy, status } = this.state

    return (
      <View className='message-background' style={{ 'padding-top': '75px', 'padding-bottom': '30px' }}>
        {/* 头部 */}
        <View class='board--grey board--fixed-top ' style='position:absolute;z-index:9' >
          <Decorate height='126' />
        </View>
        <View className='mx-3 appointment-board'  >
          <View className='px-3 py-2 mt-2 mb-5'>
            <View className='at-row mt-3'>
              <View className='border-decorate border-decorate-yellow mt-1 ml-1' style={{ height: '20px' }}></View>
              <View className='text-bold text-large ml-2'>{apartmentTitle}</View>
            </View>

            <View className='text-muted text-normal at-row at-row__justify--around mt-2 ml-1'>
              <View className='at-row at-col-5'>
                <View>房号：</View>
                <View>{roomNo}</View>
              </View>
              <View className='at-row at-col-5'>
                <View>租期：</View>
                {tenancy === 6 && <View>六个月</View>}
                {tenancy === 12 && <View>一年</View>}
              </View>
            </View>
            {/* 事件线 */}
            <View className='mt-5 ml-1'>

              <View className='at-row' >
                <View className='appointment-audit '></View>
                <View className='text-normal text-yellow page-middile ml-2'>提交</View>
              </View>

              <View className='appointment-line' ></View>

              <View className='at-row' >
                <View className='appointment-audit'></View>

                {status === 1 && <View className='text-normal text-yellow page-middile ml-2'>管家审核中</View>}

                {(status === 2 || status === 4 || status === 5) && <View className='text-normal text-yellow page-middile ml-2'>管家审核通过</View>}

                {status === 3 &&
                  <View className='at-row'>
                    <View className='text-normal text-yellow page-middile ml-2'>管家审核未通过</View>
                    <View style='width:156px;background:rgba(248,248,248,1);opacity:1;border-radius:12px;' className='page-middile ml-4'>
                      <View className='text-normal '>手机号码有误</View>
                    </View>
                  </View>
                }

              </View>

              {(status === 1 || status === 3) ? <View className='appointment-noline' ></View> :
                <View className='appointment-line' ></View>}
              {(status === 1 || status === 3) &&
                <View className='at-row' >
                  <View className='appointment-noaudit'></View>
                  <View className='text-normal text-muted page-middile ml-2'>平台审核</View>
                </View>
              }

              {status === 4 &&
                <View className='at-row' >
                  <View className='appointment-audit'></View>
                  <View className='text-normal text-yellow page-middile ml-2'>平台审核通过</View>
                </View>
              }
              {status === 2 &&
                <View className='at-row' >
                  <View className='appointment-audit'></View>
                  <View className='text-normal text-yellow page-middile ml-2'>平台审核中</View>
                </View>
              }

              {status === 5 &&
                <View className='at-row' >
                  <View className='appointment-audit'></View>
                  <View className='text-normal text-yellow page-middile ml-2'>平台未通过</View>
                  <View style='width:156px;background:rgba(248,248,248,1);opacity:1;border-radius:12px;' className='page-middile ml-4'>
                    <View className='text-normal '>手机号码有误</View>
                  </View>
                </View>
              }

              {status === 4 ? <View className='appointment-line' ></View> :
                <View className='appointment-noline' ></View>}
              {status === 4 ?
                <View className='at-row mb-4' >
                  <View className='appointment-audit'></View>
                  <View className='text-normal text-yellow page-middile ml-2'>恭喜您成功返现</View>
                </View>
                :
                <View className='at-row mb-4' >
                  <View className='appointment-noaudit'></View>
                  <View className='text-normal text-muted page-middile ml-2'>返现</View>
                </View>
              }

            </View>
          </View>
        </View>

        <View style='position:absolute;top:80%' className='at-row at-row__justify--center text-muted'>
          {status === 4 &&
            <View>
              <View className='page-middile'>*请留意 公寓ACB公众号 </View>
              <View className='page-middile'>发来的现金红包！</View>
            </View>}
          {/* {(status === 3 ||status===5 )&&
            <View style='width:90%' className='ml-2'>
              <AtButton  className='mx-2 btn-yellow active' size='normal' circle  >重新提交审核</AtButton>
            </View>} */}
        </View>
      </View>



    )
  }
}

export default AppointmentDetail
