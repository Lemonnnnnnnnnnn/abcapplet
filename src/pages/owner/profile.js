// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as distActions from '@actions/dist'

// 自定义组件
import Decorate from '@components/decorate'
import UserHeader from '@components/user-header'
import UserOptions from '@components/user-options'
import UserOrderOptions from '@components/user-order-options'
import UserFeedbackOptions from '@components/user-feedback-options'
import Board from '@components/board'
import RequirementCard from '@components/requirement-card'
import CustomerServiceMask from '@components/customer-service-mask'

// 常量
import {
  USER_OPTIONS_LISTS,
  USER_ORDER_OPTIONS_LISTS,
  USER_FEEDBACK_OPTIONS_LIST
} from '@constants/user'

import { COLOR_GREY_2 } from '@constants/styles'


import {
  PAGE_USER_AUTH,
  PAGE_USER_FAVORITE,
  PAGE_USER_COUPON,
  PAGE_USER_FEEDBACK,
  PAGE_USER_ACTIVITY
} from '@constants/page'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...distActions,
  ...userActions,
})

class UserProfile extends Component {
  config = {
    navigationBarTitleText: '个人中心',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {
    optionLists: USER_OPTIONS_LISTS,
    optionFeedbackLists: USER_FEEDBACK_OPTIONS_LIST,
    orderOptionLists: USER_ORDER_OPTIONS_LISTS,
    showCard: false,
    showMask: false,
  }

  refRequirementCard = (node) => this.requirementCard = node

  async componentDidShow() {
    Taro.showTabBarRedDot({ index: 2 })
    buryPoint()
    const { payload: user } = await this.props.dispatchUser()
    this.props.dispatchDistList(user.citycode)
    this.setState({ showMask: false })
  }

  onLogin() {
    Taro.clearStorage('lastPagePath')
    Taro.navigateTo({ url: PAGE_USER_AUTH })
  }

  // 跳转我的心愿卡页面
  onNavigateToFavorite() {
    Taro.navigateTo({ url: PAGE_USER_FAVORITE })
  }
  // 跳转我的优惠券页面
  onNavigateToCoupon() {
    Taro.navigateTo({ url: PAGE_USER_COUPON })
  }

  // 跳转我的活动页面
  onNavigateToActivity() {
    Taro.navigateTo({ url: PAGE_USER_ACTIVITY })
  }

  // 打开/关闭需求卡

  onOpenCard() {
    // this.setState({ showCard: true })
    this.requirementCard.onNextCard()
  }

  onCloseCard() {
    this.setState({ showCard: false })
  }

  // 打开/关闭联系客服弹窗

  onShowCustomerMask() {
    this.setState({ showMask: true })
  }

  onCloseCustomerMask() {
    this.setState({ showMask: false })
  }


  //前往橘子公社小程序
  openMiniProgramCreate() {
    Taro.navigateToMiniProgram({
      appId: 'wxd3537ccb429de3b4', // 要跳转的小程序的appid
    }).catch(err => console.log(err))
  }
  //前往意见反馈
  onFeedback() {
    Taro.navigateTo({
      url: PAGE_USER_FEEDBACK
    })
  }

  onClick(method) {
    this[method]()
  }


  render() {
    const { optionLists, orderOptionLists, showCard, showMask, optionFeedbackLists } = this.state
    const { user: { username, mobile }, dists } = this.props

    return (
      <View className='page-grey' style={{ overflow: 'hidden' }}>
        <View className='page ' >
          {
            !Taro.getStorageSync('user_info').token &&
            <View className='page-mask-opacity' onClick={() => Taro.showToast({ title: '请先登录再进行后续操作', icon: 'none' })}></View>
          }
          {/* 背景底色 */}
          <Decorate height='300' />

          {/* 用户头像信息 */}
          <UserHeader
            className='p-3'
            mobile={mobile}
            username={username}
            onLogin={this.onLogin}
          />

          {/* 用户可选信息 */}
          <UserOptions
            className='mt-3 mx-3'
            onClick={this.onClick}
            lists={optionLists}
          />

          {/* 优选入口 */}
          <View className='mx-2' onClick={this.openMiniProgramCreate} style={{ position: 'relative', zIndex: 100 }}>
            <Image lazyLoad src='https://images.gongyuabc.com/image/recommed.png ' className='user-image'></Image>
          </View>

          {/* 我的订单 */}
          <UserOrderOptions
            className=' mx-3'
            lists={orderOptionLists}
          />

          {/* 反馈入口 */}
          <UserFeedbackOptions
            className='mt-3 mx-3'
            onClick={this.onClick}
            lists={optionFeedbackLists}
          />

        </View >

        <CustomerServiceMask
          show={showMask}
          onClose={this.onCloseCustomerMask}
        />

        <RequirementCard
          show={showCard}
          ref={this.refRequirementCard}
          onCloseCard={this.onCloseCard}
          dists={dists}
        />
      </View>
    )
  }
}

export default UserProfile
