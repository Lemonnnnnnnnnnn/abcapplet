import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';

// redux相关
import { connect } from '@tarojs/redux'
import * as bargainAction from '@actions/bargain'

// 自定义常量
import { LOCALE_BARGAIN_LIST } from '@constants/locale'
import { PAYLOAD_BARGAIN_LIST } from '@constants/api'
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

  componentWillMount() {
    const { id } = this.$router.params
    const bargain_id = id.split(',')
    this.setState({ bargain_id })
  }

  refBargainList = node => this.BargainList = node

  onReachBottom() {
    this.BargainList.onNextPage()
  }

  render() {
    const { bargain_id } = this.state
    const { bargain: { list } } = this.props
    return (
      <View className='bargain-list p-3'>
        {/* 列表 */}
        <View className='text-huge my-2 text-white'>{LOCALE_BARGAIN_LIST}</View>
        <ApartmentBargainList
          ref={this.refBargainList}
          block='bargainList'
          bargainList={list}
          defaultPayload={{ ...PAYLOAD_BARGAIN_LIST, bargain_id }}

          dispatchList={this.props.dispatchBargainList}
          dispatchNextPageList={this.props.dispatchNextPageBargainList}
        />
      </View>
    );
  }
}
