import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui'

import Board from '@components/board'
import BaseComponent from '@components/base'



export default class BargainingBlock extends BaseComponent {
  static defaultProps = {
    user_bargain: {
      headimg: '',
      help_bargain_list: '',
      help_bargain_price: '',
      price: '',
      status: 0,
      username: ''
    }
  }

  render() {
    const { user_bargain } = this.props
    const { headimg, help_bargain_list, help_bargain_price, price, status, username } = user_bargain

    return (
      <Board className='mt-2 ml-3 mr-3'>
        {/* 板块内边距 */}
        <View className='at-row'>
          {/* 左 */}
          <View className='at-col at-col-3'>
            <View className='at-row at-row__align--center at-row__justify--center inherit-Height'>
              <Image src={headimg} className='bargain-bargaining-image'></Image>
            </View>
          </View>
          {/* 中 */}
          <View className='at-col at-col-4 position-relative'>
            <View className='vertical-level-center inherit-Width'>
              <View className='text-large text-bold overtext '>{username}</View>
              <View
                className='text-secondary text-normal '
                onClick={this.props.onOpenHelpFriendsMask}
              >已有{help_bargain_list.length}人帮砍<AtIcon value='chevron-right' size='15' color='rgba(136, 136, 136, 1)'></AtIcon></View>
            </View>
          </View>
          {/* 右 */}
          <View className='at-col at-col-5'>
            {/* <View className='text-orange text-huge text-center  text-bold'>{statusText}</View> */}
            {status === 0 && <View className='at-row at-row__align--center at-row__justify--center text-center'>
              <Text className='text-small'>现价： </Text>
              <Text className='text-orange text-huge'>￥{parseInt(price)}</Text>
            </View>}
            {status === 1 && <View className='text-orange text-huge text-center  text-bold'>砍价成功！</View>}

            <View className='at-row at-row__align--center at-row__justify--center text-center'>
              <Text className='text-small'>已砍： </Text>
              <Text className='text-orange text-huge'>￥{parseInt(help_bargain_price)}</Text>
            </View>
          </View>

        </View>

      </Board>
    );
  }
}
