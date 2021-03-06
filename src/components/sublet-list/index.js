import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件

import Placeholder from '@components/placeholder'
import SubletItem from '@components/sublet-item'

// 常量
import { LOCALE_NO_DATA } from '@constants/locale'
import BaseListSublet from '@components/base-list-sublet'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as subletActions from '@actions/subleat'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'

@connect(state => state, {
  ...subletActions,
  ...cityActions,
  ...userActions,
})

class SubletList extends BaseListSublet {
  state = {
    page: 1,
    loading: false,
    hasMore: true,
    payload: {},
    selected: [],
  }
  openMiniProgram(value) {
    Taro.navigateToMiniProgram({
      appId: 'wx798afaa9c187b6ae', // 要跳转的小程序的appid
      path: `pages/sublet/index?id=${value.id}&share_user_id = 0`, // 跳转的目标页面

      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }

    })
  }
  render() {
    const { hasMore, loading, page } = this.state
    const { mini, sublet, home, showPlaceholder } = this.props

    return (
      <View className>

        {/* 渲染 行程列表 */}
        <View className='' >
          {page != 1 && sublet.list.map(i =>
            <SubletItem key={i.id}
              item={i}
              onNavicatSublet={this.openMiniProgram}
            />
          )}
        </View>

        {/* 记载效果 */}
        <Placeholder
          className='mt-1'
          show={loading || !showPlaceholder}
          quantity={5}
        />

        {/* 无数据 */}
        {sublet.list.length === 0
          && (!loading && showPlaceholder)
          && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
      </View>)
  }
}

export default SubletList

