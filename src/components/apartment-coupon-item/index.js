// Taro 组件
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { APARTMENT_COUPON_DIST } from '@constants/apartment'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

@connect(state => state, {
    ...apartmentActions,
})
class ApartmentCouponItem extends BaseComponent {

    state = {
        statusTextLocal: ''
    }

    onCouponReceive() {
        const { couponId, status } = this.props
        status && this.props.dispatchCouponReceive({ id: couponId }).then(this.setState({ statusTextLocal: '已领取' }))

    }

    render() {
        const { status, worth, validity_period_time } = this.props
        const { statusTextLocal } = this.state
        let statusText = ''
        if (status) { statusText = APARTMENT_COUPON_DIST[status].message }
        console.log(statusTextLocal)

        return (
            <View className='apartment-coupon-item mt-2'>
                <View className='at-row at-row__align--center at-row__justify--around'>
                    <View className='text-white px-3 at-col at-col-8' style={{ borderRight: '1px dashed #fff' }}>
                        <View className='text-super'>{worth}</View>
                        <View className='text-small'>优惠券满{worth}可用</View>
                        <View className='text-small'>有效期{validity_period_time}</View>
                    </View>
                    <View className='text-huge text-center at-col at-col-3' onClick={this.onCouponReceive}>{statusTextLocal || statusText}</View>
                </View>
                <View className='apartment-coupon-item-angle vertical-center' style={{ left: Taro.pxTransform(-12) }}></View>
                <View className='apartment-coupon-item-angle vertical-center' style={{ right: Taro.pxTransform(-12) }}></View>
            </View>

        )
    }
}

export default ApartmentCouponItem
