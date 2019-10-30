// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image, Button, Text } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

import {
  PAGE_ORDER_CREATE,
  PAGE_ORDER_SHOW,
  PAGE_APPOINTMENT_DETAIL,
  PAGE_APPOINTMENT_AUDIT,
} from '@constants/page'
import {
  LOCAL_APPOINTMENT_APPOINT,
  LOCAL_APPOINTMENT_LOOKROOM,
  LOCAL_APPOINTMENT_AGENCY,
  LOCALE_CASH_BACK,
  LOCAL_APPOINTMENT_DISLIKE,
  LOCAL_APPOINTMENT_CONTACT_HOUSEKEPPER,
  LOCAL_APPOINTMENT_CONTACT_CUSTOMER,
  LOCAL_APPOINTMENT_LOOKROOM_AGENCY,
  LOCAL_APPOINTMENT_CASHBACK_REDPACK,
  LOCAL_APPOINTMENT_OFFLINE_SIGNING,
  LOCAL_APPOINTMENT_GET_CASHBACK,
  LOCALE_APPOINTMENT_EVALUTION,
  LOCALE_APPOINTMENT_HAVE_EVALUTION,
  LOCAL_APPOINTMENT_GO_SIGN ,
  LOCAL_APPOINTMENT_DETAIL_REVIWE,
  LOCAL_APPOINTMENT_GO_PAY,
  LOCAL_APPOINTMENT_ORDER_DETAIL,
  LOCAL_APPOINTMENT_BOOK_ONLINE,
  LOCAL_APPOINTMENT_GOODSERVICE,
  LOCAL_APPOINTMENT_LOCKSUCCESSD,
  LOCAL_APPOINTMENT_APPOINTED,
  LOCAL_APPOINTMENT_GET_REDPACK,
  LOCAL_APPOINTMENT_AUDIT,
  LOCAL_APPOINTMENT_HASEDCASHBACK,
  LOCAL_APPOINTMENT_HOUSEKEPPERSUCCESS,
  LOCAL_APPOINTMENT_HOUSEKEPPERFAIL,
  LOCAL_APPOINTMENT_AUDITFAIL,
} from '@constants/locale'
import { APPOINTMENT_COUPON ,APPOINT_ANGE } from '@constants/picture'

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
    const { id } = item
    this.props.dispatchAppointChangeTime({ appointment_id: id }).then(() =>
      Taro.navigateTo({ url: `${PAGE_ORDER_CREATE}?appointment_id=${id}` }))
  }
  // ---------------------------
  // appointment_status	状态描述	进度(共有5)	按钮	显示文字
  // 1 　	管家未接单	预约	联系管家(灰,不可点击),联系客服(亮)
  // 2	管家已接单	预约 >>>	联系管家(亮)，联系客服(亮)
  // 3	看房时间到	预约 >>> 看房	不满意(灰色,可点击)，预定房间(亮), 已签约(亮)
  // 4	看房一小时后	预约 >>> 看房 >>>	不满意(灰色,可点击)，预定房间(亮), 已签约(亮)
  // 10	等待支付	预约 >>> 看房 >>> 签约	去支付(亮)	等待支付
  // 11	等待锁定 	预约 >>> 看房 >>> 签约	查看订单详情(亮)	等待锁定
  // 5	锁定成功	预约 >>> 看房 >>> 签约	去签约(亮)	已锁定成功
  // 6	已签约(提交订单的)	预约 >>> 看房 >>> 签约	服务评价(亮)如果已评价显示查看评价	已签约
  // 7	已签约并获得退租险	预约 >>> 看房 >>> 签约	服务评价(亮)如果已评价显示查看评价	已签约并获得退租险
  // 8	签约审核中 	可签约公寓：
  // 预约 >>> 看房 >>> 签约
  // 不可签约公寓：
  // 预约 >>> 看房 >>> 返现	查看审核详情(亮)	签约审核中
  // 12	管家审核通过	可签约公寓：
  // 预约 >>> 看房 >>> 签约
  // 不可签约公寓：
  // 预约 >>> 看房 >>> 返现	查看审核详情(亮)	管家审核通过
  // 13	管家审核拒绝	可签约公寓：
  // 预约 >>> 看房 >>> 签约
  // 不可签约公寓：
  // 预约 >>> 看房 >>> 返现	查看审核详情(亮)	管家审核拒绝
  // 14	审核拒绝	可签约公寓：
  // 预约 >>> 看房 >>> 签约
  // 不可签约公寓：
  // 预约 >>> 看房 >>> 返现	查看审核详情(亮)	审核拒绝
  // 9	已签约（审核通过）	预约 >>> 看房 >>> 签约	服务评价(亮)如果已评价显示查看评价	已签约
  // 不满意
  // status	状态描述	进度(共有5)	按钮	显示文字
  // 7	不满意	预约 >>> 看房 >>> 不满意	服务评价(亮) 如果已评价显示查看评价	将为您提供更好的服务
  // ----------------------------
  render() {
    const { status, step, item, comment } = this.props

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

        {status >= 3 && status <= 14 ? <View className=' at-col-2'>
          <View className='page-middile text-normal  text-yellow apartment-item-noaAppoint' >
            {LOCAL_APPOINTMENT_LOOKROOM}
          </View>
        </View>
          :
          <View className=' at-col-2'>
            <View className='page-middile text-normal text-muted apartment-item-haveAppoint' >
              {LOCAL_APPOINTMENT_LOOKROOM}
            </View>
          </View>
        }

        {(status >= 4 && status <= 14) || step === 7 ? <View className='at-row at-col-2'>
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


        {(status === 3 || status === 4) && step === 7
          ?
          <View className='page-middile text-normal text-yellow apartment-item-noaAppoint' >{LOCAL_APPOINTMENT_DISLIKE}</View>
          :
          <View className='at-col at-col-2'>
            {status >= 5 && status <= 14 ? <View className='inherit-Height'>
              <View className='at-row at-row__align--center at-row__justify--end text-normal text-yellow apartment-item-noaAppoint position-relative' >
                {(status === 8 || status === 9 || status === 12 || status === 13 || status === 14) ?
                  <Image src={APPOINTMENT_COUPON} mode='widthFix' className='appointment-coupon' ></Image>
                  :
                  <Image src={APPOINT_ANGE} mode='widthFix' className='appointment-coupontwo' ></Image>
                }
                {<Text >{(status === 8 || status === 9 || status === 12 || status === 13 || status === 14) ? LOCALE_CASH_BACK : LOCAL_APPOINTMENT_AGENCY}</Text>}
              </View>
            </View>
              :
              item && item.is_sign ? <View className='at-row at-row__align--center at-row__justify--end text-normal text-muted apartment-item-haveAppoint position-relative icon' >
                <Image src={APPOINT_ANGE} mode='widthFix' className='appointment-coupontwo' ></Image>
                {LOCAL_APPOINTMENT_AGENCY}
              </View>
                :
                <View className='at-row at-row__align--center at-row__justify--end  text-normal text-muted apartment-item-haveAppoint position-relative icon' >
                  <Image src={APPOINTMENT_COUPON} mode='widthFix' className='appointment-coupon' ></Image>
                  {LOCALE_CASH_BACK}
                </View>
            }
          </View>}
      </View>

      <View className=' page-middile mt-2'>
        <View className='line'></View>
      </View>

      {status === 1 && <View className='at-row at-row__justify--around  mt-3 pb-3' >
        <View className='text-normal page-middile text-white apartment-item-buttonGrey' >{LOCAL_APPOINTMENT_CONTACT_HOUSEKEPPER}</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onOpenCustom}>{LOCAL_APPOINTMENT_CONTACT_CUSTOMER}</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onSign}>{LOCAL_APPOINTMENT_LOOKROOM_AGENCY}</View>
      </View>}

      {status === 2 && <View className='at-row at-row__justify--around mt-3 pb-3'>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.props.onContact}>{LOCAL_APPOINTMENT_CONTACT_HOUSEKEPPER}</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onOpenCustom}>{LOCAL_APPOINTMENT_CONTACT_CUSTOMER}</View>
        <View className='text-normal page-middile apartment-item-buttonYellow' onClick={this.onSign}>{LOCAL_APPOINTMENT_LOOKROOM_AGENCY}</View>
      </View>}

      {((status === 3 || status === 4) && step !== 7) && <View className='at-row at-row__justify--around  mt-3 pb-3'>
        <View className='mt-3'>
          <View className='text-normal page-middile  mt-1 apartment-item-buttonGrayBo' onClick={this.props.onDisLike.bind(this, item)}>{LOCAL_APPOINTMENT_DISLIKE}</View>
        </View>
        <View >
          <View className='text-mini text-center page-middile text-secondary'>{LOCAL_APPOINTMENT_CASHBACK_REDPACK}</View>
          <View className='text-normal  mt-1 apartment-item-buttonYellowBo' style='position:relative' onClick={this.onAgency}>
            <View style='position:absolute;top:12%;left:-1%' >
              <Image style={{ width: Taro.pxTransform(72), height: Taro.pxTransform(68) }} src={APPOINTMENT_COUPON} ></Image>
            </View>
            <View className='ml-4 mt-1'>
              <Text>{LOCAL_APPOINTMENT_OFFLINE_SIGNING}</Text>
            </View>
          </View>
        </View>
        {item && item.is_sign && <View>
          <View className='text-mini page-middile  text-secondary'>获得退租险和租金立减</View>
          <View className=' text-normal  mt-1 apartment-item-buttonYellowBo' style='position:relative' onClick={this.onBookRoom}>
            <View style='position:absolute;top:12%;left:-1%' >
              <Image style={{ width: Taro.pxTransform(72), height: Taro.pxTransform(68) }} src={APPOINT_ANGE} ></Image>
            </View>
            <View className='ml-4 mt-1'>
              <Text>{LOCAL_APPOINTMENT_BOOK_ONLINE}</Text>
            </View>
          </View>
        </View>}

      </View>}

      {(status === 3 || status === 4) && step === 7 && <View className='at-row page-middile mt-3 pb-3'>
        <View className='text-bold text-normal '>{LOCAL_APPOINTMENT_GOODSERVICE}</View>
        {!comment.remark ? <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>{LOCALE_APPOINTMENT_EVALUTION}</View> :
          <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>{LOCALE_APPOINTMENT_HAVE_EVALUTION}</View>}
      </View>}

      {status === 5 && <View className='at-row page-middile mt-3 pb-3'>
        {status === 5 && <View className='text-bold '>{LOCAL_APPOINTMENT_LOCKSUCCESSD}</View>}
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>{LOCAL_APPOINTMENT_GO_SIGN }</View>
      </View>}

      {status >= 6 && status <= 14 && <View className='at-row page-middile mt-3 pb-3'>
        {status === 6 && <View className='text-bold '>{LOCAL_APPOINTMENT_APPOINTED}</View>}
        {status === 7 && <View className='text-bold text-normal'>{LOCAL_APPOINTMENT_GET_REDPACK}</View>}
        {status === 8 && <View className='text-bold '>{LOCAL_APPOINTMENT_AUDIT}</View>}
        {status === 9 && <View className='text-bold '>{LOCAL_APPOINTMENT_HASEDCASHBACK}</View>}
        {status === 12 && <View className='text-bold '>{LOCAL_APPOINTMENT_HOUSEKEPPERSUCCESS}</View>}
        {status === 13 && <View className='text-bold '>{LOCAL_APPOINTMENT_HOUSEKEPPERFAIL}</View>}
        {status === 14 && <View className='text-bold '>{LOCAL_APPOINTMENT_AUDITFAIL}</View>}
        {(status === 6 || status === 7 || status === 9) && <View>
          {!comment.remark ? <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>{LOCALE_APPOINTMENT_EVALUTION}</View> :
            <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onEvalution}>{LOCALE_APPOINTMENT_HAVE_EVALUTION}</View>}
        </View>
        }
        {(status === 12 || status === 13 || status === 14 || status === 8) && <View>
          <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.props.onGudit}>{LOCAL_APPOINTMENT_DETAIL_REVIWE}</View>
        </View>
        }
      </View>}

      {(status === 10) && <View className='at-row page-middile pb-3'>
        {status === 10 && <View className='text-bold '>“等待支付”</View>}
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>{LOCAL_APPOINTMENT_GO_PAY}</View>
      </View>}

      {(status === 11) && <View className='at-row page-middile  pb-3'>
        {status === 11 && <View className='text-bold '>“等待锁定”</View>}
        <View className='text-normal page-middile apartment-item-buttonYellowBo' onClick={this.onGoAgency}>{LOCAL_APPOINTMENT_ORDER_DETAIL}</View>
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
