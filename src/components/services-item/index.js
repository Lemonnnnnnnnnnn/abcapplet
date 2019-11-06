// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'
import ServiceEvalution from '@components/service-evaluation-mask'
import ServiceIntention from '@components/service-intention-mask'
import ServiceItemShow from '@components/services-item/show'

// NPM 包
import classNames from 'classnames'

import {
  PAGE_HOUSE_TYPE_SHOW,
  PAGE_APPOINTMENT_AUDIT,
  PAGE_RISK_LANDING
} from '@constants/page'


import {
  LOCALE_APPOINTMENT_DETAIL,
  LOCALE_APPOINTMENT_HASLOOK,
  LOCALE_APPOINTMENT_SUMMON,
  LOCALE_APPOINTMENT_BELONG,
  LOCALE_BOOK_SUPPORTED_NOT,
  LOCALE_NONE,
  LOCALE_RISK_MONEY_SUPPORT,
  LOCALE_POINT,
  LOCALE_TIMES
} from '@constants/locale'

import { APPOINTMENT_OVER, ICON_HEAD_NO } from '@constants/picture'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'


@connect(state => state, {
  ...appointmentActions,
})

class ServiceItem extends BaseComponent {
  static defaultProps = {
    width: 650,
    height: 380,
    minWidth: 650,
    minHeight: 222,
    mini: false,
    service: { cover: '' },
    className: '',
  }
  state = {
    showEvalution: false,//看房评价
    showIntention: false,//看房意向
    haveEvalution: false,//是否已经评价
    haveIntention: false,//是否已有意向
    step: 1,
    middileTop: 0
  }

  onIntention() {
    this.setState({ haveIntention: true })
  }

  onEvalution() {
    this.setState({ haveEvalution: true })
  }

  //跳转详情
  onNavigation() {
    const { service } = this.props

    const { house_type_id } = service
    Taro.navigateTo({
      url: `${PAGE_HOUSE_TYPE_SHOW}?id=${house_type_id}`
    })
  }
  //不满意
  onDisLike(value) {

    this.props.dispatchAppointUnsatis({ id: value.id }).then(() => {
      this.props.onSetReset()
    })

  }
  //服务评价
  onEvalution() {
    this.setState({
      showEvalution: true
    })
  }

  // 关闭服务评价
  onCloseEvalution() {
    this.setState({
      showEvalution: false
    })
  }
  // 关闭看房意向
  onCloseIntention() {
    this.setState({
      showIntention: false
    })
  }

  onalert() {
    Taro.showToast({
      title: LOCALE_BOOK_SUPPORTED_NOT,
      icon: LOCALE_NONE,
      duration: 2000
    })
  }
  //联系管家
  onContact() {
    const { service } = this.props
    const { server_user } = service
    Taro.makePhoneCall({ phoneNumber: server_user.mobile })
  }
  //查看审核状态
  onGudit() {
    const { service } = this.props

    Taro.navigateTo({
      url: `${PAGE_APPOINTMENT_AUDIT}?id=${service.reward_id}`
    })

  }

  onNavigateToRisk() {
    Taro.navigateTo({ url: PAGE_RISK_LANDING })
  }


  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { service } = this.props

    const { haveIntention, haveEvalution, showIntention, showEvalution, step, middileTop } = this.state


