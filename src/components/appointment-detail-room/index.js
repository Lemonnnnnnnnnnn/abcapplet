// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input, Picker } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'
// 自定义常量
import {
  LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM,
  LOCALE_COLON,
  LOCALE_HOUSE_TYPE,
  LOCALE_SIGN_ROOM_NONE,
  LOCALE_CHOISE_ROOM_ID
} from '@constants/locale'

class AppointmentDetailRoom extends BaseComponent {
  static defaultProps = {
    width: 204
  }

  render() {
    let { userInputView, house_type_list, roomListArr, typeChoise, roomChoise, onChoiseHouseType, onInputRoomId, onChoiseRoom, onChangeBoard, width } = this.props

    return <View>
      {
        userInputView
          ?
          <View className='appointment-detail-roomBoard mt-2 ml-2'>
            <View className='at-row at-row__align--center'>
              <View className='text-normal at-col at-col-5'>
                <View className='text-secondary mb-1'>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM}</View>
                <View className='appointment-detail-roomBoard-input' style={{ width: Taro.pxTransform(width) }}>
                  <Input style={{ width: '90%', paddingLeft: '5%' }} onChange={onInputRoomId}></Input>
                </View>
              </View>
              <View className='text-normal at-col at-col-5'>
                <View className='text-secondary mb-1'>{LOCALE_HOUSE_TYPE}</View>
                <View className='appointment-detail-roomBoard-input position-relative' style={{ width: Taro.pxTransform(width) }}>
                  <Picker range={house_type_list} onChange={onChoiseHouseType}>
                    <View className='at-row at-row__justify--between at-row__align--center' style={{ height: Taro.pxTransform(52) }}>
                      <View className='ml-1'>{typeChoise}</View>
                      <AtIcon value='chevron-down' size='20' color='#888888' style='position : absolute ; right : 0'></AtIcon>
                    </View>
                  </Picker>
                </View>
              </View>
            </View>
          </View>
          :
          <View>
            {/* 可选房间 */}
            <View className='my-2 at-row at-row__align--center'>
              <View className='ml-2 text-normal '>{LOCALE_APPOINTMENT_DETAIL_SIGN_ROOM + LOCALE_COLON}</View>
              <View className={`appointment-detail-picker p-1 at-col at-col-5 text-small ${roomChoise === LOCALE_CHOISE_ROOM_ID ? 'appointment-detail-picker-text' : ''}`}>
                <Picker range={roomListArr} onChange={onChoiseRoom}>{roomChoise}</Picker>
              </View>
            </View>
            {/* 灰线 */}
            <View className='appointment-detail-line mt-4'></View>
            {/* 没有您签约的房间？ */}
            <View onClick={onChangeBoard} className='at-row at-row__justify--center at-row__align--center mt-2  '>
              <View className='text-secondary text-small'>{LOCALE_SIGN_ROOM_NONE}</View>
              <AtIcon value='help' size='15' color='#888888'></AtIcon>
            </View>
          </View>
      }
    </View>
  }
}

export default AppointmentDetailRoom
