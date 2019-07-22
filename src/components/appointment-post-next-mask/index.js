// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton ,AtIcon} from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'


// 自定义常量
import { COLOR_GREY_2 ,COLOR_YELLOW} from '@constants/styles'

import {
  LOCALE_APPOINTMENT_SUCCESS,
  LOCALE_APPOINTMENT_WATING,
  LOCALE_APPOINTMENT_ACCEPT,
  LOCALE_APPOINTMENT_ACCEPT_PHONE ,
  LOCALE_APPOINTMENT_ACCEPT_ORDER,
  LOCALE_APPOINTMENT_CALL,
  LOCALE_APPOINTMENT_LOOK,
  LOCALE_APPOINTMENT_FINISH_REQUIRE,
  LOCALE_APPOINTMENT_HELP
} from '@constants/locale'


class AppointPostNextMask extends BaseComponent {
  static defaultProps = {
    show: false,
  }

  render() {
    const { show,secTime,minTime,serverId} = this.props
    return show &&
    <View>
    <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between '>
            <View className='text-bold'></View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          {serverId===0 &&<View>
              <View className='at-row at-row__justify--center'>
                <AtIcon value='check-circle' size='50' color='#FFC919'></AtIcon>
              </View>
              <View className='at-row at-row__justify--center mt-2'>
                <View className='text-bold text-super '>{LOCALE_APPOINTMENT_SUCCESS}</View>
              </View>
              <View className='at-row at-row__justify--center mt-2' >
                <View className='text-muted text-normal '>{LOCALE_APPOINTMENT_WATING}</View>
              </View>
              <View className='at-row at-row__justify--center mt-4' >
                <View className='text-bold' style='font-size:55px;color:#FFC919'>{minTime}:{secTime}</View>
              </View>
            </View>}

            {serverId!==0 &&<View className='mb-5'>
              <View className='at-row at-row__justify--center'>
              <image src='https://images.gongyuabc.com//image/accept.png' style='height:45px;width:40px'></image>
              </View>
              <View className='at-row at-row__justify--center mt-2'>
                <View className='text-bold text-super '>{LOCALE_APPOINTMENT_ACCEPT}</View>
              </View>

              <View className='at-row at-row__justify--center mt-5' >
                <View className='text-huge text-yellow' >{LOCALE_APPOINTMENT_ACCEPT_PHONE }</View>
              </View>
            </View>}


            <View className='at-row at-row__justify--center mt-2 mb-5 mt-5'>
              <View className='at-row at-row__justify--center'>
                <View className='text-yellow text-normal mt-1'>{LOCALE_APPOINTMENT_ACCEPT_ORDER}</View>
                <AtIcon value='chevron-right' size='15' color='#FFC919' className='ml-3'></AtIcon>
                <View className='text-yellow text-normal  mt-1 ml-3'>{LOCALE_APPOINTMENT_CALL}</View>
                <AtIcon value='chevron-right' size='15' color={serverId!==0?COLOR_YELLOW:COLOR_GREY_2} className='ml-3'></AtIcon>
                {serverId===0 &&  <View className='text-muted text-normal mt-1 ml-3' >{LOCALE_APPOINTMENT_LOOK}</View>}
                {serverId!==0 && <View className='text-yellow text-normal mt-1 ml-3' >{LOCALE_APPOINTMENT_LOOK}</View>}
              </View>
            </View>

            <View className='at-row at-row__justify--center mt-5' style='width:100%;height:1px;background:#F8F8F8'></View>

            <View className='at-row at-row__justify--center mt-3 '>
              <View className='at-col at-col-1'></View>
              <AtButton
                circle
                className=' btn-yellow active at-col at-col-8 pl-5 pr-5 '
                // onClick={this.props.onClose}
                >  {LOCALE_APPOINTMENT_FINISH_REQUIRE}  </AtButton>
                <View className='at-col at-col-1'></View>
            </View>

            <View  className='at-row at-row__justify--center mt-2 mb-4 '>
              <View className='text-muted text-normal '>{LOCALE_APPOINTMENT_HELP}</View>
            </View>

        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
      </View>
    </View>
  }
}

export default AppointPostNextMask
