import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class ApartmentRecommend extends Component {
  config = {
    navigationBarTitleText: '优选',
  }

  render() {
    return (
      <View className='page-demo'>
        <Text>优选</Text>
      </View>
    )
  }
}

export default ApartmentRecommend
