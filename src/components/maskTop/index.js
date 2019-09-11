import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import BaseComponent from '@components/base'

class MaskTop extends BaseComponent {

    render() {
        const maskTopStyle = {
            borderTopLeftRadius: Taro.pxTransform(24),
            borderTopRightRadius: Taro.pxTransform(24),
            height: Taro.pxTransform(24),
            width: '100%',
            position: 'absolute',
            top: Taro.pxTransform(-23),
            background: '#fff',
        }
        return <View style={{ position: 'relative' }}>
            <View className='mask-top' ></View>

        </View>
    }
}

export default MaskTop
