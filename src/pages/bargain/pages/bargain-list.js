import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainAction from '@actions/bargain'

// 自定义变量
import { LOCALE_BARGAIN_LIST } from '@constants/locale'
// 自定义组件
import ApartmentBargainList from '@components/apartment-bargain-list'

@connect(state => state, {
  ...bargainAction,
})
export default class BargainList extends Component {

  config = {
    navigationBarTitleText: '租房砍价',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FC8F4B',
  }

  refBargainList = node => this.BargainList = node

  onReachBottom() {
    this.BargainList.onNextPage()
  }

  render() {
    const payload = { current_page: 1, page_size: 10 }
    const { bargain: { list } } = this.props
    return (
      <View className='bargain-list p-3'>
        {/* 列表 */}
        <View className='text-huge my-2 text-white'>{LOCALE_BARGAIN_LIST}</View>
        <ApartmentBargainList
          ref={this.refBargainList}
          block='bargainList'
          bargainList={list}
          defaultPayload={payload}

          dispatchList={this.props.dispatchBargainList}
          dispatchNextPageList={this.props.dispatchNextPageBargainList}
        />
      </View>
    );
  }
}
