import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainActions from '@actions/bargain'
import * as userActions from '@actions/user'

// 自定义方法
import { timestampChange } from '@utils/time-judge'
import textWrap from '@utils/text-wrap'

// 自定义常量
import { PAGE_BARGAIN_COUPON, PAGE_BARGAIN_DETAIL } from '@constants/page'

// 自定义组件
import BargainContainer from '../components/bargain-container'
import BargainTab from '../components/bargain-tab'
import BargainDetailMainBlock from '../components/bargain-detail-main-block'
import BargainDetailSecBlock from '../components/bargain-detail-sec-block'
import BargainingBlock from '../components/bargaining-block'
import BargainHelpFriendsMask from '../components/bargain-help-friends-mask'

import '../../../styles/_bargain.scss'


@connect(state => state, {
  ...bargainActions,
  ...userActions
})
export default class BargainDetail extends Component {
  config = {
    navigationBarTitleText: '砍价详情',
    navigationBarBackgroundColor: '#FA624A',
  }
  state = {
    showHelpFriends: false,
    bargainDetail: {},
    buttons: []
  }

  async componentWillMount() {
    const { id, share_id } = this.$router.params
    let [buttons, userID] = [[], 0]

    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const { data: { data } } = res
        userID = data.user.id
      }
    })

    this.props.dispatchBargainDetail({ id: parseInt(id), share_id }).then(({ data: { data } }) => {
      const { apartment_title, apartment_type_title, content, cover, headimg, original_price, participate_num, price, price_list,
        reward_id, save_money, tenancy, type, type_id, begin_time, no, close_time, user_bargain, share_title, share_image } = data

      // 计算活动剩余时间
      let [days, hours, minutes, seconds, activityOver, bargainSuccess] = [99, 23, 59, 59, false, false]
      if (close_time) {
        close_time === -1 ? { days, hours, minutes, seconds } = timestampChange(close_time) : {}
      } else activityOver = true

      // 给buttons赋值

      !share_id || parseInt(share_id) === userID ? buttons = [{ message: '分享', method: 'onShare' }]
        : buttons = [
          { message: '我也要砍', method: 'onBargain' },
          { message: '分享', method: 'onShare' },
          { message: '帮砍', method: 'onHelpBargain' }
        ]

      if (user_bargain && user_bargain.status === 1) {
        buttons = [{ message: '领取优惠券', method: 'onReceiveCoupon' }]
        bargainSuccess = true
      }

      this.setState({
        bargainDetail: {
          apartment_title,
          apartment_type_title,
          content,
          cover,
          headimg,
          original_price,
          participate_num,
          price,
          price_list,
          reward_id,
          save_money,
          tenancy,
          type,
          type_id,
          id: data.id,
          close_time,
          begin_time,
          no,
          user_bargain,
          share_title,
          share_image,

          days,
          hours,
          minutes,
          seconds,
          activityOver,

        },
        buttons,
        bargainSuccess,
        share_id,
        userID
      })
    })
  }

  onBargain() {
    const { bargainDetail: { id } } = this.state
    this.props.dispatchBargainCut({ id }).then(res => {
      res.data.code === 1 && Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
    })
  }

  onShare() {
    console.log('我在分享')
  }

  onHelpBargain() {
    const { bargainDetail: { reward_id, id }, share_id } = this.state
    this.props.dispatchBargainHelpCut({ bargain_record_id: reward_id }).then(res => {
      if (res.data.code === 1) {
        Taro.showToast({ title: '帮砍成功！', icon: 'none' })
        setTimeout(() => {
          Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id + '&share_id=' + share_id })
        }, 2000)
      }
    })
  }

  onReceiveCoupon() {
    const { bargainDetail: { id }, share_id } = this.state
    Taro.navigateTo({ url: PAGE_BARGAIN_COUPON + '?id=' + id + '&share_id=' + share_id })
  }

  onShareAppMessage() {
    const { bargainDetail: { id, share_image, share_title }, userID } = this.state
    return {
      title: textWrap(share_title, 17),
      url: PAGE_BARGAIN_DETAIL + '?id=' + id + 'share_id=' + userID,
      imageUrl: share_image
    }
  }

  // 点击 我也要砍，分享，帮砍
  onClick(method) {
    this[method]()
  }

  // 打开帮砍好友mask
  onOpenHelpFriendsMask() {
    this.setState({ showHelpFriends: true })
  }
  // 关闭帮砍好友mask
  onCloseHelpFriendsMask() {
    this.setState({ showHelpFriends: false })
  }


  render() {
    const { showHelpFriends, buttons, bargainSuccess, bargainDetail: { user_bargain }, bargainDetail } = this.state

    return (
      <View className='bargain wrap-Style'>
        {/* 帮砍好友 */}
        <BargainHelpFriendsMask user_bargain={user_bargain} show={showHelpFriends} onClose={this.onCloseHelpFriendsMask} />
        <BargainContainer />

        <View className='bargain-background'>

          <View className='bargain-body-wrap '>
            {/* 第一个板块 */}
            <BargainDetailMainBlock
              bargainDetail={bargainDetail}
            />
            {/* 砍价状态 */}
            {user_bargain && <BargainingBlock user_bargain={user_bargain} onOpenHelpFriendsMask={this.onOpenHelpFriendsMask} />}
            {/* 第二个板块 */}
            <BargainDetailSecBlock bargainDetail={bargainDetail} />
          </View>
          {/* 底部tab栏 */}
          <BargainTab
            zIndex={11}
            onClick={this.onClick}
            buttons={buttons}
            bargainSuccess={bargainSuccess}
          />

        </View>

      </View>
    );
  }
}
