import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import { AtIcon, AtDivider } from 'taro-ui'

import {
  LOCALE_HAVE_BEEN,
  LOCALE_PEOPLE_HELP_BARGAIN,
  LOCALE_BARGAIN_CURRENT_PRICE,
  LOCALE_BARGAIN_HAVE_CUT2,
  LOCALE_COLON,
  LOCALE_MONEY
} from '@constants/locale'

import Board from '@components/board'
import BaseComponent from '@components/base'


export default class BargainDetailBargainingBlock extends BaseComponent {
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
    const { user_bargain, need_people_num } = this.props
    const { headimg, help_bargain_list, help_bargain_price, price, status, username } = user_bargain

    const borderRight = {
      borderRight: '1px solid #F8F8F8'
    }

    return (
      <Board className='mt-2 ml-3 mr-3'>
        {/* 板块内边距 */}
        <View className='at-row px-2 pt-2' style={{ width: 'auto' }}>
          {/* 左 */}
          <View className='at-col at-col-2'>
            <View className='at-row at-row__align--center at-row__justify--center inherit-Height'>
              <Image lazyLoad src={headimg} className='bargain-bargaining-image'></Image>
            </View>
          </View>
          {/* 中 */}
          <View className='at-col at-col-4 position-relative ml-1' style={borderRight}>
            <View className='vertical-level-center inherit-Width'>
              <View className='text-large text-bold overtext '>{username}</View>
              <View
                className='text-secondary text-normal mt-1'
                onClick={this.props.onOpenHelpFriendsMask}
              >{LOCALE_HAVE_BEEN + help_bargain_list.length + LOCALE_PEOPLE_HELP_BARGAIN}<AtIcon value='chevron-right' size='15' color='rgba(136, 136, 136, 1)'></AtIcon></View>
            </View>
          </View>
          {/* 右 */}
          <View className='at-col at-col-5 ml-3'>
            {status === 0 && <View className='at-row at-row__align--center '>
              <Text className='text-small'>{LOCALE_BARGAIN_CURRENT_PRICE + LOCALE_COLON} </Text>
              <Text className='text-orange text-huge'>{LOCALE_MONEY + price}</Text>
            </View>}
            {status === 1 && <View className='text-orange text-huge text-center  text-bold'>砍价成功！</View>}

            <View className='at-row at-row__align--center '>
              <Text className='text-small'>{LOCALE_BARGAIN_HAVE_CUT2 + LOCALE_COLON} </Text>
              <Text className='text-orange text-huge'>{LOCALE_MONEY + help_bargain_price}</Text>
            </View>
          </View>

        </View>
        {/* 还差多少人帮砍 */}
        {need_people_num && <View>
          <AtDivider height='5' lineColor='#F8F8F8' />
          <View className='text-orange text-small text-center py-1'>离成功还差{need_people_num}个人帮砍</View>
        </View>}
      </Board>
    );
  }
}
