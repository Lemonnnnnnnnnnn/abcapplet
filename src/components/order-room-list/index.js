// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import OrderRoomItem from '@components/order-room-item'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { LOCALE_CONTACT, LOCALE_SIGN_ROOM } from '@constants/locale'

@connect(state => state, {
  ...userActions
})
class OrderRoomList extends BaseComponent {
  static defaultProps = {
    show: false,
    rooms: [],
    selectId: 0,
    user: {
      city_id: '',
      username: '',
      headimgurl: '',
      sex: ''
    }
  }

  render() {
    const { rooms, selectId, show, className ,user } = this.props
    const { city_id, username, headimgurl, sex } = user

    const sessionFrom = { nickName: username, avatarUrl: headimgurl, sex, city: city_id }

    return (
      show && <View className={className}>
        {/* 预订信息头部 */}
        <View className='my-2 at-row at-row__justify--between at-row__align--center' >
          <View className='text-bold'>{LOCALE_SIGN_ROOM}</View>
          <View>
            <View className='at-row at-row__align--center'>
              <Button className='at-row btn-none p-0 text-small' open-type='contact' session-from={JSON.stringify(sessionFrom)} type='none'>
                <ABCIcon icon='headset_mic' color={COLOR_GREY_2} size='20' />
                <View className='text-secondary ml-2'>{LOCALE_CONTACT}</View>
              </Button>
            </View>
          </View>
        </View>

        {/* 房间信息 */}
        {rooms.map(i => <OrderRoomItem
          room={i}
          key={i.id}
          className='mb-3'
          selectId={selectId}
          onSelectRoom={this.props.onSelectRoom}
        />)}
      </View>
    )
  }
}

export default OrderRoomList
