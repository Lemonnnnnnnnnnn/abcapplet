// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image, Button } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'

// 自定义组件
import Decorate from '@components/decorate'
import UserHeader from '@components/user-header'
import UserOptions from '@components/user-options'
import UserOrderOptions from '@components/user-order-options'
import Board from '@components/board'

// 常量
import {
  USER_OPTIONS_LISTS,
  USER_ORDER_OPTIONS_LISTS,
} from '@constants/user'

import { COLOR_YELLOW, COLOR_GREY_0, COLOR_GREY_2 } from '@constants/styles'

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

    const buttonStyle = {
      border: "1px solid #fff",
      color: "#888",
      padding: 0,
      width: '100%',
    }


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
          {/* 联系客服 */}
          <Board className='mt-2'>
            <Button style={buttonStyle} open-type='contact' size='mini' plain bindcontact='handleContact' >
              <View className='user-list-item p-2' style={{marginTop : Taro.pxTransform(8)}}>
                <View className='at-row at-row__justify--between'>
                  {/* 左侧内容 */}
                  <View className='at-row at-row__align--center ml-2'>
                    {/* 左侧图标 */}
                    <Image style={{ width: Taro.pxTransform(32), height: Taro.pxTransform(32) ,marginTop : Taro.pxTransform(4)}} src='https://images.gongyuabc.com/image/call.png'></Image>
                    {/* 文本内容 */}
                    <View className='ml-2 text-normal' style={{ color: '#000'  }}>联系客服</View>
                  </View>

                  {/* 右侧图片 */}
                  <View className='at-col at-col-3 '>
                    <View className='at-row at-row__align--center'>
                      <View className='text-small text-secondary mr-2'>9:30-21:30</View>
                      <View style={{marginBottom : Taro.pxTransform(4)}}>
                        <AtIcon value='chevron-right' color={COLOR_GREY_2} size={17} />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Button>
          </Board>
        </View >
      </View>
    )
  }
}

export default UserProfile
