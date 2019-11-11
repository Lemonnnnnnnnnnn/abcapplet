import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui'

import Board from '@components/board'
import BaseComponent from '@components/base'

import '../../../../styles/_bargain.scss'


export default class BargainingBlock extends BaseComponent {
  state = {
  }

  render() {
    const url = 'https://images.gongyuabc.com/7aadedd1090e6d68fcb20f6be03794f9'

    return (
      <Board className='mt-2 ml-3 mr-3'>
        {/* 板块内边距 */}
        <View className='at-row'>
          {/* 左 */}
          <View className='at-col at-col-3'>
            <View className='at-row at-row__align--center at-row__justify--center inherit-Height'>
              <Image src={url} className='bargain-bargaining-image'></Image>
            </View>
          </View>
          {/* 中 */}
          <View className='at-col at-col-4 position-relative'>
            <View className='vertical-level-center'>
              <View className='text-large text-bold'>25米大砍刀</View>
              <View className='text-secondary text-normal at-row at-row__justify--center'>已有20人帮砍<AtIcon value='chevron-right' size='15' color='rgba(136, 136, 136, 1)'></AtIcon></View>
            </View>
          </View>
          {/* 右 */}
          <View className='at-col at-col-5'>
            <View className='text-orange text-huge text-center  text-bold'>砍价成功</View>
            <View className='at-row at-row__align--center at-row__justify--center text-center'>
              <Text className='text-normal'>已砍： </Text>
              <Text className='text-orange text-huge'>￥800</Text>
            </View>
          </View>

        </View>

      </Board>
    );
  }
}
