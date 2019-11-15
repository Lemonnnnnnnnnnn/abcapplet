import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button, Image } from '@tarojs/components';
import BaseComponent from '@components/base'
// 自定义常量
import { LOCALE_DOT, LOCALE_MONEY, LOCALE_BARGAIN_HAVE } from '@constants/locale'

export default class BargainFriendItem extends BaseComponent {
  config = {
    navigationBarTitleText: ''
  }

  static defaultProps = {
    headimg: '',
    price: '',
    username: ''
  }

  render() {
    const { headimg, price, username, num, block } = this.props
    // 砍价榜
    const bargainLeaderboard = <View className='at-row at-row__align--center at-row__justify--between '>
      <View className='at-row at-row__align--center'>
        {/* 排名 */}
        <Text className='text-secondary text-huge'>{num + LOCALE_DOT}</Text>
        {/* 头像 */}
        <View className='at-col at-col-4'>
          <Image src={headimg} className='bargain-friend-icon' />
        </View>
        {/* 昵称 */}
        <View className='text-small at-row at-row__justify--center'>{username}</View>
      </View>
      <View className='at-row at-row__align--end at-row__justify--end'>
        <Text className='text-mini text-secondary mb-1 mr-1'>{LOCALE_BARGAIN_HAVE}</Text>
        <Text className='text-huge text-orange'>{LOCALE_MONEY + price}</Text>
      </View>
    </View>

    // 帮砍好友
    const bargainHelpFriends = <View className='at-row at-row__align--center at-row__justify--between '>
      <View className='at-row at-row__align--center'>
        <Image src={headimg} className='bargain-friend-icon' />
        <Text className='text-normal ml-3'>{username}</Text>
      </View>
      <View className='at-row at-row__align--end at-row__justify--end'>
        <Text className='text-mini text-secondary mb-1 mr-1'>已砍</Text>
        <Text className='text-huge text-orange'>{LOCALE_MONEY + price}</Text>
      </View>
    </View>
    return (
      <View className='bargain-friend p-2'>
        {block === 'leaderboard' && bargainLeaderboard}
        {block === 'helpFriends' && bargainHelpFriends}
      </View>
    );
  }
}
