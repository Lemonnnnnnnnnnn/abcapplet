// Taro 组件
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
import ImagePlaceholder from '@components/image-placeholder'
import ServiceEvalution from '@components/service-evaluation-mask'
import ServiceIntention from '@components/service-intention-mask'

// NPM 包
import classNames from 'classnames'

import { PAGE_HOUSE_TYPE_SHOW, PAGE_APPOINTMENT_MESSAGE, PAGE_ORDER_CREATE, PAGE_APPOINTMENT_DETAIL } from '@constants/page'
import { APPOINTMENT_FOUFUNCTION_DIST } from '@constants/appointment'

import {
  LOCALE_APPOINTMENT_SIGNED,
  LOCALE_APPOINTMENT_CASHPLEDGE,
  LOCALE_APPOINTMENT_DETAIL,
  LOCALE_APPOINTMENT_HASLOOK,
  LOCALE_APPOINTMENT_SUMMON,
  LOCALE_APPOINTMENT_BELONG,

  LOCALE_APPOINTMENT_MESSAGE,
  LOCALE_APPOINTMENT_RELUTION,
  LOCALE_APPOINTMENT_EVALUTION,
  LOCALE_APPOINTMENT_INTENTION,
  LOCALE_APPOINTMENT_HAVE_EVALUTION,
  LOCALE_APPOINTMENT_HAVE_INTENTION,

} from '@constants/locale'

