import Taro, { Component } from '@tarojs/taro';
import { AtIcon } from 'taro-ui'
import { View, Text, Button, Image } from '@tarojs/components';

// 自定义常量
import { PAGE_HOME } from '@constants/page'

import BaseComponent from '../../components/base';


export default class CustomNav extends BaseComponent {
    async componentWillMount() {
        await Taro.getSystemInfo().then(res => {
            this.setState({ navHeight: 72, statusBarHeight: res.statusBarHeight })
            if (res.model.indexOf('iPhone X') !== -1) {
                this.setState({ navHeight: 88, statusBarHeight: res.statusBarHeight })
            } else if (res.model.indexOf('iPhone') !== -1) {
                this.setState({ navHeight: 64, statusBarHeight: res.statusBarHeight })
            }
        })
    }


    onReturn() {
        const currentRoute = Taro.getCurrentPages()
        currentRoute.length > 1 ? Taro.navigateBack() : Taro.switchTab({ url: PAGE_HOME })

    }

    onBackHome() {
        Taro.switchTab({ url: PAGE_HOME })
    }

    render() {
        const { navHeight, statusBarHeight } = this.state

        const { title } = this.props

        const navStyle = {
            height: navHeight ? Taro.pxTransform(navHeight * 2) : Taro.pxTransform(128),
        }

        const statusBarStyle = {
            height: statusBarHeight ? Taro.pxTransform(statusBarHeight * 2) : Taro.pxTransform(40)
        }

        const titleStyle = {
            height: navHeight && statusBarHeight ? Taro.pxTransform((navHeight - statusBarHeight) * 2) : Taro.pxTransform(88),
        }
        return (
            <View className='navStyle' style={navStyle}>
                {/* 状态栏 */}
                <View style={statusBarStyle}></View>
                {/* 标题栏 */}
                <View style={{ position: "relative" }}>
                    <View className='at-row at-row__align--center ml-2 navStyle-titleStyle' style={titleStyle} >
                        <View className='at-row at-row-3 at-row__align--center at-row__justify--between navStyle-menuButtonStyle' >
                            <View className='at-col-6 at-col__justify--center at-col__align--center'>
                                <AtIcon onClick={this.onReturn} className='pl-2 pr-2' value='chevron-left' size='22' ></AtIcon>
                            </View>
                            <View className='grayLineStyle' ></View>
                            <Image onClick={this.onBackHome} src='https://images.gongyuabc.com//image/backHome.png' className='pl-2 pr-2' style={{ height: "17px", width: "17px" }}></Image>
                        </View>
                    </View>
                    {/* title */}
                    <View className='text-large navStyle-titleFontStyle text-bold'>{title}</View>
                </View>
            </View>
        )
    }
}