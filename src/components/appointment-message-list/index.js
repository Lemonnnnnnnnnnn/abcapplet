import Taro from '@tarojs/taro'
import day from 'dayjs'
import { AtAvatar } from 'taro-ui'

import { View, Image } from '@tarojs/components'
import BaseComponent from '@components/base'

class AppointmentMessageList extends BaseComponent {
  static defaultProps = {
    items: [],
  }
  render() {
    const { items} = this.props
    return (
      <View>
        {items.map(i =>
          <View key={i.id} className='text-normal'>

            {i.sayer !== 'user' && <View className='at-row mt-3'>
              <Image src='http://images.gongyuabc.com/image/icon/head-no.png' style={{ width: Taro.pxTransform(80), height: Taro.pxTransform(80), borderRadius: "50%" }}></Image>
              <View className='ml-2'>
                <View className='message-item p-2'>{i.content}</View>
                <View className='text-secondary text-mini mt-1'>
                  {day.unix(i.create_time).format('YYYY-MM-DD hh:mm:ss')}
                </View>
              </View>
            </View>
            }

            {i.sayer === 'user' && <View className='at-row  mt-3 at-row__justify--end'>
              <View className='mr-2'>
                <View className='message-item p-2'>{i.content}</View>
                <View className='text-secondary text-mini mt-1' style={{ 'text-align': 'right' }}>
                  {day.unix(i.create_time).format('YYYY-MM-DD hh:mm:ss')}
                </View>
              </View>
              <AtAvatar circle openData={{ type: 'userAvatarUrl' }} size='small' />
            </View>}
          </View>
        )}
      </View>
    )
  }
}

export default AppointmentMessageList
