// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import Borad from '@components/board'
import BaseComponent from '@components/base'

// 自定义常量
import { ORDER_PROCESS_SIMPLE } from '@constants/apartment'
import { LOCALE_ORDER_VIEW_PROCESS_GUIDE } from '@constants/locale'

class OrderProcessGuidance extends BaseComponent {
    static defaultProps = {
        processArr: ORDER_PROCESS_SIMPLE
    }

    render() {
        const { processArr } = this.props
        return (
            <Borad className='px-3 py-2 mb-3' >
                <View onClick={this.props.onShowProcessMask} className='text-mini text-secondary text-center mb-1'>{LOCALE_ORDER_VIEW_PROCESS_GUIDE}
                    <AtIcon value='chevron-right' size='14' color='#888888'></AtIcon></View>
                <View className='at-row at-row__justify--around at-row__align--center'>
                    {
                        processArr.map(i =>
                            <View key={i}>
                                <Image lazyLoad src={i.url} style={{ width: Taro.pxTransform(64 * 2), height: Taro.pxTransform(73 * 2) }} />
                                <View className='text-small text-center'>{i.title}</View>

                            </View>)
                    }

                </View>
            </Borad>
        )
    }
}

export default OrderProcessGuidance
