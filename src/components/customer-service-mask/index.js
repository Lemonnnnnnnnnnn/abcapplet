// Taro 相关
import Taro from '@tarojs/taro'
import { View, Button } from '@tarojs/components'

import ABCIcon from '@components/abc-icon'

import { AtFloatLayout } from 'taro-ui'

import { COLOR_GREY_2 } from '@constants/styles'


// 自定义组件
import Board from '@components/board'

// 自定义常量

class CustomerServiceMask extends Taro.Component {
    static defaultProps = {
    }

    onMaskTouchMove(e) {
        return e.stopPropagation()
    }

    onCallPhone() {
        Taro.makePhoneCall({ phoneNumber: '0592-5911297' })
    }

    render() {
        let { show } = this.props

        const greyStyle = {
            height: '1rpx',
            background: 'rgb(220,220,220)',
            width: '80%',
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%,0)',

        }

        const fontStyle = {
            padding: '15px',
            textAlign: 'center',
            color: '#888888',
            fontSize: '12px',
        }

        const ButtonfontStyle = {
            padding: '10px',
            textAlign: 'center',
            color: '#888888',
            fontSize: '12px',
        }

        const buttonStyle = {
            border: "1px solid #fff",
            color: "#888",
            padding: 0,
            width: '100%',
        }

        return <View onTouchMove={this.onMaskTouchMove}>
            {/* 主体内容 */}
            <AtFloatLayout isOpened={show} onClose={this.props.onClose}>
                <Button open-type='contact' size='mini' plain bindcontact='handleContact' style={buttonStyle}>
                    <View style={ButtonfontStyle}>
                        在线客服
                    </View>
                </Button>
                <View style={greyStyle}></View>
                <View onClick={this.onCallPhone} style={fontStyle}>电话联系</View>
            </AtFloatLayout>
            {/* 遮罩层 */}
        </View >
    }
}

export default CustomerServiceMask
