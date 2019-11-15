import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

// 自定义常量
import { LOCALE_BARGAIN_LEADERBOARD_TOP_TEN, LOCALE_BARGAIN_HAVENT } from '@constants/locale'
// 自定义组件
import BaseComponent from '@components/base'
import BargainFriendItem from '../bargain-friend-item'

export default class BargainLeaderboard extends BaseComponent {

  static defaultProps = {
    bargainDetail: {
      price_list: []
    }
  }

  render() {
    const { bargainDetail: { price_list } } = this.props
    return (
      <View className='p-2 text-center'>
        {price_list.length ?
          <View>
            <Text className='text-huge text-bold  py-2'>{LOCALE_BARGAIN_LEADERBOARD_TOP_TEN}</Text>
            {price_list.map((i, key) =>
              <BargainFriendItem
                block='leaderboard'
                key={i}
                num={key + 1}
                headimg={i.headimg}
                price={i.price}
                username={i.username}
              />)}
          </View>
          : <View className='text-center text-huge page-middile'>{LOCALE_BARGAIN_HAVENT}</View>
        }

      </View>
    );
  }
}
