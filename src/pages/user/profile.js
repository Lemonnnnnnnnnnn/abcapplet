import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'
import { AtIcon } from 'taro-ui'
import Avatar from '@components/avatar'
import Board from '@components/board'

@connect(state => state.user, actions)
class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
  }

  componentDidShow() {
    this.props.dispatchUser()
  }

  onLogin() {
    Taro.reLaunch({ url: '/pages/user/auth' })
  }

  render() {
    const { userInfo: { username, mobile } } = this.props

    return (
      <View className='page mx-3'>
        {/* 背景底色 */}
        <Board height='400' />

        {/* 用户头像信息 */}
        <Avatar
          className='mt-4'
          mobile={mobile}
          username={username}
          onLogin={this.onLogin}
        />

        {/* 用户可选信息 */}
        <View className='mt-4'>
          <View className='user-list-item p-3'>
            <View className='at-row at-row__justify--around'>
              <View className='at-col'>
                <AtIcon className='mr-2' value='credit-card' color='#FFC919' size='17'></AtIcon>
                <Text className='mr-2 text-normal'>我的小黄卡</Text>
                <Text className='text-small text-muted'>指定公寓享受折扣价</Text>
              </View>
              <AtIcon value='chevron-right' color='#333333' size='17'></AtIcon>
            </View>
          </View>
          <View className='user-list-item p-3'>
            <View className='at-row at-row__justify--around'>
              <View className='at-col'>
                <AtIcon className='mr-2' value='heart-2' color='#FFC919' size='18'></AtIcon>
                <Text className='mr-2 text-normal'>我的心愿卡</Text>
                <Text className='text-small text-muted'>66个房源</Text>
              </View>
              <AtIcon value='chevron-right' color='#333333' size='18'></AtIcon>
            </View>
          </View>
        </View>
      </View >
    )
  }
}

export default UserProfile
