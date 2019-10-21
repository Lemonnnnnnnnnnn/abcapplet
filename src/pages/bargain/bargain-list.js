import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

// 自定义组件
import Board from '@components/board'
import ApartmentBargainList from '@components/apartment-bargain-list'

import '../../styles/_apartment.scss'

export default class BargainList extends Component {

  config = {
    navigationBarTitleText: '租房砍价',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FC8F4B',
  }


  render() {
    return (
      <View className='bargain p-3'>
        {/* banner */}
        <Board>
          <View style={{ height: Taro.pxTransform(100) }}></View>
        </Board>
        {/* 列表 */}
        <View className='text-huge mt-1 mb-1 text-white'>砍价列表</View>
        <ApartmentBargainList />
      </View>
    );
  }
}
