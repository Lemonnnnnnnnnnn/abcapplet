import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
// redux相关
import { connect } from '@tarojs/redux'
import * as bargainActions from '@actions/bargain'

// 自定义常量
import {
  LOCALE_BARGAIN_RECEIVE,
  LOCALE_BARGAIN_RECEIVE_SUCCESS,
  LOCALE_NONE
} from '@constants/locale'
import { PAGE_USER_AUTH } from '@constants/page'

import BargainCouponCard from '../components/bargain-coupon-card'
import BargainCouponIntroduce from '../components/bargain-coupon-introduce'
import BargainTab from '../components/bargain-tab'

@connect(state => state, {
  ...bargainActions
})

export default class BargainCoupon extends Component {

  config = {
    navigationBarTitleText: '领取优惠券',
    navigationBarBackgroundColor: '#FA624A',
  }

  componentWillMount() {
    !Taro.getStorageSync('user_info').token && Taro.navigateTo({ url: PAGE_USER_AUTH })
    const { id, share_id } = this.$router.params
    this.props.dispatchBargainDetail({ id: parseInt(id) }).then(({ data: { data } }) => {
      this.setState({
        coupon: data.coupon,
        price: data.price,
        apartment_title: data.apartment_title,
        apartment_type_title: data.apartment_type_title,
        no: data.no,
        cover: data.cover,
        user_bargain: data.user_bargain
      })
    })
  }

  onReceiveCoupon() {
    const { user_bargain: { bargain_record_id } } = this.state
    this.props.dispatchBargainGetCoupon({ bargain_record_id }).then(res => {
      if (res.data.code === 1) {
        Taro.showToast({ title: LOCALE_BARGAIN_RECEIVE_SUCCESS, icon: LOCALE_NONE })
        setTimeout(() => {
          Taro.navigateBack()
        }, 1000)
      }
    })
  }

  render() {
    const { coupon, price, apartment_title, apartment_type_title, no, cover, user_bargain } = this.state
    const buttons = [{ message: LOCALE_BARGAIN_RECEIVE, method: 'onReceiveCoupon' }]
    return (
      <View className='bargain-background'>
        <BargainCouponCard
          coupon={coupon}
          price={price}
          apartment_title={apartment_title}
          no={no}
          apartment_type_title={apartment_type_title}
          cover={cover}
        />
        <BargainCouponIntroduce coupon={coupon} />
        {/* 底部tab栏 */}
        <BargainTab
          user_bargain={user_bargain}
          zIndex={11}
          onClick={this.onReceiveCoupon}
          buttons={buttons}
        />
      </View>
    );
  }
}
