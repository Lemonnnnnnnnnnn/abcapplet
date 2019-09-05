import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

class Mask extends Taro.Component {

    render() {
        const maskTopStyle = {
            borderTopLeftRadius: Taro.pxTransform(24),
            borderTopRightRadius: Taro.pxTransform(24),
            height: Taro.pxTransform(24),
            width: '100%',
            position: 'absolute',
            top: Taro.pxTransform(-24),
            background: '#fff',

        }
        return <View style={{ position: 'relative' }}>
            <View style={maskTopStyle}></View>

        </View>
    }
}

export default Mask
