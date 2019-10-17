// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import Borad from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { ORDER_SIGN, MANAGER_CONFIRM, SIGN_SUCCESS } from '@constants/picture'

class OrderProcessGuidance extends BaseComponent {

    render() {
        const locale = [
            { url: ORDER_SIGN, title: '立即预定' },
            { url: MANAGER_CONFIRM, title: '管家确认' },
            { url: SIGN_SUCCESS, title: '签约成功' },
        ]
        return (
            <Borad className='px-3 py-2 mb-3' >
                <View onClick={this.props.onShowProcessMask} className='text-mini text-secondary text-center mb-1'>进入完整签约流程引导
                <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon></View>
                <View className='at-row at-row__justify--around at-row__align--center'>
                    {
                        locale.map(i =>
                            <View key={i}>
                                <Image src={i.url} style={{ width: Taro.pxTransform(64 * 2), height: Taro.pxTransform(73 * 2) }} />
                                <View className='text-small text-center'>{i.title}</View>

                            </View>)
                    }

                </View>
            </Borad>
        )
    }
}

export default OrderProcessGuidance