import {
  LEAVE_MSG_GRAY,
  CALL_PHONE_GRAY,
  COMMENT_GRAY,
  EXPECT_GRAY,
  LEAVE_MSG,
  CALL_PHONE,
  COMMENT,
  EXPECT
} from '@constants/picture'


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
  }

  onIntention() {
    this.setState({ haveIntention: true })
  }

  onEvalution() {
    this.setState({ haveEvalution: true })
  }
  //跳转签约下定页面
  onNavigationAgency() {
    const { service } = this.props
    const { id } = service
    Taro.navigateTo({
      url: `${PAGE_APPOINTMENT_DETAIL}?id=${id}&isSign=${this.props.service.is_sign}`
    })
  }

  //跳转详情
  onNavigation() {
    const { service } = this.props

    const { house_type_id } = service
    Taro.navigateTo({
      url: `${PAGE_HOUSE_TYPE_SHOW}?id=${house_type_id}`
    })
  }


  //case 1行程留言 2联系管家 3服务评价 4看房意向
  onFourClick(value) {
    switch (value) {
      case 1: {
        const { service } = this.props
        const { server_id } = service
        if (server_id !== 0) {
          Taro.navigateTo({
            url: `${PAGE_APPOINTMENT_MESSAGE}?id=${this.props.id}&time=${this.props.service.date}&appointmentTitle=${this.props.service.apartment_title}&appointmentTime=${this.props.service.order_time}`
          });
        } else {
          Taro.showToast({
            title: '正在为您召唤专属管家...',
            icon: 'none',
            duration: 2000
          })
        }
      }
        break
      case 2:
        const { service } = this.props
        const { server_user, server_id } = service
        if (server_id !== 0) {
          const { mobile } = server_user
          Taro.makePhoneCall({
            phoneNumber: mobile
          });
        } else {
          Taro.showToast({
            title: '正在为您召唤专属管家...',
            icon: 'none',
            duration: 2000
          })
        }


        break
      case 3:
        if (this.props.service.status !== 3) {
          Taro.showToast({
            title: '您还未看房',
            icon: 'none',
            duration: 2000
          })
        } else {
          this.setState({
            showEvalution: true
          })
        };
        break
      case 4:
        if (this.props.service.status !== 3) {
          Taro.showToast({
            title: '您还未看房',
            icon: 'none',
            duration: 2000
          })
        } else {
          this.setState({
            showIntention: true
          })
        };
        break
    }
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

  // onalert() {
  //   Taro.showToast({
  //     title: '该公寓暂不支持线上预订',
  //     icon: 'none',
  //     duration: 2000
  //   })
  // }


  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { service } = this.props

    const { haveIntention, haveEvalution, showIntention, showEvalution } = this.state

    const { id, cover, apartment_title, house_type_title,
      order_time, server_id, server_user, comment, look_time, intention, remark, date, status, is_sign } = service

    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const imageStyle = {
      width: '100%',
      height: '100%',
    }

    const imageStyleMask = {
      width: "100%",
      height: "100%",
      position: "absolute",
      opacity: "0.2",
      backgroundColor: "#000"
    }

    const headerStyle = {
      width: '100%',
    }

    const serviceMiddleStyle = {
      position: 'absolute',
      left: "50%",
      top: '43%',
      height: "69px",
      transform: "translate( -50% , 30%)",
      borderRadius: '12px',
      width: '90%',
      background: 'rgba(255,255,255,1)',
      boxShadow: '0px 3px 6px rgba(0,0,0,0.04)',
    }

    const ImageCenteredStyle = {
      width: "60px",
      height: "60px",
      position: "absolute",
      left: "16%",
      top: '50%',
      transform: "translate( -50% , -50%)",
    }

    const CenterStyle = {
      position: "absolute",
      left: "16%",
      top: '50%',
      transform: "translate( -50% , -50%)",
    }

    const rightStyle = {
      position: "absolute",
      top: '50%',
      left: "39%",
      transform: "translate( 0 , -50%)",
    }
    let buttonList = []


    server_id
      ? buttonList = [
        // { name: 1, src: LEAVE_MSG, title: LOCALE_APPOINTMENT_MESSAGE },
        { name: 2, src: CALL_PHONE, title: LOCALE_APPOINTMENT_RELUTION },
        {
          name: 3,
          // src: haveEvalution || comment.score ? COMMENT : COMMENT_GRAY,
          src: status === 3 ? COMMENT : COMMENT_GRAY,
          title: haveEvalution || comment.score ? LOCALE_APPOINTMENT_HAVE_EVALUTION : LOCALE_APPOINTMENT_EVALUTION
        },
        {
          name: 4,
          // src: haveIntention || intention ? EXPECT : EXPECT_GRAY,
          src: status === 3 ? EXPECT : EXPECT_GRAY,
          title: haveIntention || intention ? LOCALE_APPOINTMENT_HAVE_INTENTION : LOCALE_APPOINTMENT_INTENTION
        },
      ] : buttonList = [
        // { name: 1, src: LEAVE_MSG_GRAY, title: LOCALE_APPOINTMENT_MESSAGE },
        { name: 2, src: CALL_PHONE_GRAY, title: LOCALE_APPOINTMENT_RELUTION },
        { name: 3, src: COMMENT_GRAY, title: LOCALE_APPOINTMENT_EVALUTION },
        { name: 4, src: EXPECT_GRAY, title: LOCALE_APPOINTMENT_INTENTION },
      ]



    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    return (
      <View className='pl-2 pr-2 pb-3 mt-1 m-2' style='position:relative ;' >
        <View className={classNames('apartment')} >
          {/* 头部 */}
          <View className='apartment-header' style={headerStyle}>

            {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
            {cover
              ?
              <View style={{ height: "200px" }}>
                <View style={imageStyleMask}></View>

                <Image src={src} mode='scaleToFill' style={imageStyle} />

              </View>
              : <ImagePlaceholder height={height} />
            }
          </View>
          <View className='at-row at-row__justify--around' >
            <View className='at-row at-row-6 mb-2 ml-2' style={{ marginTop: "55px" }}>
              {/* 下面四个按钮 */}
              {buttonList.map(i =>
                <View key={i.id} className='at-col' onClick={this.onFourClick.bind(this, i.name)}>
                  <View className=' at-row at-row__justify--center at-row__align--center' >
                    <Image src={i.src} style='height:34px;width:34px' />
                  </View>
                  <View className='at-row at-row__justify--center'>
                    <View className=' text-normal text-muted  mt-1' style='font-size:10px'>{i.title}</View>
                  </View>
                </View>
              )}
            </View>

                <View className='mb-3 mr-3 at-col at-col-4 p-2  service-button at-col__align--center' style={{ marginTop: "55px" }} onClick={this.onNavigationAgency}>
                  <View className='text-normal'>{LOCALE_APPOINTMENT_SIGNED}</View>
                  <View style='font-size:10px ;color:#FFFFFF'>{LOCALE_APPOINTMENT_CASHPLEDGE}</View>
                </View>


          </View>
          {/* 头部 公寓类型以及查看详情 */}
          <View>
            <View className='at-row p-2 at-row at-row__justify--between service-head ml-2' style={{ postion: "absolute", zIndex: "9" }} >
              <View className='mt-1' style='color:#FFFFFF ;font-size:17px'>
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
            </View>
          </View>
          <View className='ml-3' style={{ position: 'absolute', top: '18%' }}>
            <View className=' mt-2 ml-1 text-small text-white'>{house_type_title}</View>
          </View>

          {/* 中间，计时框 */}
          <View className='' style={serviceMiddleStyle}>
            <View className='at-row at-row__justify--between'>
              {/* 左边 */}

              {
                status === 3 ?
                  <View className='at-col at-col-3' style={{ postion: "relative" }}>
                    <Image src='https://images.gongyuabc.com//image/appointmentOver.png' style={ImageCenteredStyle}></Image>
                  </View>
                  :
                  <View className='at-col at-col-3 ' style={CenterStyle}>
                    <View className='at-row at-row__justify--center text-bold' style='font-size:22px;'>
                      {order_time}
                    </View>
                    <View className='at-row at-row__justify--center text-muted mt-1' style='font-size:10px'>
                      {look_time}
                    </View>
                  </View>
              }

              {/* 中间竖线 */}
              <View className='at-col at-col-0' style={{ position: "absolute", left: '32%', top: "50%", transform: "translate(0,-50%)" }}>
                <View className='service-line'></View>
              </View>

              {/* 右边 server_id===0时*/}
              <View hidden={server_id === 0 ? true : false} style={rightStyle} className='at-col at-col-9 at-row at-row__justify--center '>
                <View className='at-row at-row__justify--between' >
                  <View className='at-col at-col-0'>
                    <image src={server_user.headimgurl} style='width:50px;height:50px;background:rgba(255,255,255,1);border-radius:50%;' />
                  </View>
                  <View className='at-col at-col-9 ml-2' >
                    <View className='at-row mt-1 at-row__align--end'>
                      <View className='at-col at-col-4 text-bold at-col__align--center' style='font-size:14px'>{server_user.name}</View>
                      <View className='at-col at-col-6 at-col__align--center'>
                        <View className='at-row at-row__align--center mb-1'>
                          <View className='at-col at-col-3 ml-2 '>
                            <AtIcon
                              value='star-2'
                              size='15'
                              color='#FFCB1F'
                            />
                          </View>
                          <View className='at-col at-col-7 text-small text-muted mt-1' >{server_user.comment_score}分</View>
                        </View>
                      </View>
                    </View>
                    <View className='text-muted ' style='font-size:10px'>{LOCALE_APPOINTMENT_HASLOOK}{server_user.service_num}次</View>
                  </View>
                </View>
              </View>
              {/* 右边 server_id!==0时*/}
              <View hidden={server_id === 0 ? false : true} style={rightStyle} className='at-col at-col-8 at-row at-row__justify--center'>
                <View className='at-row at-row__justify--between ' >
                  <View className='at-col at-col-2'>
                    <image src='http://images.gongyuabc.com/image/icon/head-no.png' style='width:50px;height:50px;background:rgba(255,255,255,1);border-radius:50%;' />
                  </View>
                  <View className='at-col at-col-9 mr-4'>
                    <View className='text-small at-col font-center' >{LOCALE_APPOINTMENT_SUMMON}</View>
                    <View className='text-small at-col font-center mt-2' >{LOCALE_APPOINTMENT_BELONG}</View>

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
