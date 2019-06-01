import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'

import Avatar from '@components/avatar'
import Board from '@components/board'
import Lists from '@components/lists'

@connect(state => state, actions)
class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
  }

  state = {
    lists: [
      {
        title: '我的小黄卡',
        icon: 'credit-card',
        extraText: '指定公寓享受折扣价',
        url: '/pages/user/card',
      },
      {
        title: '我的心愿卡',
        icon: 'heart-2',
        extraText: '66个房源',
        url: '/pages/user/collection',
      },
    ]
  }

  componentDidShow() {
    this.props.dispatchUser()
  }

  onLogin() {
    Taro.reLaunch({ url: '/pages/user/auth' })
  }

  render() {
    const { lists } = this.state
    const { user: { username, mobile } } = this.props

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
        <Lists lists={lists} />
      </View >
    )
  }
}

export default UserProfile
