import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtCurtain } from 'taro-ui'
import dayjs from 'dayjs'

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainActions from '@actions/bargain'
import * as userActions from '@actions/user'

// 自定义方法
import { timestampChange } from '@utils/time-judge'
import textWrap from '@utils/text-wrap'

// 自定义常量
import { PAGE_BARGAIN_COUPON, PAGE_BARGAIN_DETAIL, PAGE_USER_AUTH, PAGE_HOME } from '@constants/page'
import {
  LOCALE_BARGAIN_SHARE,
  LOCALE_BARGAIN_HELP,
  LOCALE_BARGAIN_I_WANT,
  LOCALE_COUPON_RECEIVE,
  LOCALE_BARGAIN_HELP_HAVEN,
  LOCALE_BARGAIN_VIEW_MINE,
  LOCALE_BARGAIN_APPOINTMENT,
  LOCALE_BARGAIN_APPOINTMENT_SUCCESS
} from '@constants/locale'
import { BARGAIN_MORE_HOUSE } from '@constants/picture'

// 自定义组件
import Curtain from '@components/curtain'
import GetAuthorizationMask from '@components/get-authorization-mask'
import BargainContainer from '../components/bargain-container'
import BargainTab from '../components/bargain-tab'
import BargainDetailMainBlock from '../components/bargain-detail-main-block'
import BargainDetailSecBlock from '../components/bargain-detail-sec-block'
import BargainDetailThirdBlock from '../components/bargain-detail-third-block'
import BargainDetailBargainingBlock from '../components/bargain-detail-bargaining-block'
import BargainHelpFriendsMask from '../components/bargain-help-friends-mask'
// import BargainAppointmentMask from '../components/bargain-appointment-mask'


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
    buttons: [],
    showPicCurtain: false,
    showBargainCurtain: false,
    showGetPhoneNumMask: false,
    // showAppointment: false,
    helpBargainMoney: 0
  }

  componentDidShow() {
    this.initState()
  }

  // 进入页面时候拿到code存入缓存，如果在点击按钮后再获取code会过期
  async componentDidMount() {
    const { code } = await Taro.login()
    Taro.setStorageSync('code', code)
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
      const { apartment_title, apartment_type_title, content, cover, headimg, original_price, participate_num,
        price, price_list, is_cut, is_record, reward_id, save_money, tenancy, type, type_id, begin_time, no, status,
        close_time, user_bargain, share_title, share_image, count_down, picture, need_people_num, appointment_bargain } = data

      // 计算活动剩余时间/活动开始时间
      let [days, hours, minutes, seconds, activityOver, bargainSuccess, activityBegin] = [99, 23, 59, 59, false, false, false]

      if (count_down) {
        // 如果count_down存在，活动未开始，给时分秒赋值，将activityBegin字段设成false 指示 距活动开始还剩
        days = timestampChange(count_down).days
        hours = timestampChange(count_down).hours
        minutes = timestampChange(count_down).minutes
        seconds = timestampChange(count_down).seconds
      } else {
        // 如果count_down===0，活动已开始，给时分秒赋值，将activityBegin字段设成true 指示 活动剩余时间
        activityBegin = true

        if (close_time > 0 || close_time === -1) {
          // 如果close_time 大于0 或close_time === -1，活动未结束
          if (close_time !== -1) {
            // 如果close_time等于-1的时候不转化close_time,让其默认为最大值
            days = timestampChange(close_time).days
            hours = timestampChange(close_time).hours
            minutes = timestampChange(close_time).minutes
            seconds = timestampChange(close_time).seconds
          }
        } else {
          // 如果close_time小于等于0并且不等于-1, 活动已结束
          activityOver = true
        }
      }

      activityOver && Taro.showToast({ title: '活动已结束！', icon: 'none' })
      status === 0 && Taro.showToast({ title: '活动已关闭！', icon: 'none' })


      // 给buttons赋值
      // Buttontype = 1  button : [分享]          本人/已参加
      // Buttontype = 2  button : [我也要砍]      本人/未参加
      // Buttontype = 3  button : [领取优惠券（亮）]    本人/已参加=>已成功  未领取优惠券
      // Buttontype = 4  button : [领取优惠券（灰）]    本人/已参加=>已成功  已领取优惠券

      // Buttontype = 5  button : [我也要砍，帮砍，分享]               他人/未参加
      // Buttontype = 6  button : [我也要砍，已帮砍（灰），分享]        他人/已砍价/未发起
      // Buttontype = 7  button : [我的砍价，已帮砍（灰），分享]        他人/已砍价/已发起
      // Buttontype = 8  button : [我的砍价，帮砍，分享]        他人/未砍价/已发起
      // Buttontype = 9  button : [预约砍价]   没预约过
      // Buttontype = 10 button : [已预约砍价提醒（灰）]  预约过

      let Buttontype = 0
      // 如果倒计时未结束


      if (share_id) {
        if (parseInt(share_id) === userID) {
          // 本人
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
          else {
            // 如果倒计时未结束
            if (count_down > 0) {
              // 如果倒计时未结束 是否已预约过
              appointment_bargain ? Buttontype = 10 : Buttontype = 9
            } else {
              // 如果倒计时已结束
              Buttontype = 2
            }
          }
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
        } // 本人 未参加
        else {
          // 如果倒计时未结束
          if (count_down > 0) {
            // 如果倒计时未结束 是否已预约过
            appointment_bargain ? Buttontype = 10 : Buttontype = 9
          } else {
            // 如果倒计时已结束
            Buttontype = 2
          }
        }
      }


      switch (Buttontype) {
        case 1: { buttons = [{ message: LOCALE_BARGAIN_SHARE, method: 'onShare', disabled: activityOver }] } break;
        case 2: { buttons = [{ message: LOCALE_BARGAIN_I_WANT, method: 'onBargain', disabled: activityOver }] } break;
        case 3: {
          buttons = [{ message: LOCALE_COUPON_RECEIVE, method: 'onReceiveCoupon', disabled: activityOver }]
        } break;
        case 4: {
          buttons = [{ message: LOCALE_COUPON_RECEIVE, method: 'onReceiveCoupon', disabled: true }]
          bargainSuccess = true
        } break;
        case 5: {
          buttons = [
            { message: LOCALE_BARGAIN_I_WANT, method: 'onBargain', disabled: activityOver },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare', disabled: activityOver },
            { message: LOCALE_BARGAIN_HELP, method: 'onHelpBargain', disabled: activityOver }
          ]
        } break;
        case 6: {
          buttons = [
            { message: LOCALE_BARGAIN_I_WANT, method: 'onBargain', disabled: activityOver },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare', disabled: activityOver },
            { message: LOCALE_BARGAIN_HELP_HAVEN, method: 'onHelpBargain', disabled: true }
          ]
        } break;
        case 7: {
          buttons = [
            { message: LOCALE_BARGAIN_VIEW_MINE, method: 'onViewMineBargain', disabled: activityOver },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare', disabled: activityOver },
            { message: LOCALE_BARGAIN_HELP_HAVEN, method: 'onHelpBargain', disabled: true }
          ]
        } break;

        case 8: {
          buttons = [
            { message: LOCALE_BARGAIN_VIEW_MINE, method: 'onViewMineBargain', disabled: activityOver },
            { message: LOCALE_BARGAIN_SHARE, method: 'onShare', disabled: activityOver },
            { message: LOCALE_BARGAIN_HELP, method: 'onHelpBargain', disabled: activityOver }
          ]
        } break;
        case 9: { buttons = [{ message: LOCALE_BARGAIN_APPOINTMENT, method: 'onBargainAppointment' }] } break
        case 10: { buttons = [{ message: LOCALE_BARGAIN_APPOINTMENT_SUCCESS, method: 'onBargainAppointment', disabled: true }] } break
      }

      this.setState({
        bargainDetail: {
          apartment_title,
          apartment_type_title,
          picture: picture.map(i => ({ cover: i })),
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
          count_down,
          no,
          user_bargain,
          share_title,
          share_image,
          need_people_num,

          days,
          hours,
          minutes,
          seconds,

        },
        buttons,
        Buttontype,
        bargainSuccess,
        activityOver,
        activityBegin,
        share_id,
        userID
      })
    })
  }

  // 我也要砍
  async onBargain() {

    // 判断用户是否已有手机号缓存
    await this.props.dispatchGetUserMsg().then(res => {
      if (res) {
        const mobile = res.data.data.user.mobile
        if (mobile) {
          !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })
          const { bargainDetail: { id } } = this.state
          this.props.dispatchBargainCut({ id }).then(response => {
            response.data && response.data.code === 1 && Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
          })
        } else {
          this.setState({ showGetPhoneNumMask: true })
        }
      }
    })
  }

  // 查看自己的砍价
  onViewMineBargain() {
    const { bargainDetail: { id } } = this.state
    Taro.navigateTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
  }

  onShare() { }

  // 预约砍价
  onBargainAppointment() {
    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })

    const { bargainDetail: { id } } = this.state
    this.props.dispatchBargainAppointment({ bargain_id: id }).then(res => {
      if (res.data.code === 1) {
        Taro.showToast({ title: '已帮您预约了砍价提醒！', icon: 'none' })
        setTimeout(() => {
          Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id })
        }, 2000)
      }
    })
  }


  // 帮砍
  onHelpBargain() {

    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })

    const { bargainDetail: { user_bargain: { bargain_record_id }, id }, share_id } = this.state
    this.props.dispatchBargainHelpCut({ bargain_record_id }).then(res => {
      if (res.data && res.data.code === 1) {
        this.setState({ showBargainCurtain: true, helpBargainMoney: res.data.data[0].price })
        setTimeout(() => {
          Taro.redirectTo({ url: PAGE_BARGAIN_DETAIL + '?id=' + id + '&share_id=' + share_id })
        }, 2000)
      }
    })
  }

  // 领取优惠券
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

  // 打开图片幕帘
  onOpenPicCurtain() {
    const { bargainDetail: { picture } } = this.state
    picture.length && this.setState({ showPicCurtain: true })
  }

  // 关闭幕帘
  onCloseCurtain() {
    this.setState({ showPicCurtain: false })
    this.setState({ showBargainCurtain: false })
  }

  // 获取手机号授权
  async getPhoneNumber(e) {
    let code = Taro.getStorageSync('code')

    const { encryptedData: encrypt_data, iv } = e.currentTarget
    const urlCode = encodeURIComponent(code)
    const urlEncrypt_data = encodeURIComponent(encrypt_data)
    const urlIv = encodeURIComponent(iv)

    iv && encrypt_data && await this.props.dispatchUserPhone({ code: urlCode, encrypt_data: urlEncrypt_data, iv: urlIv }).then(() => {
      Taro.showToast({ title: '授权成功', icon: 'none' })
      this.onClosePhoneMask()
    })

  }
  // 关闭手机号授权弹窗
  onClosePhoneMask() {
    this.setState({ showGetPhoneNumMask: false })
  }

  render() {
    const { showHelpFriends, buttons, bargainSuccess, bargainDetail, Buttontype, activityOver, activityBegin,
      showBargainCurtain, helpBargainMoney, showPicCurtain, showGetPhoneNumMask } = this.state
    const { user_bargain, count_down, picture, need_people_num } = bargainDetail

    return (
      <View className='bargain wrap-Style'>
        {/* 帮砍好友 */}
        <BargainHelpFriendsMask
          user_bargain={user_bargain}
          show={showHelpFriends}
          onClose={this.onCloseHelpFriendsMask}
        />
        {/* 图片弹窗 */}
        <Curtain
          whiteBg
          canNavigate={false}

          adList={picture}
          swiperHeight={300 * 2}
          onClose={this.onCloseCurtain}
          isOpened={showPicCurtain}
        />

        {/* 帮砍成功弹窗 */}
        {showBargainCurtain && <View className='curtain-white'>
          <AtCurtain isOpened onClose={this.onCloseCurtain}>
            {/* <Board > */}
            <View className='p-3 at-row at-row__align--center at-row__justify--center' style={{ width: 'auto' }}>
              <Text className='text-bold text-huge'>已帮砍</Text>
              <Text className='text-orange text-super'>{helpBargainMoney}元</Text>
            </View>
            {/* </Board> */}
          </AtCurtain>
        </View>
        }
        {/* 客服弹窗 暂时隐藏（勿删）  */}
        {/* <BargainAppointmentMask
          onBargainAppointment={this.onBargainAppointment}
          onClose={this.onCloseAppointmentMask}
          show={showAppointment}
        /> */}

        {/* 手机号码授权 */}
        <GetAuthorizationMask
          type='getPhoneNumber'
          onClose={this.onClosePhoneMask}
          show={showGetPhoneNumMask}
          onFillPhone={this.getPhoneNumber}
        />

        {/* 背景图 */}
        <BargainContainer />
        <View className='bargain-background' >

          <View className='bargain-body-wrap ' style={{ paddingBottom: Taro.pxTransform(75 * 2) }}>
            {/* 第一个板块 */}
            <BargainDetailMainBlock
              onOpenPicCurtain={this.onOpenPicCurtain}
              bargainDetail={bargainDetail}
              activityBegin={activityBegin}
              activityOver={activityOver}
              bargainSuccess={bargainSuccess}
            />
            {/* 砍价状态 */}
            {user_bargain &&
              <BargainDetailBargainingBlock
                need_people_num={need_people_num}
                user_bargain={user_bargain}
                onOpenHelpFriendsMask={this.onOpenHelpFriendsMask} />}
            {/* 第二个板块 */}
            <BargainDetailSecBlock bargainDetail={bargainDetail} />
            {/* 第三个板块 */}
            <BargainDetailThirdBlock />
          </View>
          {/* 底部tab栏 */}
          <BargainTab
            count_down={count_down}
            user_bargain={user_bargain}
            Buttontype={Buttontype}
            zIndex={11}
            onClick={this.onClick}
            buttons={buttons}
            bargainSuccess={bargainSuccess}
          />

          {/* 更多好房 flex */}
          <Image
            src={BARGAIN_MORE_HOUSE}
            className='bargain-detail-float-icon'
            onClick={() => Taro.switchTab({ url: PAGE_HOME })}
            mode='widthFix'
          />

        </View>

      </View>
    );
  }
}
