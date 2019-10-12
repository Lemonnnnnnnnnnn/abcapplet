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
      // <View className='navStyle' style={navStyle}>
      //     {/* 状态栏 */}
      //     <View style={statusBarStyle}></View>
      //     {/* 标题栏 */}
      //     <View style={{ position: "relative" }}>
      //         <View className='at-row at-row__align--center ml-2 navStyle-titleStyle' style={titleStyle} >
      //             <View className='at-row at-row-3 at-row__align--center at-row__justify--between navStyle-menuButtonStyle' >
      //                 <View className='at-col-6 at-col__justify--center at-col__align--center'>
      //                     <AtIcon onClick={this.onReturn} className='pl-2 pr-2' value='chevron-left' size='22' ></AtIcon>
      //                 </View>
      //                 <View className='grayLineStyle' ></View>
      //                 <Image onClick={this.onBackHome} src='https://images.gongyuabc.com//image/backHome.png' className='pl-2 pr-2' style={{ height: "17px", width: "17px" }}></Image>
      //             </View>
      //         </View>
      //         {/* title */}
      //         <View className='text-large navStyle-titleFontStyle text-bold'>{title}</View>
      //     </View>
      // </View>
    )
  }
}
