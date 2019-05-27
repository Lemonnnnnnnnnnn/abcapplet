import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class ApartmentServices extends Component {
  config = {
    navigationBarTitleText: '找房服务',
    enablePullDownRefresh: true,
  }

  render() {
    return (
      <View className='page-demo'>
        <Text>找房服务</Text>
      </View>
    )
  }
}

export default ApartmentServices
