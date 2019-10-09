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
        const { show, onClose } = this.props
        const AnalogArr = [
            { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 1 },
            { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 1 },
            { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 2 },
            { voucher: '￥100', orderAmount: '￥1500', validityPeriod: '2019/09/09-2019/12/12', status: 3 },
        ]

        return (
            show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
                <Board fixed='bottom' border='top'>
                    <AtIcon onClick={onClose} value='close' size='15' className='mt-3 mr-3 p-2' color='#888' style='float:right'></AtIcon>
                    <View className='text-huge text-bold mt-2 text-center'> 租房优惠券</View>
                    {
                        AnalogArr.map(i =>
                            <ApartmentCouponItem
                                key={i.voucher}
                                voucher={i.voucher}
                                orderAmount={i.orderAmount}
                                validityPeriod={i.validityPeriod}
                                status={i.status}
                            />)
                    }

                    <View style={{ height: "20vw" }}></View>
                </Board>
                <Masks show={show} />

            </View>

        )
    }
}

export default ApartmentCouponMask