    const { id, cover, apartment_title, house_type_title, is_sign,
      order_time, server_id, server_user, comment, look_time, intention, remark, date, status, appointment_status } = service

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height


    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    return (
      <View className='pl-2 pr-2 pb-3 mt-1 m-2  home position-relative' >
        <View className={classNames('apartment')} >
          {/* 头部 */}
          <View className='service-header' >

            {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
            {cover
              ?
              <View>
                <View className='service-image-mask' ></View>

                <Image src={src} mode='scaleToFill' className='service-image' />

              </View>
              : <ImagePlaceholder height={height} />
            }
          </View>
          <View style={{ marginTop: Taro.pxTransform(100) }} >
            <ServiceItemShow
              status={service.appointment_status}
              item={service}
              step={service.status}
              onContact={this.onContact}
              onDisLike={this.onDisLike}
              onEvalution={this.onEvalution}
              comment={comment}
              onGudit={this.onGudit}
            />
          </View>

          {/* 头部 公寓类型以及查看详情 */}
          <View>
            <View className='at-row p-2 at-row at-row__justify--between service-head ml-2 position-absolute' style={{ zIndex: "9" }} >
              <View className='mt-1 text-large' style='color:#FFFFFF '>
                <View >{date}</View>
                <View className='mt-1'>
                  <View className='at-row'>
                    {apartment_title}
                  </View>
                </View>
                {/* 头部，房子户型 */}

              </View>
              <View className=' at-row-5 mt-1 at-row at-row__align--center at-row__justify--end mr-5' >
                <View className='text-small' style='color:#FFFFFF' onClick={this.onNavigation}>{LOCALE_APPOINTMENT_DETAIL}
                  <AtIcon
                    value='chevron-right'
                    size='15'
                    color='#FFFFFF'
                  />
                </View>
              </View>
              {is_sign && <View onClick={this.onNavigateToRisk} className='service-risk text-normal page-middile position-absolute' style={{ top: '75%', left: '63%' }}>{LOCALE_RISK_MONEY_SUPPORT}</View>}
            </View>
          </View>
          <View className='ml-3 position-absolute' style={{ top: '18%' }}>
            <View className=' mt-2 ml-1 text-small text-white'>{house_type_title}</View>
          </View>


          {/* 中间，计时框 */}
          <View className='service-middle' >
            <View className='at-row at-row__justify--between inherit-Height'>
              {/* 左边 */}

              {
                appointment_status >= 3 ?
                  <View className='at-col at-col-3 inherit-Height position-relative' >
                    <Image className='service-image-center' src={APPOINTMENT_OVER} ></Image>
                  </View>
                  :
                  <View className='at-col at-col-3 service-center' >
                    <View className='at-row at-row__justify--center text-bold' style='font-size:22px;'>
                      {order_time}
                    </View>
                    <View className='at-row at-row__justify--center text-muted mt-1 text-mini' style='font-size:10px'>
                      {look_time}
                    </View>
                  </View>
              }

              {/* 中间竖线 */}
              <View className='at-col at-col-0 position-absolute' style={{ left: '32%', top: "50%", transform: "translate(0,-50%)" }}>
                <View className='service-line'></View>
              </View>

              {/* 右边 server_id===0时*/}
              <View hidden={server_id === 0 ? true : false} className='at-col at-col-9 at-row at-row__justify--center service-right'>
                <View className='at-row at-row__justify--between' >
                  <View className='at-col at-col-0'>
                    <Image
                      className='service-avatar'
                      src={server_user.headimgurl}
                    />
                  </View>
                  <View className='at-col at-col-9 ml-2' >
                    <View className='at-row mt-1 at-row__align--end'>
                      <View className='at-col at-col-4 text-bold at-col__align--center text-normal'>{server_user.name}</View>
                      <View className='at-col at-col-6 at-col__align--center'>
                        <View className='at-row at-row__align--center mb-1'>
                          <View className='at-col at-col-3 ml-2 '>
                            <AtIcon
                              value='star-2'
                              size='15'
                              color='#FFCB1F'
                            />
                          </View>
                          <View className='at-col at-col-7 text-small text-muted mt-1' >{server_user.comment_score || '0' + LOCALE_POINT}</View>
                        </View>
                      </View>
                    </View>
                    <View className='text-muted ' style='font-size:10px'>{LOCALE_APPOINTMENT_HASLOOK + (server_user.service_num || '0') + LOCALE_TIMES}</View>
                  </View>
                </View>
              </View>
              {/* 右边 server_id!==0时*/}
              <View hidden={server_id === 0 ? false : true} className='at-col at-col-8 at-row at-row__justify--center service-right'>
                <View className='at-row at-row__justify--between ' >
                  <View className='at-col at-col-2'>
                    <Image src={ICON_HEAD_NO} className='service-avatar' />
                  </View>
                  <View className='at-col at-col-9 mr-4'>
                    <View className='text-small at-col service-font-center' >{LOCALE_APPOINTMENT_SUMMON}</View>
                    <View className='text-small at-col service-font-center mt-2' >{LOCALE_APPOINTMENT_BELONG}</View>

                  </View>
                </View>
              </View>

            </View>
          </View>
        </View>
        {/* 服务评价 */}
        <ServiceEvalution
          show={showEvalution}
          haveEvalution={haveEvalution}
          onEvalution={this.onEvalution}
          onSetReset={this.props.onSetReset}
          comment={comment}
          appointment_id={id}
          name={server_user.name}
          headimgurl={server_user.headimgurl}
          service_num={server_user.service_num}
          comment_score={server_user.comment_score}
          onClose={this.onCloseEvalution}
        />


        {/* 看房意向 */}

        <ServiceIntention
          show={showIntention}
          onIntention={this.onIntention}
          haveIntention={haveIntention}

          intention={intention}
          apartment_title={apartment_title}
          house_type_title={house_type_title}
          remark={remark}
          appointment_id={id}
          onClose={this.onCloseIntention}
        />


      </View>
    )
  }
}

export default ServiceItem
