import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class ApartmentHome extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
    enablePullDownRefresh: true,
  }

  render() {
    return (
      <View className='page-demo'>
        <Text>公寓ABC</Text>
      </View>
    )
  }
}

export default ApartmentHome
