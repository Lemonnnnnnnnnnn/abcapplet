/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { APARTMENT_COUPON_DIST, ORDER_COUPON_DIST } from '@constants/apartment'
import { USER_COUPON_DIST } from '@constants/user'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

import '../../styles/_apartment.scss'

@connect(state => state, {
    ...apartmentActions,
})
class ApartmentCouponItem extends BaseComponent {

    state = {
        statusTextLocal: '',
    }

    onCouponReceive() {
        const { couponId, can_receive, receive_reason, block } = this.props
        let { statusTextLocal } = this.state
        let statusTextLocalClone = statusTextLocal

        !statusTextLocal && can_receive ?
            (
                statusTextLocalClone = '已领取',
                this.props.dispatchCouponReceive({ id: couponId }).then(this.setState({ statusTextLocal: statusTextLocalClone }))
            )
            : block === 'apartment' && !statusTextLocalClone && Taro.showToast({ title: receive_reason, icon: 'none' })
    }

    onSelectCoupon(id, price, block) {
        switch (block) {
            case 'order': this.props.onSelectCoupon(id, price)
        }
    }

    render() {
        const { status, worth, type, coupon_type, use_type, apartment_title, apartment_type, apartment_no,
            validity_period_time, couponId, block, active, can_receive } = this.props
        const { statusTextLocal } = this.state


        let [statusText, couponName, worthText, couponPrice, backgroundColor, textColorGlobal, textColorPrice, textColorName, textColorStaus] =
            ['', '', '', '', '', '', '', '', '']

        // 券类
        if (type === 1) couponName = '全场通用券'
        else couponName = apartment_title + '券'
        // 价格
        if (coupon_type === 1) {
            worthText = worth * 100
            worthText = worthText.toString()
            if (worthText[worthText.length - 1] === '0') {
                worthText = worthText[0]
            }
            couponPrice = worthText + '折'
        } else {
            worthText = parseFloat(worth)
            couponPrice = '￥' + worthText
        }

        switch (block) {
            case 'user': {
                statusText = status !== undefined && USER_COUPON_DIST[0].title
                backgroundColor = status === 2 ? 'background-gray' : 'background-white'
                textColorGlobal = status === 2 ? 'text-white' : 'text-secondary'
                textColorPrice = status !== 2 && 'text-yellow'
                textColorName = status !== 2 && 'text-black'
                textColorStaus = status !== 2 && 'text-yellow'
            } break
            case 'order': {
                statusText = status !== undefined && ORDER_COUPON_DIST[status].message
                backgroundColor = 'background-white'
                textColorGlobal = 'text-secondary'
                textColorPrice = 'text-yellow'
                textColorName = 'text-black'
                textColorStaus = 'text-yellow'
            } break
            case 'apartment': {
                statusText = can_receive ? '领取' : '无法领取'
                backgroundColor = 'background-white'
                textColorGlobal = can_receive ? 'text-secondary' : 'text-gray--1'
                textColorPrice = can_receive && 'text-yellow'
                textColorName = can_receive && 'text-black'
                textColorStaus = can_receive && !statusTextLocal ? 'text-yellow' : 'text-gary'

            } break
        }

        return (
            <View
                className={`${active ? 'shadow-yellow' : 'shadow-black'} ${backgroundColor} apartment-coupon-item  mt-2`}
                onClick={this.onSelectCoupon.bind(this, couponId, couponPrice, block)} >
                <View className={`at-row inherit-Height ${textColorGlobal}`}  >
                    {/* 左 价格 */}
                    <View style={{ width: '30%' }} >
                        <View className={`${textColorPrice} at-row at-row__justify--center at-row__align--center inherit-Height `} >
                            {coupon_type === 2 && <View className='text-normal  page-middile mb-1' >￥</View>}
                            <View className='text-bold  page-middile' style={{ fontSize: Taro.pxTransform(27 * 2) }}>{worthText}</View>
                            {coupon_type === 1 && <View className='text-huge  page-middile mt-2'>折</View>}
                        </View>
                    </View>
                    {/* 中 券类  有效期*/}
                    <View className=' inherit-Height ' style={{ borderRight: '1px dashed #EEEEEE', width: '40%' }}>
                        <View className='at-row at-row__align--center inherit-Height' >
                            <View>
                                <View className={`${textColorName} text-small text-bold`}>{couponName}</View>
                                <View className={`${textColorName} text-mini `}>
                                    {apartment_type && <Text>{apartment_type} </Text>}
                                    {apartment_no && <Text> {apartment_no}</Text>}
                                </View>
                                <View className='text-mini '>{validity_period_time}</View>
                            </View>
                        </View>
                    </View>
                    {/* 右 减免类型 状态文本*/}
                    <View className='text-normal ' onClick={this.onCouponReceive} style={{ width: '30%' }}>
                        <View className=' at-row at-row__justify--center at-row__align--center inherit-Height' style={{ color: statusTextLocal ? '#5D5D5D !important' : '' }}>
                            <View>
                                <View className='at-row at-row__justify--center at-row__align--center'>
                                    <View className={`${textColorStaus}`}>{statusTextLocal || statusText}</View>
                                    {!can_receive && block === 'apartment' && <AtIcon value='help' size='14' color='#88888'></AtIcon>}
                                </View>
                                {use_type === 1 && <View className='text-mini text-center'>仅限首月</View>}
                            </View>

                        </View>
                    </View>
                </View>
                <View className={`${active && 'top-active'} apartment-coupon-item-angle top`} style={{ top: Taro.pxTransform(-6) }}></View>
                <View className={`${active && 'bottom-active'} apartment-coupon-item-angle bottom`} style={{ bottom: Taro.pxTransform(-6) }}></View>
            </View>

        )
    }
}

export default ApartmentCouponItem
