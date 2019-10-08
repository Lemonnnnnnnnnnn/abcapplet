import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import BaseComponent from '@components/base'

class MaskTop extends BaseComponent {

    render() {
        return <View style={{ position: 'relative' }}>
            <View className='mask-top' ></View>

        </View>
    }
}

export default MaskTop
