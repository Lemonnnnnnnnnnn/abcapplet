import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui'

import Board from '@components/board'
import BaseComponent from '@components/base'


export default class BargainDetailSecBlock extends BaseComponent {

  config = {
    navigationBarTitleText: ''
  }

  state = {
    message: {
      url: 'https://images.gongyuabc.com/7aadedd1090e6d68fcb20f6be03794f9',
      price: 1800,
      dis_price: 1080,
      AtAvatar: [
        { url: 'https://images.gongyuabc.com/129f33dc807acb30eb2f5ddd7cf88d10' },
        { url: 'https://images.gongyuabc.com/129f33dc807acb30eb2f5ddd7cf88d10' },
        { url: 'https://images.gongyuabc.com/129f33dc807acb30eb2f5ddd7cf88d10' },
        { url: 'https://images.gongyuabc.com/129f33dc807acb30eb2f5ddd7cf88d10' },
        { url: 'https://images.gongyuabc.com/129f33dc807acb30eb2f5ddd7cf88d10' },
      ]
    },
  }

  render() {
    const { message } = this.state
    const { url, price, dis_price, AtAvatar } = message
    return (
      <Board className=' ml-3 mr-3'>
        {/* 用padding让板块具有一定内边距 */}
        <View className='p-2'>
          {/* 我所认为的板块内第一个板块  图片加公寓信息左右排列*/}
          <View className='at-row'>
            <Image src={url} className='bargain-image bargain-main-block-image'></Image>

            <View className='ml-3'>
              <View className='pt-2 text-large text-bold at-row at-row__align--center at-row__justify--between'>
                <Text>安居公寓·县后店</Text>
                <AtIcon value='chevron-right' size='17' color='rgba(53, 53, 53, 1)' />
              </View>
              <View className='text-normal pt-2'>
                <Text className='text-secondary'>砍价房间:</Text>
                <Text className='text-gray--2 ml-2'>两室一厅</Text>
                <Text className='ml-2'>A380</Text>
              </View>
            </View>
          </View>

          {/* 第二板块 价格*/}
          <View className='at-row text-center'>
            <View className='at-col bargain-main-block-price mr-3'>
              <View className='text-normal'>原价：</View>
              <View className='text-line-through text-secondary'>￥1880/月</View>
            </View>
            <View className='at-col bargain-main-block-price'>
              <View className='text-normal'>砍价后:</View>
              <View className='text-orange text-bold'>￥1080/月</View>
            </View>
          </View>

          {/* 第三板块 吸引词 */}
          <View className='text-normal mt-2 text-orange text-center gray-border'>立省￥4800（租期6个月）</View>

          {/* 第四板块 活动剩余时间 */}
          <View className='text-normal text-center pt-3'>活动剩余时间</View>
          <View className='text-center pt-3'>3天20时20分20秒</View>
          <View className='at-row at-row__justify--center pt-3'>
            {
              AtAvatar.map(i => <Image className='mr-1 bargain-main-block-header' key={i} src={i.url} />)
            }
          </View>
          <View className='pt-3 text-normal text-center text-secondary'>————共300人参与————</View>


        </View>

      </Board>
    );
  }
}
