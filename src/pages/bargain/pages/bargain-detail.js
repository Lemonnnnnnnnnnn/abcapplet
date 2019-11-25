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
import { PAGE_BARGAIN_COUPON, PAGE_BARGAIN_DETAIL, PAGE_USER_AUTH } from '@constants/page'
import {
  LOCALE_BARGAIN_HELP_SUCCESS,
  LOCALE_NONE,
  LOCALE_BARGAIN_SHARE,
  LOCALE_BARGAIN_HELP,
  LOCALE_BARGAIN_I_WANT,
  LOCALE_COUPON_RECEIVE,
  LOCALE_BARGAIN_HELP_HAVEN,
  LOCALE_BARGAIN_VIEW_MINE
} from '@constants/locale'

// 自定义组件
import BargainContainer from '../components/bargain-container'
import BargainTab from '../components/bargain-tab'
import BargainDetailMainBlock from '../components/bargain-detail-main-block'
import BargainDetailSecBlock from '../components/bargain-detail-sec-block'
import BargainDetailBargainingBlock from '../components/bargain-detail-bargaining-block'
import BargainHelpFriendsMask from '../components/bargain-help-friends-mask'


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

  componentDidShow() {
    this.initState()
  }


  async initState() {
    const { id, share_id } = this.$router.params
    let [buttons, userID] = [[], 0]
    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const { data: { data } } = res
        userID = data.user.id
      }
    })

    this.props.dispatchBargainDetail({ id: parseInt(id), share_id }).then(({ data: { data } }) => {
      const { apartment_title, apartment_type_title, content, cover, headimg, original_price, participate_num, price, price_list, is_cut, is_record,
        reward_id, save_money, tenancy, type, type_id, begin_time, no, close_time, user_bargain, share_title, share_image } = data

      // 计算活动剩余时间
      let [days, hours, minutes, seconds, activityOver, bargainSuccess] = [99, 23, 59, 59, false, false]
      if (close_time) {
        close_time !== -1 ? { days, hours, minutes, seconds } = timestampChange(close_time) : {}
      } else activityOver = true

      // 给buttons赋值
      // Buttontype = 1  button : [分享]          本人/已参加
      // Buttontype = 2  button : [我也要砍]      本人/未参加
      // Buttontype = 3  button : [领取优惠券（亮）]    本人/已参加=>已成功  未领取优惠券
      // Buttontype = 4  button : [领取优惠券（灰）]    本人/已参加=>已成功  已领取优惠券

      // Buttontype = 5  button : [我也要砍，帮砍，分享]               他人/未参加
      // Buttontype = 6  button : [我也要砍，已帮砍（灰），分享]        他人/已砍价/未发起
      // Buttontype = 7  button : [我的砍价，已帮砍（灰），分享]        他人/已砍价/已发起
      // Buttontype = 8  button : [我的砍价，帮砍，分享]        他人/未砍价/已发起

      let Buttontype = 0

      if (share_id) {
        if (parseInt(share_id) === userID) {
          if (user_bargain) {
            // 本人 已参加
            if (user_bargain.status === 1) {
              // 本人 已参加 已砍价完成   是否已领取优惠券
              user_bargain.is_receive ? Buttontype = 4 : Buttontype = 3
            } else {
              // 本人 已参加 未砍价完成
              Buttontype = Buttontype = 1
            }
          }
          // 本人 未参加
          else { Buttontype = 2 }
        } else {
          // 非本人  type = 5-9

          // 未砍 & 没有记录
          if (!is_cut && !is_record) { Buttontype = 5 }

          // 已砍 & 没有记录
          if (is_cut && !is_record) { Buttontype = 6 }

          // 已砍 & 有记录
          if (is_cut && is_record) { Buttontype = 7 }

          //未砍 & 有记录
          if (!is_cut && is_record) { Buttontype = 8 }

        }
      }
      else {
        if (user_bargain) {
          // 本人 已参加
          if (user_bargain.status === 1) {
            // 本人 已参加 已砍价完成   是否已领取优惠券
            user_bargain.is_receive ? Buttontype = 4 : Buttontype = 3
          } else {
            //  本人 已参加  未砍价完成
            Buttontype = Buttontype = 1
          }
          // 本人  未参加
        } else { Buttontype = 2 }
      }


      switch (Buttontype) {
        case 1: { buttons = [{ message: LOCALE_BARGAIN_SHARE, method: 'onShare' }] } break;
        case 2: { buttons = [{ message: LOCALE_BARGAIN_I_WANT, method: 'onBargain' }] } break;
        case 3: {
          buttons = [{ message: LOCALE_COUPON_RECEIVE, method: 'onReceiveCoupon' }]
        } break;
        case 4: {
          buttons = [{ message: LOCALE_COUPON_RECEIVE, method: 'onReceiveCoupon', disabled: true }]
          bargainSuccess = true
        } break;
        case 5: {
          buttons = [
            { message: LOCALE_BARGAIN_I_WANT, method: 'onBargain' },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare' },
            { message: LOCALE_BARGAIN_HELP, method: 'onHelpBargain' }
          ]
        } break;
        case 6: {
          buttons = [
            { message: LOCALE_BARGAIN_I_WANT, method: 'onBargain' },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare' },
            { message: LOCALE_BARGAIN_HELP_HAVEN, method: 'onHelpBargain', disabled: true }
          ]
        } break;
        case 7: {
          buttons = [
            { message: LOCALE_BARGAIN_VIEW_MINE, method: 'onViewMineBargain' },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare' },
            { message: LOCALE_BARGAIN_HELP_HAVEN, method: 'onHelpBargain', disabled: true }
          ]
        } break;

        case 8: {
          buttons = [
            { message: LOCALE_BARGAIN_VIEW_MINE, method: 'onViewMineBargain' },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare' },
            { message: LOCALE_BARGAIN_HELP, method: 'onHelpBargain' }
          ]
        } break;
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
        Buttontype,
        bargainSuccess,
        share_id,
        userID
      })
    })
  }

  onBargain() {
    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })
    const { bargainDetail: { id } } = this.state
    this.props.dispatchBargainCut({ id }).then(res => {
      res.data && res.data.code === 1 && Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
    })
  }

  onViewMineBargain() {
    const { bargainDetail: { id } } = this.state
    Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  onShare() { }

  onHelpBargain() {
    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })
    const { bargainDetail: { user_bargain: { bargain_record_id }, id }, share_id } = this.state
    this.props.dispatchBargainHelpCut({ bargain_record_id }).then(res => {
      if (res.data && res.data.code === 1) {
        Taro.showToast({ title: LOCALE_BARGAIN_HELP_SUCCESS, icon: LOCALE_NONE })
        setTimeout(() => {
          Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id + '&share_id=' + share_id })
        }, 2000)
      }
    })
  }

  onReceiveCoupon() {
    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })

    const { bargainDetail: { id }, share_id } = this.state
    Taro.navigateTo({ url: PAGE_BARGAIN_COUPON + '?id=' + id + '&share_id=' + share_id })
  }

  onShareAppMessage() {
    const { bargainDetail: { id, share_image, share_title }, userID, share_id } = this.state
    return {
      title: textWrap(share_title, 17),
      path: PAGE_BARGAIN_DETAIL + '?id=' + id + '&share_id=' + (share_id || userID),
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
    const { showHelpFriends, buttons, bargainSuccess, bargainDetail: { user_bargain }, bargainDetail, Buttontype } = this.state
    return (
      <View className='bargain wrap-Style'>
        {/* 帮砍好友 */}
        <BargainHelpFriendsMask user_bargain={user_bargain} show={showHelpFriends} onClose={this.onCloseHelpFriendsMask} />
        {/* 背景图 */}
        <BargainContainer />
        <View className='bargain-background'>

          <View className='bargain-body-wrap '>
            {/* 第一个板块 */}
            <BargainDetailMainBlock
              bargainDetail={bargainDetail}
            />
            {/* 砍价状态 */}
            {user_bargain && <BargainDetailBargainingBlock user_bargain={user_bargain} onOpenHelpFriendsMask={this.onOpenHelpFriendsMask} />}
            {/* 第二个板块 */}
            <BargainDetailSecBlock bargainDetail={bargainDetail} />
          </View>
          {/* 底部tab栏 */}
          <BargainTab
            user_bargain={user_bargain}
            Buttontype={Buttontype}
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
