// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'

// 自定义组件
import Decorate from '@components/decorate'
import UserHeader from '@components/user-header'
import UserOptions from '@components/user-options'
import UserOrderOptions from '@components/user-order-options'

// 常量
import {
  USER_OPTIONS_LISTS,
  USER_ORDER_OPTIONS_LISTS,
} from '@constants/user'

import {
  PAGE_USER_AUTH
} from '@constants/page'

@connect(state => state, actions)
class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    optionLists: USER_OPTIONS_LISTS,
    orderOptionLists: USER_ORDER_OPTIONS_LISTS,
  }

  componentDidShow() {
    this.props.dispatchUser()
  }

  onLogin() {
    Taro.reLaunch({ url: PAGE_USER_AUTH })
  }

  render() {
    const { optionLists, orderOptionLists } = this.state
    const { user: { username, mobile } } = this.props

    return (
      <View className='page-grey'>
        <View className='page mx-3'>
          {/* 背景底色 */}
          <Decorate height='300' />

          {/* 用户头像信息 */}
          <UserHeader
            className='mt-4'
            mobile={mobile}
            username={username}
            onLogin={this.onLogin}
          />

          {/* 用户可选信息 */}
          <UserOptions
            className='mt-4'
            lists={optionLists}
          />

          {/* 我的订单 */}
          <UserOrderOptions
            className='mt-2'
            lists={orderOptionLists}
          />

        </View >
      </View>
    )
  }
}

export default UserProfile
