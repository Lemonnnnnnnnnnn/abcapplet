import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import ApartmentCouponList from '@components/apartment-coupon-list'
import { PAYLOAD_COUPON_LIST } from '@constants/api'

// 自定义组件
import BaseComponent from '@components/base'
import Board from '@components/board'

// redux相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

import '../../styles/_page.scss'
import '../../styles/_board.scss'

@connect(state => state, {
  ...apartmentActions,
})

class ExternalIndex extends BaseComponent {
  config = {
    navigationBarTitleText: '优惠券领取',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  componentWillMount() {
    // const { id } = this.$router.params
  }

  render() {
    const { apartmentCouponList: { list } } = this.props
    const { id } = this.$router.params

    return (
      <View className='page-orange'>
        {/* 白色纸条 */}

        <View className='vertical-level-center board--all board--wrap board'>

          <View className='p-3'>
            {/* 金额 */}
            <View className='at-row  at-row__justify--center  board--all board--pink text-bold' >
              <View style={{ fontSize: Taro.pxTransform(31 * 2) }}>￥</View>
              <View style={{ fontSize: Taro.pxTransform(70 * 2) }}>500</View>
            </View>
            {/* 分隔符 */}
            <View className='line-dotted mt-3 mb-3'></View>
            {/* 条件 */}
            <View>
              <View>全场通用券</View>
              <View className='text-secondary'>优惠券使用条件</View>
              <View></View>
            </View>
          </View>

        </View>

      </View>
    )
  }
}

export default ExternalIndex
