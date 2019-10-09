// Taro 组件
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { APARTMENT_COUPON_DIST } from '@constants/apartment'
import '../../styles/_apartment.scss'


class ApartmentCouponItem extends BaseComponent {

    static defaultProps = {
        show: false,
        facilitys: []
    }

    render() {
        const { voucher, orderAmount, validityPeriod, status } = this.props
        let statusText = ''
        if (status) { statusText = APARTMENT_COUPON_DIST[status].message }

        return (
            <View className='apartment-coupon-item mt-2'>
                <View className='at-row at-row__align--center at-row__justify--around'>
                    <View className='text-white px-3 at-col at-col-8' style={{ borderRight: '1px dashed #fff' }}>
                        <View className='text-super'>{voucher}</View>
                        <View className='text-small'>优惠券满{orderAmount}可用</View>
                        <View className='text-small'>有效期{validityPeriod}</View>
                    </View>
                    <View className='text-huge text-center at-col at-col-3' style={{ color: status === (3 || 4) ? '#AA6D00' : '#fff' }}>{statusText}</View>
                </View>
                <View className='apartment-coupon-item-angle vertical-center' style={{ left: Taro.pxTransform(-12) }}></View>
                <View className='apartment-coupon-item-angle vertical-center' style={{ right: Taro.pxTransform(-12) }}></View>
            </View>

        )
    }
}

export default ApartmentCouponItem
