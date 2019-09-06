// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input, Button } from '@tarojs/components'
import { AtButton } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import BaseComponent from '@components/base'


// 自定义常量
import { connect } from '@tarojs/redux'
import * as actions from '@actions/user'

@connect(state => state.user, actions)
class GetAuthorizationMask extends BaseComponent {
    static defaultProps = {
        show: false,
        apartments: [],
    }

    onMaskTouchMove(e) {
        return e.stopPropagation()
    }

    render() {
        let { show, type } = this.props

        return show && <View className='apartment-mask ' onTouchMove={this.onMaskTouchMove}>
            {/* 主体内容 */}
            <Board fixed='top' border='top'>
                <View className='page-msg p-4' style='width:80vw;border-radius: 4vw;' >
                    {
                        type === 'getPhoneNumber' ?
                            <View>
                                <View className='text-large ' style={{ textAlign: 'center' }}>是否自动填充此微信绑定的手机号码？</View>
                                <View className='mt-5'>
                                    <AtButton circle className='btn-yellow active pl-2 pr-2' openType='getPhoneNumber' onGetPhoneNumber={this.props.onFillPhone}>获取手机号码</AtButton>
                                    <AtButton circle className='btn-grey active mt-2 pl-2 pr-2' onClick={this.props.onClose}>取消</AtButton>
                                </View>
                            </View> :
                            <View>
                                <View className='text-large ' style={{ textAlign: 'center' }}>是否展示您附近的公寓？</View>
                                <View className='mt-5'>
                                    <AtButton circle className='btn-yellow active pl-2 pr-2' openType='openSetting' onOpenSetting={this.props.onClose}>获取您的地理位置</AtButton>
                                    <AtButton circle className='btn-grey active mt-2 pl-2 pr-2' onClick={this.props.onClose}>取消</AtButton>
                                </View>
                            </View>
                    }

                </View>
            </Board>

            {/* 遮罩层 */}
            <Masks show={show} />
        </View>
    }
}

export default GetAuthorizationMask
