// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as distActions from '@actions/dist'
import * as userActions from '@actions/user'
import * as cityActions from '@actions/city'
import * as apartmentActions from '@actions/apartment'
import * as searchApartmentActions from '@actions/searchApartment'

// 自定义组件
import Select from '@components/select'
import Search from '@components/search'
import ApartmentList from '@components/apartment-list'
import BaseComponent from '@components/base'

// 自定义变量
import {
  LOCALE_HOT_SEARCH,
  LOCALE_HISTORY_SEARCH,
  LOCALE_RECOMMEND_SEARCH,
} from '@constants/locale'

import {
  PAYLOAD_SEARCH_APARTMENT
} from '@constants/api'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...cityActions,
  ...userActions,
  ...distActions,
  ...apartmentActions,
  ...searchApartmentActions,
})
class CommonSearch extends BaseComponent {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    // 显示预加载页面
    showPreview: true,
    defaultPayload: {},

    // 城市相关
    city: 0,

    // 搜索记录
    hotList: [],
    historyList: [],
    cityCode: 0,
  }

  refSelect = (node) => this.select = node
  refSearch = (node) => this.search = node
  refSearchApartmentList = (node) => this.searchApartmentList = node
  refRecommendApartmentList = (node) => this.recommendApartmentList = node

  componentWillMount() {
    buryPoint()
    // 获取用户数据 和 刷新页面数据
    const { payload: user } = this.props.dispatchUser()
    this.onReset(user.citycode)
    this.setState({ cityCode: user.citycode })
  }

  /**
   * 刷新数据
   * @param {*} param
   */
  onReset(city) {
    // 获取字典
    this.props.dispatchDistList(city)

    // 热门搜索，因为这个就这里用到了就没写到 reducer
    this.props.dispatchHotSearch()
      .then(({ data: { data } }) =>
        this.setState({ hotList: data.hot_list, historyList: data.history_list }))

    // 重置看了又看
    this.recommendApartmentList && this.recommendApartmentList.onReset(null)

    // 初始化数据
    this.setState({
      city,
      showPreview: true,
      defaultPayload: { ...PAYLOAD_SEARCH_APARTMENT, city }
    })
  }

  /**
   * 取消搜索
   */
  onInputCancel() {
    this.onReset(this.state.city)
    this.select.onPayloadReset()
  }

  /**
   * 设置输入框的值
   */
  onSetInputHot(value, url) {
    url && Taro.navigateTo({ url })
    this.search.setState({ value })
    this.onApartmentPayloadChange({ payload: { search_key: value } })
  }

  onSetInputHistory(value) {
    this.search.setState({ value })
    this.onApartmentPayloadChange({ payload: { search_key: value } })
  }


  /**
   * 当选择栏变化时更新公寓数据
   */
  onApartmentPayloadChange({ payload }) {
    let { defaultPayload } = this.state
    defaultPayload = { ...defaultPayload, ...payload }

    this.setState({ showPreview: false, defaultPayload })
    this.searchApartmentList.onReset(defaultPayload)
  }

  /**
   * 到底部加载公寓下一页
   */
  onReachBottom() {
    const { showPreview } = this.state
    !showPreview && this.searchApartmentList.onNextPage()
  }

  /**
   * 添加心愿单
   */
  onCreateFavorite({ payload }) {
    this.props.dispatchFavoriteCreate(payload)
  }

  /**
   * 删除心愿单
   */
  onDeleteFavorite({ payload }) {
    this.props.dispatchFavoriteDelete(payload)
  }

  render() {
    const {
      showPreview,

      city,
      hotList,
      historyList,
      defaultPayload,
      cityCode
    } = this.state

    const {
      dists,
      apartmentlook,
      apartmentsearch,
    } = this.props

    return <View className='page-white'>
      <View className='py-2 mx-2'>
        {/* 搜索框 & 城市选择器 */}
        <Search
          isInput
          isFixed={false}
          showPicker={false}
          ref={this.refSearch}
          showCancel={!showPreview}

          onInputCancel={this.onInputCancel}
          onInputConfirm={this.onApartmentPayloadChange}
        />

        {/* 热门搜索 */}
        {showPreview && hotList.length > 0 &&
          <View className='py-2 pl-3'>
            <View>{LOCALE_HOT_SEARCH}</View>
            <View className='at-row  at-row--wrap text-normal text-secondary '>
              {hotList.map(i =>
                <View
                  key={i.id}
                  className={`mr-3 my-2 ${i.url ? 'tag tag--yellow--1' : 'tag tag--grey--2'}`}
                  style={{ borderRadius: Taro.pxTransform(13 * 2) }}
                  onClick={this.onSetInputHot.bind(this, i.text, i.url)}
                >{i.text}</View>
              )}
            </View>
          </View>
        }

        {/* 历史搜索 */}
        {showPreview && historyList.length > 0 &&
          <View className='py-2 pl-3'>
            <View>{LOCALE_HISTORY_SEARCH}</View>
            <View className='at-row at-row--wrap text-normal text-secondary '>
              {historyList.map(i =>
                <View
                  key={i.id}
                  className='mr-3 my-2 tag tag--grey--2'
                  onClick={this.onSetInputHistory.bind(this, i.text)}
                  style={{ borderRadius: Taro.pxTransform(13 * 2) }}
                >{i.text}</View>
              )}
            </View>
          </View>
        }

        {/* 看了又看 */}
        {showPreview && <View className='mt-3 mb-2'>{LOCALE_RECOMMEND_SEARCH}</View>}
        <ApartmentList
          mini
          show={showPreview === true}
          key={apartmentlook.type}
          type={apartmentlook.type}
          items={apartmentlook.list}
          ref={this.refRecommendApartmentList}

          defaultPayload={{ city }}
          dispatchList={this.props.dispatchRecommendHouseType}
        />


        {/* 筛选器 */}
        <Select
          show={showPreview === false}
          top={0}
          isFixed={false}
          autoSortDist={[]}
          // 暂时复用商圈搜索框的信息
          cbdSelect

          cityCode={cityCode}
          cbdDist={dists.cbd_list}
          priceDist={dists.price_list}
          houseTypeDist={dists.housetype_list}
          specialSelectDist={dists.special_select}
          ref={this.refSelect}
          onApartmentPayloadChange={this.onApartmentPayloadChange}
        />

        <ApartmentList
          show={showPreview === false}
          initReset={false}
          key={apartmentsearch.type}
          type={apartmentsearch.type}
          items={apartmentsearch.list}
          ref={this.refSearchApartmentList}

          defaultPayload={defaultPayload}
          onCreateFavorite={this.onCreateFavorite}
          onDeleteFavorite={this.onDeleteFavorite}
          dispatchList={this.props.dispatchSearchApartmentList}
          dispatchNextPageList={this.props.dispatchNextPageSearchApartmentList}
        />

      </View>
    </View>
  }
}

export default CommonSearch
