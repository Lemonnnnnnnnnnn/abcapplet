import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件

import Placeholder from '@components/placeholder'
import SubletItem from '@components/sublet-item'


// 常量
import { LOCALE_NO_DATA } from '@constants/locale'
import BaseListSublet from '@components/base-list-sublet'

class SubletList extends BaseListSublet {
  state = {
    page: 1,
    loading: false,
    hasMore: true,
    payload: {},
    selected: [],
  }
  openMiniProgram(value){
    Taro.navigateToMiniProgram({
      appId: 'wx798afaa9c187b6ae', // 要跳转的小程序的appid
      path:' pages/home/index', // 跳转的目标页面
      extarData: {
        id:parseInt(value.id)
      },
      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res){
        console.log(res)
      }

})
  }
  render() {
    const { hasMore, loading, page } = this.state
    const { mini, items } = this.props


    return (
      <View className>

        {/* 渲染 行程列表 */}
        <View className='at-col at-col__justify--center' >
          {page != 1 && items.map(i =>
            <SubletItem key={i.id}
              item={i}
              onNavicatSublet={this.openMiniProgram}
             />
          )}
        </View>

        {/* 记载效果 */}
        <Placeholder
          className='mt-1'
          show={loading && !mini}
          quantity={5}
        />

        {/* 无数据 */}
        {items.length === 0
          && hasMore === false
          && loading === false
          && <View class='page-demo'>{LOCALE_NO_DATA}</View>}
      </View>)
  }
}

export default SubletList

