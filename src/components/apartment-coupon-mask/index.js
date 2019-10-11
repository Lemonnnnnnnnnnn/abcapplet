/* eslint-disable react/jsx-indent-props */
// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text, Image } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
import BaseComponent from '@components/base'
import ApartmentCouponItem from '@components/apartment-coupon-item'


class ApartmentCouponMask extends BaseComponent {

    static defaultProps = {
        show: false,
        facilitys: []
    }


    onMaskTouchMove(e) {
        return e.stopPropagation()
    }


    render() {
        const { show, onClose ,couponList} = this.props
        return (
            show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
                <Board fixed='bottom' border='top'>
                    <AtIcon onClick={onClose} value='close' size='15' className='p-2 mr-1 mt-1' color='#888' style='position : absolute ; right : 0'></AtIcon>
                    <View className='text-huge text-bold mt-2 text-center pb-2'> 租房优惠券</View>
                    {
                        couponList.map(i =>
                            <ApartmentCouponItem
                                key={i}
                                couponId={i.id}
                                worth={i.worth}
                                receive_num={i.receive_num}
                                validity_period_time={i.validity_period_time}
                                status={i.status}
                            />)
                    }

                    <View style={{ height: Taro.pxTransform(170) }}></View>
                </Board>
                <Masks show={show} />

            </View>

        )
    }
}

export default ApartmentCouponMask
