import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';

import Board from '@components/board'
import BaseComponent from '@components/base'


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
          <View className='at-col at-col-2'>
            <View className='at-row at-'>
              <Image src={url} className='bargaining-image'></Image>
            </View>
          </View>
          {/* 中 */}
          <View className='at-col at-col-4'>
            <View>

            </View>
          </View>
          {/* 右 */}
          <View className='at-col at-col-8'></View>

        </View>

      </Board>
    );
  }
}
