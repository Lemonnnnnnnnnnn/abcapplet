// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

import { PAGE_ORDER_CREATE, PAGE_ORDER_SHOW, PAGE_APPOINTMENT_DETAIL, PAGE_APPOINTMENT_AUDIT } from '@constants/page'
import {
  LOCAL_APPOINTMENT_APPOINT,
  LOCAL_APPOINTMENT_LOOKROOM,
  LOCAL_APPOINTMENT_AGENCY,
  LOCALE_CASH_BACK
} from '@constants/locale'
import { APPOINTMENT_COUPON } from '@constants/picture'

// 自定义组件
import BaseComponent from '@components/base'
import CustomerMask from '@components/customer-mask'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

import '../../styles/_apartment.scss'

@connect(state => state, {
  ...appointmentActions,
})
class ServiceItemShow extends BaseComponent {

  state = {
    showCustomer: false,
  }
  //打开客服弹窗
  onOpenCustom() {
    this.setState({
      showCustomer: true
    })
  }
  //打开客服弹窗
  onCloseCustom() {
    this.setState({
      showCustomer: false
    })
  }
  //已签约，前往签约下定
  onAgency() {
    const { item } = this.props

    const { id, is_can_reward, reward_id } = item
    if (!is_can_reward) {
      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_AUDIT}?id=${reward_id}`
      })
    }
    else {
      Taro.navigateTo({
        url: `${PAGE_APPOINTMENT_DETAIL}?id=${id}&isSign=${this.props.item.is_sign}`
      })
    }
  }
  //预定房间
  onBookRoom() {
    const { item } = this.props
    Taro.navigateTo({
      url: `${PAGE_ORDER_CREATE}?appointment_id=${item.id}`
    })
  }
  //去签约
  onGoAgency() {
    const { item } = this.props

    Taro.navigateTo({
      url: `${PAGE_ORDER_SHOW}?id=${item.order_id}`
    })

  }

  onSign() {
    const { item } = this.props
    const { apartment_id, id, house_type_id } = item
    this.props.dispatchAppointChangeTime({ appointment_id: id }).then(() =>
      Taro.navigateTo({ url: `${PAGE_ORDER_CREATE}?appointment_id=${id}&type_id=${house_type_id}&apartment_id=${apartment_id}` }))
  }
  // ---------------------------
  //   行程状态（status）
  // 1:管家未接单
  // 2:管家已接单
  // 3:看房时间到
  // 4:看房一小时后
  // 5:预定成功
  // 6:已签约返现(提交订单的)
  // 7:已签约返现并获得退租险
  // 8:签约审核中
  // 9:已签约返现(提交审核单的)
  // 10:等待支付
  // 11:等待锁定
  // 12:管家审核通过
  // 13:管家审核拒绝
  // 14:审核拒绝
  // ----------------------------
  render() {
    const { status, step, item, comment } = this.props
    // const { step, item, comment } = this.props
    // const status = 6

    const { showCustomer } = this.state
    return (<View className='mb-2' >
      <View className='at-row at-row__align--center page-middile ml-1' >
        <View className='at-col-2'>
          <View className='page-middile text-normal text-yellow apartment-item-noaAppoint' >
            {LOCAL_APPOINTMENT_APPOINT}
          </View>
        </View>

        {status !== 1 ? <View className='at-row at-col-2'>
          {[1, 2, 3].map(i =>
            <View key={i.id}>
              {/* 黄色 */}
              <AtIcon value='chevron-right' size='15' color=' #FFC919' />
            </View>)}
        </View>
          :
          <View className='at-row at-col-2'>
            {[1, 2, 3].map(i =>
              <View key={i.id}>
                <AtIcon value='chevron-right' size='15' color='#D2D2D2' />
              </View>)}
          </View>}

        {status >= 3 && status <= 11 ? <View className=' at-col-2'>
          <View className='page-middile text-normal  text-yellow apartment-item-noaAppoint' >
            看房
        </View>
        </View>
          :
          <View className=' at-col-2'>
            <View className='page-middile text-normal text-muted apartment-item-haveAppoint' >
              看房
        </View>
          </View>
        }

        {status >= 4 && status <= 11 ? <View className='at-row at-col-2'>
          {[1, 2, 3].map(i =>
            <View key={i.id}>
              <AtIcon value='chevron-right' size='15' color='#FFC919' />
            </View>)}
        </View>
          :
          <View className='at-row at-col-2'>
            {[1, 2, 3].map(i =>
              <View key={i.id}>
                <AtIcon value='chevron-right' size='15' color=' #D2D2D2' />
              </View>)}
          </View>}


        {status === 4 && step === 7
          ?
          <View className='page-middile text-normal text-yellow apartment-item-noaAppoint' >不满意</View>
          :
          <View className='at-col at-col-2'>
            {status >= 5 && status <= 11 ? <View className='inherit-Height'>
              <View className='at-row at-row__align--center at-row__justify--end text-normal text-yellow apartment-item-noaAppoint position-relative' >
                <Image src={APPOINTMENT_COUPON} mode='widthFix' className='appointment-coupon' ></Image>
                <Text >{item.is_sign ? LOCAL_APPOINTMENT_AGENCY : LOCALE_CASH_BACK}</Text>
              </View>
            </View>
              :
              <View className='page-middile text-normal text-muted apartment-item-haveAppoint ' >
                {LOCAL_APPOINTMENT_AGENCY}
              </View>
            }
          </View>}
      </View>

      <View className=' page-middile mt-2'>
        <View className='line'></View>
      </View>

      {status === 1 && <View className='at-row at-row__justify--around  mt-3 pb-3' >
        <View className='text-normal page-middile text-white apartment-item-buttonGrey' >联系管家</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onOpenCustom}>联系客服</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onSign}>已看房去签约</View>
      </View>}

      {status === 2 && <View className='at-row at-row__justify--around mt-3 pb-3'>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.props.onContact}>联系管家</View>
        <View className='text-normal page-middile  ml-4 apartment-item-buttonYellow' onClick={this.onOpenCustom}>联系客服</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onSign}>已看房去签约</View>
      </View>}

      {(status === 3 || status === 4) && step !== 7 && <View className='at-row at-row__justify--around  mt-3 pb-3'>
        <View className='mt-3'>
          <View className='text-normal page-middile  mt-1 apartment-item-buttonGrayBo' onClick={this.props.onDisLike.bind(this, item)}>不满意</View>
        </View>
        <View >
          <View className='text-mini text-center page-middile text-secondary'>获得返现红包</View>
          <View className='text-normal page-middile  mt-1 apartment-item-buttonYellowBo' onClick={this.onAgency}>线下已签约</View>
        </View>
        <View>
          <View className='text-mini page-middile  text-secondary'>获得退租险及返现</View>
          <View className=' text-normal page-middile mt-1 apartment-item-buttonYellowBo' onClick={this.onBookRoom}>
            <Image className='mt-1 appointment-coupon' src={APPOINTMENT_COUPON} ></Image>
            <Text>在线预定</Text>
          </View>
        </View>

      </View>}

      {status === 6 || status === 9 && <View className='at-row page-middile mt-3 pb-3'>
        <View className='text-bold text-normal '>“将为您提供更好的服务”</View>
        {!comment.remark ? <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>服务评价</View> :
          <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>查看评价</View>}
      </View>}

      {status === 6 || status === 9 && <View className='at-row page-middile mt-3 pb-3'>
        <View className='text-bold text-normal'>“已锁定成功”</View>
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>去签约</View>
        {!comment.remark ? <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>服务评价</View> :
          <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>查看评价</View>}
      </View>}

      {status >= 6 && status <= 14 && <View className='at-row page-middile mt-3 pb-3'>
        {status === 6 && <View className='text-bold '>“已签约返现”</View>}
        {status === 7 && <View className='text-bold text-normal'>“已签约返现并获得退租险”</View>}
        {status === 8 && <View className='text-bold '>“签约审核中”</View>}
        {status === 9 && <View className='text-bold '>“已签约返现”</View>}
        {status === 12 && <View className='text-bold '>“管家审核通过”</View>}
        {status === 13 && <View className='text-bold '>“管家审核拒绝”</View>}
        {status === 14 && <View className='text-bold '>“审核拒绝”</View>}
        {status === 6 || status === 9 && <View>
          {!comment.remark ? <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>服务评价</View> :
            <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>查看评价</View>}
        </View>
        }
        {status >= 12 && status <= 14 && <View>
          <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onGudit}>审核详情</View>
        </View>
        }
      </View>}


      {(status === 10) && <View className='at-row page-middile mt-3 pb-3'>
        {status === 10 && <View className='text-bold '>“等待支付”</View>}
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>去支付</View>
      </View>}

      {(status === 11) && <View className='at-row page-middile mt-3 pb-3'>
        {status === 11 && <View className='text-bold '>“等待锁定”</View>}
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>查看订单</View>
      </View>}


      <CustomerMask
        show={showCustomer}
        onClose={this.onCloseCustom}
      />

    </View>


    )

  }
}

export default ServiceItemShow
