// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as distActions from '@actions/dist'
import * as userActions from '@actions/user'
import * as cityActions from '@actions/city'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Select from '@components/select'
import Search from '@components/search'
import ApartmentList from '@components/apartment-list'

// 自定义变量
import {
  LOCALE_HOT_SEARCH,
  LOCALE_HISTORY_SEARCH,
  LOCALE_RECOMMEND_SEARCH,
} from '@constants/locale'

import {
  PAYLOAD_SEARCH_APARTMENT
} from '@constants/api'

@connect(state => state, {
  ...cityActions,
  ...userActions,
  ...distActions,
  ...apartmentActions,
})
class CommonSearch extends Component {
  config = {
    navigationBarTitleText: '公寓ABC',
  }

  state = {
    // 显示预加载页面
    showPreview: true,
    defaultPayload: {},

    // 城市相关
    city: 0,
    selector: ['厦门'],
    selectorChecked: '厦门',

    // 搜索记录
    hotList: [],
    historyList: [],
  }

  refSelect = (node) => this.select = node
  refSearch = (node) => this.search = node
  refSearchApartmentList = (node) => this.searchApartmentList = node
  refRecommendApartmentList = (node) => this.recommendApartmentList = node

  componentWillMount() {
    // 获取用户数据 和 刷新页面数据
    const { payload: user } = this.props.dispatchUser()
    this.onReset(user.citycode)
  }

  /**
   * 刷新数据
   * @param {*} param
   */
  onReset(city) {
    // 获取字典
    this.props.dispatchDistList(city)

    // 拉取城市列表
    this.props.dispatchCityList().then((res) => {
      const citys = res.data.data.list
      // 设置城市选择器
      const selector = citys.map(i => i.title)
      const selectorCity = citys.filter(i => i.id === city)[0]
      const selectorChecked = selectorCity ? selectorCity.title : '厦门市'

      this.setState({ selector, selectorChecked })
    })

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
   * 城市相关选择器数据
   * @param {*} param
   */
  onChangeSelector({ currentTarget: { value } }) {
    const { citys } = this.props
    const { selector } = this.state

    const selectorChecked = selector[value]
    const newCity = citys.filter(i => i.title === selectorChecked)[0]

    this.setState({ selectorChecked })
    this.onReset(newCity.id)
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
  onSetInput(value) {
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

  render() {
    const {
      selector,
      showPreview,
      selectorChecked,

      city,
      hotList,
      historyList,
      defaultPayload,
    } = this.state

    const {
      dists,
      apartments,
    } = this.props

    return <View className='page-white'>
      <View className='py-2 mx-2'>
        {/* 搜索框 & 城市选择器 */}
        <Search
          isInput
          ref={this.refSearch}
          isFixed={false}
          selector={selector}
          selectorChecked={selectorChecked}

          onInputCancel={this.onInputCancel}
          onChangeSelector={this.onChangeSelector}
          onInputConfirm={this.onApartmentPayloadChange}
        />

        {/* 热门搜索 */}
        {showPreview && hotList.length > 0 &&
          <View className='py-2 pl-3'>
            <View>{LOCALE_HOT_SEARCH}</View>
            <View className='at-row text-normal text-secondary mt-2'>
              {hotList.map(i =>
                <View
                  key={i.id}
                  className='mr-2'
                  onClick={this.onSetInput.bind(this, i.text)}
                >{i.text}</View>
              )}
            </View>
          </View>
        }

        {/* 历史搜索 */}
        {showPreview && historyList.length > 0 &&
          <View className='py-2 pl-3'>
            <View>{LOCALE_HISTORY_SEARCH}</View>
            <View className='at-row text-normal text-secondary mt-2'>
              {historyList.map(i =>
                <View
                  key={i.id}
                  className='mr-2'
                  onClick={this.onSetInput.bind(this, i.text)}
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
          key={apartments.type}
          type={apartments.type}
          items={apartments.list}
          ref={this.refRecommendApartmentList}

          defaultPayload={{ city }}
          dispatchList={this.props.dispatchRecommendApartment}
        />


        {/* 赛选器 */}
        <Select
          show={showPreview === false}
          top={0}
          isFixed={false}
          autoSortDist={[]}
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
          key={apartments.type}
          type={apartments.type}
          items={apartments.list}
          ref={this.refSearchApartmentList}

          defaultPayload={defaultPayload}
          dispatchList={this.props.dispatchSearchApartmentList}
          dispatchNextPageList={this.props.dispatchNextPageSearchApartmentList}
        />

      </View>
    </View>
  }
}

export default CommonSearch
