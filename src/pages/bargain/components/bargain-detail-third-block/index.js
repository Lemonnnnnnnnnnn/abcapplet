import Taro, { Component } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui'

// 自定义变量
import { PAGE_BARGAIN_LIST } from '@constants/page'

// 自定义组件
import Board from '@components/board'
import BaseComponent from '@components/base'


export default class BargainDetailThirdBlock extends BaseComponent {

  static defaultProps = {
    bargainDetail: { content: '' }
  }

  onNavigation() {
    Taro.navigateTo({ url: PAGE_BARGAIN_LIST })
  }

  render() {

    return (
      // 外边距
      <Board className='mt-2 mx-3'>
        {/* 内边距 */}
        <View
          onClick={this.onNavigation}
          className='py-2 px-3 text-orange at-row at-row__justify--between at-row__align--center'
          style={{ width: 'auto' }}
        >
          <Text className='text-large text-bold'>进入砍价列表</Text>
          <View className='text-normal'>更多好房等你砍 <AtIcon value='chevron-right' color='#ff6b29' size={18} /></View>
        </View>
      </Board>
    );
  }
}
