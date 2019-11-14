import Taro, { Component } from '@tarojs/taro';
import { AtIcon, AtButton } from 'taro-ui'
import { View, Text, Button } from '@tarojs/components';

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import BaseComponent from '@components/base'

import BargainTab from '../bargain-tab'
import BargainFriendItem from '../bargain-friend-item'

export default class BargainHelpFriendsMask extends BaseComponent {
  static defaultProps = {
    show: false,
    user_bargain: { help_bargain_list: [] }
  }

  render() {
    const { show, user_bargain: { help_bargain_list } } = this.props
    return (show &&
      <View >
        <Board fixed='bottom' border='top' customStyle={{ zIndex: 12, width: 'auto' }} className='p-2'>
          <View className='mb-3'>

            <AtIcon
              onClick={this.props.onClose}
              value='close'
              size='22'
              className='p-2 '
              color='#888'
              style='position : absolute ; right : 5px ; top : 5px'
            />

            <View className='text-bold text-center text-large mt-3'>帮砍好友</View>

            {
              help_bargain_list.length ? help_bargain_list.map(i =>
                <BargainFriendItem
                  block='helpFriends'
                  headimg={i.headimg}
                  price={i.price}
                  username={i.username}
                  key={i}
                />)
                : <View className='text-large text-secondary text-center py-4' >快去找好友帮忙砍价吧！</View>
            }

          </View>
          {/* 分享按钮 */}
          <AtButton
            circle
            className='btn-bargain mb-2'
            open-type='share'
          >分享</AtButton>

        </Board>
        <Masks customStyle={{ zIndex: 11 }} show />
      </View>
    );
  }
}
