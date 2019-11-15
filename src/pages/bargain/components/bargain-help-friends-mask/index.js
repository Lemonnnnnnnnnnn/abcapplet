import Taro, { Component } from '@tarojs/taro';
import { AtIcon, AtButton } from 'taro-ui'
import { View, ScrollView } from '@tarojs/components';

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_BARGAIN_HELP_FRIENDS_DEFAULT_TEXT, LOCALE_BARGAIN_HELP_FRIENDS, LOCALE_BARGAIN_SHARE } from '@constants/locale'

import BargainFriendItem from '../bargain-friend-item'

export default class BargainHelpFriendsMask extends BaseComponent {
  static defaultProps = {
    show: false,
    user_bargain: { help_bargain_list: [] }
  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    const { show, user_bargain: { help_bargain_list } } = this.props
    return (show &&
      <View onTouchMove={this.onMaskTouchMove}>
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

            <View className='text-bold text-center text-large mt-3'>{LOCALE_BARGAIN_HELP_FRIENDS}</View>

            <ScrollView style={{ height: Taro.pxTransform(750) }} scrollY >
              {
                help_bargain_list.length ? help_bargain_list.map(i =>
                  <BargainFriendItem
                    block='helpFriends'
                    headimg={i.headimg}
                    price={i.price}
                    username={i.username}
                    key={i}
                  />)
                  : <View className='text-large text-secondary text-center py-4' >{LOCALE_BARGAIN_HELP_FRIENDS_DEFAULT_TEXT}</View>
              }
            </ScrollView>

          </View>
          {/* 分享按钮 */}
          <AtButton
            circle
            className='btn-bargain mb-2'
            open-type='share'
          >{LOCALE_BARGAIN_SHARE}</AtButton>

        </Board>
        <Masks customStyle={{ zIndex: 11 }} show />
      </View>
    );
  }
}
