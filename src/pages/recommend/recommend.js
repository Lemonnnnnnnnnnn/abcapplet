import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import { PAYLOAD_SUB_LIST } from '@constants/api'
import ABCIcon from '@components/abc-icon'

import Search from '@components/search'
import SubletList from '@components/sublet-list'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as subletActions from '@actions/subleat'
import * as cityActions from '@actions/city'
import * as userActions from '@actions/user'

import buryPoint from '../../utils/bury-point'

@connect(state => state, {
  ...subletActions,
  ...cityActions,
  ...userActions,
})

class ApartmentRecommend extends Component {
  config = {
    navigationBarTitleText: '转租列表',
    backgroundColor: '#eeeeee',
    backgroundTextStyle: 'light',
    enablePullDownRefresh: true,
  }

  refSubletList = (node) => this.SubletList = node

  state = {
    selector: ['厦门市'],
    selectorChecked: '厦门市',
    citys: [],
    isInput: 1,
    payload: PAYLOAD_SUB_LIST,
    count: false,
    inputValue: '',
    showCancel: false,
    selectorCheckedId: 0,
  }

  async  onPullDownRefresh() {
    await await this.SubletList.onReset(null)
    this.setState({
      inputValue: '',
      showCancel: false,

    })
    Taro.stopPullDownRefresh()
  }
  /**
 * 到底部加载公寓下一页
 */
  onReachBottom() {
    this.SubletList.onNextPage()
  }

  componentDidHide() {
    this.setState({
      inputValue: '',
      showCancel: false,
    })
  }
  //前往转租创建页面
  openMiniProgramCreate() {
    Taro.navigateToMiniProgram({
      appId: 'wx798afaa9c187b6ae', // 要跳转的小程序的appid
      path: ' pages/postsublet/index', // 跳转的目标页面

      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }

    })
  }
  async componentWillMount() {
    buryPoint()
    // 获取用户数据 和 刷新页面数据
    const { payload: user } = await this.props.dispatchUser()


    this.props.dispatchCityList().then((res) => {
      const citys = res.data.data.list

      // 设置城市选择器
      const selector = citys.map(i => i.title)
      const selectorCity = citys.filter(i => i.id === user.citycode)[0]
      const selectorChecked = selectorCity ? selectorCity.title : '厦门市'
      const selectorCheckedId = res.data.data.list[0].id

      this.setState({ selector, selectorChecked, citys, selectorCheckedId })
    })

    const { count } = this.state
    count && this.SubletList.onReset(null)
    this.setState({
      count: true
    })
  }

  //下拉选择
  async onChangeSelector({ currentTarget: { value } }) {
    const { selector, citys, payload } = this.state
    this.setState({
      selectorChecked: selector[value],
      selectorCheckedId: citys[value].id,
      inputValue: '',
      showCancel: false,
    })
    await this.SubletList.onReset({ ...payload, city_id: citys[value].id })
    await this.props.dispatchSubList({ ...payload, city_id: citys[value].id })

  }
  //用户输入
  onInputValue({ currentTarget: { value } }) {
    this.setState({ inputValue: value })
  }
  //搜索
  async onInputConfirm() {
    const { inputValue, payload, selectorCheckedId } = this.state
    this.setState({ showCancel: true })
    await this.SubletList.onReset({ ...payload, keyword: inputValue, city_id: selectorCheckedId })
    await this.props.dispatchSubList({ ...payload, keyword: inputValue, city_id: selectorCheckedId })

  }
  onInputCancel() {
    const { payload, selectorCheckedId } = this.state
    this.SubletList.onReset({ ...payload, city_id: selectorCheckedId })
    this.setState({ showCancel: false, inputValue: '' })
  }

  render() {
    const { selector, selectorChecked, isInput, payload, showCancel, inputValue, count } = this.state
    const { sublet } = this.props

    return (
      <View style={{ background: '#FFFFFF', minHeight: '100vh', display: 'block', overflowY: 'auto' }}>
        <View className='home-search pl-3 pr-3 pt-2'>
          {
            <Search
              className='mb-2'
              selector={selector}
              selectorChecked={selectorChecked}
              isInputSub={isInput}
              showCancel={showCancel}
              inputValue={inputValue}
              onInputValue={this.onInputValue}
              onChangeSelector={this.onChangeSelector}
              onInputCancel={this.onInputCancel}
              onInputConfirm={this.onInputConfirm}
            />
          }
        </View>


        <SubletList
          items={sublet.list}
          ref={this.refSubletList}
          defaultPayload={payload}
          dispatchList={this.props.dispatchSubList}
          dispatchNextPageList={this.props.dispatchNextPageSubList}
        />

        <View className='page-middile at-row sublet-back ' onClick={this.openMiniProgramCreate}>
          <View className='sublet-button page-middile'>
            <ABCIcon icon='add' size='20' color='#FFFFFF' />
          </View>
          <View className='text-normal ml-2'>发起转租</View>

        </View>

      </View>
    )
  }
}

export default ApartmentRecommend
