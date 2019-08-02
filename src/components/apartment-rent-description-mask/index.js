// Taro 组件
import Taro from '@tarojs/taro'
import { AtButton, AtIcon } from 'taro-ui'
import { View, Text } from '@tarojs/components'
import Masks from '@components/masks'
import Board from '@components/board'

// 自定义组件
// import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import {
    LOCALE_RENT_TYPE,
    LOCALE_COST_DETAIL,
    LOCALE_RENT_INTRODUCE,
    LOCALE_RENT_INTRODUCE_ONE,
    LOCALE_RENT_INTRODUCE_TWO,
    LOCALE_RENT_BUTTON,
    LOCALE_RENT_RISK_MONEY_ONE,
    LOCALE_RENT_RISK_MONEY_TWO,
} from '@constants/locale'

import {
    PAGE_ORDER_CREATE
} from '@constants/page'

class ApartmentItemMask extends BaseComponent {

    static defaultProps = {
        show: false,
        cost: null,
        cost_list: [
            { name: "", price: "" },
            { name: "", price: "" },
            { name: "", price: "" },
            { name: "", price: "" },
        ]
    }

    onBookRoom(){
        const {typeId} = this.props
        Taro.navigateTo({url:`${PAGE_ORDER_CREATE}?type_id=${typeId}`})
    }

    onMaskTouchMove(e) {
        return e.stopPropagation()
      }

    render() {
        const { show, cost, cost_info, onClose } = this.props
        let cost_list = []
        for (var i in cost_info) {
            cost_list.push(
                {
                    'name': i,
                    'price': cost_info[i]
                }
            );
        }

        const divdingLine = {
            borderBottom: "1Px solid #F8F8F8",
            lineHeight: "35px"
        }

        const introduceStyle = {
            lineHeight: "25px"
        }

        return (
            show && <View className=' apartment-mask' onTouchMove={this.onMaskTouchMove}>
                <Board fixed='bottom' border='top'>
                    <AtIcon onClick={onClose} value='close' size='15' className='mt-3 mr-3' color='#888' style='float:right'></AtIcon>

                    <View className='ml-3 mr-3'>
                        <View className='mt-3 mb-3 text-bold text-huge'>{LOCALE_RENT_TYPE}</View>
                        <View className='text-large text-secondary'>{cost}</View>
                    </View>
                    <View className='ml-3 mr-3'>
                        <View className='mt-3 mb-3 text-bold text-huge'>{LOCALE_COST_DETAIL}</View>
                        <View className='text-large text-secondary'>
                            {
                                cost_list.map((value, key) => (
                                    <View style={divdingLine} className='at-row at-row__justify--between text-large text-secondary' key={key}>
                                        <Text >{value.name}</Text>
                                        <Text >{value.price}</Text>
                                    </View>
                                ))
                            }
                        </View>
                    </View>
                    <View className='ml-3 mr-3'>
                        <View className='mt-3 mb-3 text-bold text-huge'>{LOCALE_RENT_INTRODUCE}</View>
                        <View style={introduceStyle} className='text-large text-secondary'>
                            <View>{LOCALE_RENT_INTRODUCE_ONE}</View>
                            <View>{LOCALE_RENT_INTRODUCE_TWO}</View>
                        </View>
                    </View>
                    <View className='at-row mb-4 mt-4 ml-3 mr-3'>
                        <View onClick={this.onBookRoom} className='at-col-4 ml-2'>
                            <AtButton className='btn-yellow active' circle>{LOCALE_RENT_BUTTON}</AtButton>
                        </View>
                        <View className='at-col-1'></View>
                        <View className='at-col-6 text-large'>
                            <View>{LOCALE_RENT_RISK_MONEY_ONE}</View>
                            <View>{LOCALE_RENT_RISK_MONEY_TWO}</View>
                        </View>
                    </View>

                </Board>


                <Masks show={show} />

            </View>

        )
    }
}

export default ApartmentItemMask
