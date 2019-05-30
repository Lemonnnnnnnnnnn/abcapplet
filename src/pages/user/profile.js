import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import { AtButton } from 'taro-ui'

@connect(state => state.user, actions)
class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
  }

  componentDidShow() {
    this.props.dispatchUser()
  }

  go() {
    Taro.reLaunch({ url: '/pages/user/auth' })
  }

  render() {
    const { userInfo } = this.props

    return (
      <View className='page-demo'>
        {userInfo.token === ''
          ? <AtButton onClick={this.go}>登录</AtButton>
          : <Text>{userInfo.username}</Text>}
      </View>

    )
  }
}

export default UserProfile
