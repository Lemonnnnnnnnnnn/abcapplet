import Taro, { Component } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'

import Decorate from '@components/decorate'
import ApartmentBargainList from '@components/apartment-bargain-list'

@connect(state => state, {
  ...userActions
})
export default class UserActivity extends Component {
  config = {
    navigationBarTitleText: '我的活动',
    enablePullDownRefresh: true,
    navigationBarBackgroundColor: '#FFC919',
  }

  state = {}

  refBargainList = node => this.bargainList = node

  onReachBottom() {
    this.bargainList.onNextPage()
  }

  onPullDownRefresh() {
    this.bargainList.onReset(null)
    Taro.stopPullDownRefresh()
  }


  render() {
    const payload = { current_page: 1, page_size: 10 }
    const { userActivityList: { list } } = this.props
    return (
      <View className='p-3'>
        <Decorate height='200' />

        <ApartmentBargainList
          block='userActivity'
          ref={this.refBargainList}
          bargainList={list}
          defaultPayload={payload}

          dispatchList={this.props.dispatchUserActivity}
          dispatchNextPageList={this.props.dispatchNextPageUserActivity}
        />

        {list && !list.length && <View style={{ minHeight: '80vh' }} className=' text-large page-middile'>您当前尚未参加活动</View>}

      </View>
    );
  }
}
