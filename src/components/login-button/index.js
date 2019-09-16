import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { AtTag } from 'taro-ui'
// 自定义组件
import BaseComponent from '@components/base'
// 自定义常量
import {
    PAGE_USER_AUTH,
    PAGE_ORDER_CREATE
} from '@constants/page'


export default class loginButton extends BaseComponent {

    // 跳转登录
    onNavigation() {
        const {params} = this.props
        let lastPagePath = ''
        const lastPage = Taro.getCurrentPages()[Taro.getCurrentPages().length - 1]
        for(var i in params){
            lastPagePath = '/' + lastPage.route + '?' + i + '=' + params[i]
        }
        Taro.setStorageSync('lastPagePath',lastPagePath)
        '/' + lastPage.route === PAGE_ORDER_CREATE ? Taro.redirectTo({ url: PAGE_USER_AUTH }) : Taro.navigateTo({ url: PAGE_USER_AUTH })
        // Taro.navigateTo({ url: PAGE_USER_AUTH })
    }
    render() {
        const { message , color } = this.props
        return (
            <View>
                <View className={`at-row at-row__align--center at-row__justify--center ${!color && 'text-secondary'} text-normal`}>{message}</View>
                <View className='at-row at-row__align--center at-row__justify--center'>
                    <AtTag
                      type='primary'
                      circle
                      active
                      className='mt-1'
                      onClick={this.onNavigation}
                    ><View style={{ color: '#000', marginLeft: Taro.pxTransform(50), marginRight: Taro.pxTransform(50) }}>登录</View></AtTag>
                </View>
            </View>
        );
    }
}