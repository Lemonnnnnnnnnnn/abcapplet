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

import { PAGE_HOUSE_TYPE_SHOW, PAGE_APPOINTMENT_MESSAGE, PAGE_ORDER_CREATE } from '@constants/page'
import { APPOINTMENT_FOUFUNCTION_DIST } from '@constants/appointment'

import {
  LOCALE_APPOINTMENT_SIGNED,
  LOCALE_APPOINTMENT_CASHPLEDGE,
  LOCALE_APPOINTMENT_DETAIL,
  LOCALE_APPOINTMENT_HASLOOK,
  LOCALE_APPOINTMENT_SUMMON,
  LOCALE_APPOINTMENT_BELONG
} from '@constants/locale'

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
  }
  //跳转签约下定页面
  onNavigationAgency() {
    const { service } = this.props
    const { house_type_id } = service
    Taro.navigateTo({
      url: `${PAGE_ORDER_CREATE}?type_id=${house_type_id}`
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
      case 1:
        Taro.navigateTo({
          url: `${PAGE_APPOINTMENT_MESSAGE}?id=${this.props.id}&time=${this.props.time}&appointmentTitle=${this.props.service.apartment_title}&appointmentTime=${this.props.service.order_time}`
        });
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
  render() {
    let { width, height, minWidth, minHeight, mini } = this.props
    const { service } = this.props

    const { id, cover, apartment_title, house_type_title,
      order_time, server_id, server_user, comment, look_time, intention, remark, date, status } = service


    // 重置宽高
    width = mini ? minWidth : width
    height = mini ? minHeight : height

    const imageStyle = {
      width: '100%',
      // height: '100%',
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
      height: Taro.pxTransform(height),
    }
    // 设置图片宽高，方便七牛云格式化图片
    const src = `${cover.split('?')[0]}?imageView2/1/w/${width}/h/${height}`

    return (
      <View className='pl-3 pr-2 pb-3 mt-1' style='position:relative ;'>
        <View className={classNames('apartment')} >
          {/* 头部 */}
          <View className='apartment-header' style={headerStyle}>

            {/* 户型封面，如果没有地址则使用 Image Placeholder 来占位 */}
            {cover
              ?
              <View>
                <View style={imageStyleMask}></View>

                <Image src={src} mode='scaleToFill' style={imageStyle} />

              </View>
              : <ImagePlaceholder height={height} />
            }
          </View>
          <View className='at-row at-row__justify--around mt-5'>
            <View className='at-row at-row-6 mb-2  mt-5'>
              {/* 下面四个按钮 */}
              {APPOINTMENT_FOUFUNCTION_DIST.map(i =>
                <View key={i.id} className='mx-1' onClick={this.onFourClick.bind(this, i.name)}>
                  <View className=' at-row at-row__justify--center at-row__align--center' >
                    <image src={i.src} style='height:30px;width:30px' />
                  </View>
                  <View className='at-row at-row__justify--center'>
                    <View className=' text-normal text-muted  mt-1' style='font-size:10px'>{i.title}</View>
                  </View>
                </View>
              )}
            </View>
            <View className='mb-3 mr-4 ml-1 p-1 at-col at-col-4 mt-5 service-button' onClick={this.onNavigationAgency}>
              <View className='text-normal'>{LOCALE_APPOINTMENT_SIGNED}</View>
              <View style='font-size:10px ;color:#FFFFFF'>{LOCALE_APPOINTMENT_CASHPLEDGE}</View>
            </View>
          </View>
          {/* 头部 公寓类型以及查看详情 */}
          <View className='at-row p-2 at-row at-row__justify--between service-head ml-2' style={{ postion: "absolute", zIndex: "999" }} >
            <View className='mt-1' style='color:#FFFFFF ;font-size:17px'>
              <View >{date}</View>
              <View className='mt-1'>
                <View className='at-row'>
                  {apartment_title}
                  <View className=' mt-2 ml-1 text-small' style='color:#FFFFFF' >{house_type_title}</View>
                </View>
              </View>
              {/* 头部，房子户型 */}
              {/* <View className='at-row p-2 service-house-type' > */}
              {/* </View> */}
            </View>
            <View className=' at-row-5 mt-1 at-row at-row__align--center at-row__justify--end mr-5 ' >
              <View className='text-small' style='color:#FFFFFF' onClick={this.onNavigation}>{LOCALE_APPOINTMENT_DETAIL}
                <AtIcon
                  value='chevron-right'
                  size='15'
                  color='#FFFFFF'
                />
              </View>
            </View>
          </View>

          {/* 中间，计时框 */}
          <View className='m-3 p-3 service-middle ml-4' style='width:255px * $hd'>
            <View className='at-row at-row__justify--between'>
              {/* 左边 */}

              {
                status === 3 ?
                  <View className='at-row at-row__justify--center' style={{ position: "relative", left: '5px', top: '-10px' }}>
                    <Image src='https://images.gongyuabc.com//image/appointmentOver.png' style={{ width: "75px", height: "75px" }}></Image>
                  </View>
                  :
                  <View className='at-col at-col-3 '>
                    <View className='at-row at-row__justify--center text-bold' style='font-size:22px;'>
                      {order_time}
                    </View>
                    <View className='at-row at-row__justify--center text-muted mt-1' style='font-size:10px'>
                      {look_time}
                    </View>
                  </View>
              }

              {/* 中间竖线 */}
              <View className='at-col at-col-0 ml-4'>
                <View className='service-line'></View>
              </View>

              {/* 右边 server_id===0时*/}
              <View hidden={server_id === 0 ? true : false} className='at-col at-col-9 at-row at-row__justify--center ml-3'>
                <View className='at-row at-row__justify--between'>
                  <View className='at-col at-col-0'>
                    <image src={server_user.headimgurl} style='width:50px;height:50px;background:rgba(255,255,255,1);border-radius:50%;' />
                  </View>
                  <View className='at-col at-col-9 ml-2' >
                    <View className='at-row '>
                      <View className='at-col at-col-4 text-bold' style='font-size:16px'>{server_user.name}</View>
                      <View className='at-col at-col-6'>
                        <View className='at-row'>
                          <View className='at-col at-col-3 ml-3 '>
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
                    <View className='text-muted mt-1' style='font-size:10px'>{LOCALE_APPOINTMENT_HASLOOK}{server_user.service_num}次</View>
                  </View>
                </View>
              </View>
              {/* 右边 server_id!==0时*/}
              <View hidden={server_id === 0 ? false : true} className='at-col at-col-8 at-row at-row__justify--center'>
                <View className='at-row at-row__justify--between ml-3' >
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
