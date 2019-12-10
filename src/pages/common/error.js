import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui'

import Board from '@components/board'
import Masks from '@components/masks'
import BaseComponent from '../../components/base';


class error extends BaseComponent {

  config = {
    navigationBarTitleText: ''
  }

  state = {}

  componentWillMount() { }
  componentDidMount() { }


  render() {

    return (
      <View >
        <Image src='https://images.gongyuabc.com/image/sublease/master_no_ios_new_last.jpg' mode='scaleToFill' style={{ width: '100vw', height: '100vh' }}></Image>
        <Board fixed='bottom' border='all' style='position:absolute;z-index:300 '  >
          <View className='page-requirement-error py-2 px-3'  >

            <View className='text-normal mx-3 mt-3 ' style={{ letterSpacing: Taro.pxTransform(1), lineHeight: Taro.pxTransform(40) }}>很抱歉，ABC找房小程序暂不支持iOS 10.0.0 以下版本。</View>
            <View className='text-normal text-bold mx-3  mt-4' style={{ letterSpacing: Taro.pxTransform(1), lineHeight: Taro.pxTransform(40) }}>您可以回复“2” 添加客服为好友，拉您到相关城市租房群。</View>

            <View className='mt-5 mb-3'>
              <AtButton
                circle
                openType='contact'
                className='mx-2 btn-yellow active'
              >
                去回复
            </AtButton>
            </View>
          </View>
        </Board>
        {/* 遮罩层 */}
        <Masks show={true} />
      </View>
    );
  }
}
export default error;
