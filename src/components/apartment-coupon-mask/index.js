/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
import BaseComponent from '@components/base'
import ApartmentCouponList from '@components/apartment-coupon-list'

// 自定义常量
import { PAYLOAD_COUPON_LIST } from '@constants/api'
import {LOCALE_ORDER_RENTAL_COUPON} from '@constants/locale'

// redux相关
import { connect } from '@tarojs/redux'
import * as apartmentActions from '@actions/apartment'

@connect(state => state, {
    ...apartmentActions,
})

class ApartmentCouponMask extends BaseComponent {

    static defaultProps = {
        show: false,
    }

    CouponList = node => this.ApartmentCouponList = node

    onMaskTouchMove(e) {
        return e.stopPropagation()
    }

    onBottomOut() {
        this.ApartmentCouponList.onNextPage()
    }

    render() {
        const { show, onClose, apartmentCouponList } = this.props
        const { list } = apartmentCouponList

        return (
            show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
                <Board fixed='bottom' border='top'>
                    <AtIcon onClick={onClose} value='close' size='15' className='p-2 mr-1 mt-1' color='#888' style='position : absolute ; right : 0'></AtIcon>
                    <View className='text-huge  mt-2 text-center pb-2'> {LOCALE_ORDER_RENTAL_COUPON}</View>
                    <ScrollView style={{ height: Taro.pxTransform(950) }} scrollY onScrollToLower={this.onBottomOut}>

                        <ApartmentCouponList
                            block='apartment'
                            couponList={list}
                            ref={this.CouponList}

                            defaultPayload={PAYLOAD_COUPON_LIST}
                            dispatchList={this.props.dispatchCouponListPost}
                            dispatchNextPageList={this.props.dispatchNextPageCouponListPost}
                        />
                    </ScrollView>
                    <View style={{ height: Taro.pxTransform(170) }}></View>
                </Board>
                <Masks show={show} />

            </View>

        )
    }
}

export default ApartmentCouponMask
