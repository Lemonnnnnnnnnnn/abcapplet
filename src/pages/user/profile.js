import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
  }

  render() {
    return (
      <View className='page-demo'>
        <Text>个人中心</Text>
      </View>
    )
  }
}

export default UserProfile
