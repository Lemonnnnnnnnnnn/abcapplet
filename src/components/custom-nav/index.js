import Taro, { Component } from '@tarojs/taro';

import { View,  } from '@tarojs/components';
//引用外部组件
import NavBar from 'taro-navigationbar'
// 自定义常量
import { PAGE_HOME } from '@constants/page'

import BaseComponent from '../../components/base';


export default class CustomNav extends BaseComponent {



  onReturn() {
    Taro.navigateBack()
  }

  onBackHome() {
    Taro.switchTab({
      url: PAGE_HOME
    })
  }

  render() {

    const { title } = this.props


    return (
      <View>
        <NavBar
          title={title}
          background='#fff'
          back
          home
          onBack={this.onReturn}
          onHome={this.onBackHome}
        />
      </View>

    )
  }
}
