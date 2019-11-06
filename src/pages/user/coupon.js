// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// Redux相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

// 自定义变量
import {
  PAYLOAD_COUPON_CAN_USED,
  PAYLOAD_COUPON_HAVE_BEEN_USED,
  PAYLOAD_COUPON_USER_EXPIRED
} from '@constants/api'
import { USER_COUPON_DIST } from '@constants/user'

// 自定义组件
import Decorate from '@components/decorate'
import CouponList from '@components/coupon-list'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...userActions
})
class UserFavorite extends Component {
  config = {
    navigationBarTitleText: '我的优惠券',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }
  state = {
    code: '',
    navList: USER_COUPON_DIST,
    current: 0,
  }

  refCouponListCanUsed = node => this.CouponListCanUsed = node
  refCouponListHaveBeenUsed = node => this.CouponListHaveBeenUsed = node
  refCouponListExpired = node => this.CouponListExpired = node

  componentWillMount() {
    buryPoint()
  }

  onInputValue(e) {
    const code = e.detail.value
    this.setState({ code })
  }

  onSubmit() {
    const { code } = this.state
    this.props.dispatchCouponReceiveCode({ code }).then(res => {
      res.data &&
        (Taro.showToast({ title: res.data.msg, icon: 'none' }),
          this.onPullDownRefresh())
    })
      .catch(err => console.log(err))
  }

  onChangeBlock(value) {
    const { navList } = this.state
    let navListClone = JSON.parse(JSON.stringify(navList))

    navListClone.map(i => {
      if (i.status === value) { i.active = true } else { i.active = false }
    })
    this.setState({ navList: navListClone, current: value })
  }


  // 加载下一页
  onReachBottom() {
    const { navList, current } = this.state
    const { ref } = navList[current]
    this[ref].onNextPage()
  }

  // 刷新页面
  onPullDownRefresh() {
    const { navList, current } = this.state
    const { ref } = navList[current]
    this[ref] && this[ref].onReset(null)
    Taro.stopPullDownRefresh()
  }


  render() {
    const { code, navList, current } = this.state
    const { userCouponList } = this.props
    const { list } = userCouponList

    let couponList = []

    list && list.length && list.map(i => couponList.push({
      status: i.status,
      list: { ...i.coupon, period_time: i.period_time },
    }))

    return (
      <View >
        {/* 背景底色 */}
        <Decorate height='300' />

        <View className='user-coupon'>
          {/* 输入券码领取新券 */}
          <View className='pt-3 at-row at-row__justify--around at-row__align--center' >
            <View className='at-col at-col-8 at-col__align--center search-box'>
              <View className='at-row at-row__align--center' style={{ height: '100%' }}>
                <Input className='text-normal  user-coupon-input' placeholder='输入券码领取新券' value={code} onInput={this.onInputValue}></Input>
              </View>
            </View>
            <View className='at-col at-col-3' >
              <AtButton className='btn-yellow active' onClick={this.onSubmit} circle>领取</AtButton>
            </View>
          </View>

          {/* 券库（三种状态） */}
          <View className='mt-4'>
            {/* 导航栏 */}
            <View className='at-row at-row__justify--around'>
              {navList.map(i => <View onClick={this.onChangeBlock.bind(this, i.status)} className={i.active ? 'text-large text-bold user-coupon-nav-active' : 'text-normal text-secondary'} key={i}>{i.title}</View>)}
            </View>
            {/* 内容 */}

            <View>
              {/* 可使用板块 */}
              {
                current === 0 && <CouponList
                  ref={this.refCouponListCanUsed}
                  blockStatus={current}
                  block='user'
                  couponList={couponList}

                  defaultPayload={PAYLOAD_COUPON_CAN_USED}
                  dispatchList={this.props.dispatchCouponUser}
                  dispatchNextPageList={this.props.dispatchNextPageCouponUser}
                />
              }

              {/* 已使用板块 */}
              {
                current === 1 && <CouponList
                  ref={this.refCouponListHaveBeenUsed}
                  blockStatus={current}
                  block='user'
                  couponList={couponList}

                  defaultPayload={PAYLOAD_COUPON_HAVE_BEEN_USED}
                  dispatchList={this.props.dispatchCouponUser}
                  dispatchNextPageList={this.props.dispatchNextPageCouponUser}
                />
              }

              {/* 已过期板块 */}
              {
                current === 2 && <CouponList
                  ref={this.refCouponListExpired}
                  blockStatus={current}
                  block='user'
                  couponList={couponList}

                  defaultPayload={PAYLOAD_COUPON_USER_EXPIRED}
                  dispatchList={this.props.dispatchCouponUser}
                  dispatchNextPageList={this.props.dispatchNextPageCouponUser}
                />
              }
            </View>
          </View>

        </View>
      </View>
    )
  }
}

export default UserFavorite
