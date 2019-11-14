import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainAction from '@actions/bargain'

// 自定义组件
import Board from '@components/board'
import ApartmentBargainList from '@components/apartment-bargain-list'

import '../../../styles/_bargain.scss'

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
        {/* ad */}
        {/* <Board>
          <View style={{ height: Taro.pxTransform(100) }}></View>
        </Board> */}
        {/* 列表 */}
        <View className='text-huge my-2 text-white'>砍价列表</View>
        <ApartmentBargainList
          ref={this.refBargainList}
          bargainList={list}
          defaultPayload={payload}

          dispatchList={this.props.dispatchBargainList}
          dispatchNextPageList={this.props.dispatchNextPageBargainList}
        />
      </View>
    );
  }
}
