import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

import { PAYLOAD_SUB_LIST } from '@constants/api'
import ABCIcon from '@components/abc-icon'

import Search from '@components/search'
import SubletList from '@components/sublet-list'
import SubletCbd from '@components/sublet-cbd'

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

  state = {
    isInput: 1,
    payload: PAYLOAD_SUB_LIST,
    // count: false,
    inputValue: '',
    showCancel: false,

    fullRent: true,//合租按钮
    cbdList: [],
  }

  refSubletList = (node) => this.SubletList = node

  componentWillMount() {
    buryPoint()
    const { payload } = this.state

    const city_id = Taro.getStorageSync('user_info').citycode
    this.setState({ payload: { ...payload, city_id } })

    this.onGetCbd()
    // 获取用户数据 和 刷新页面数据
    // const { count } = this.state
    // count && this.SubletList.onReset(null)
    // this.setState({ count: true })
  }

  componentDidShow() {
    const { payload } = this.state
    Taro.hideTabBarRedDot({ index: 2 })

    // 每次进入页面，根据如果payload里的city_id和缓存里的citycode不一致，刷新列表
    const city_id = Taro.getStorageSync('user_info').citycode
    if (payload.city_id !== city_id) {
      this.onGetCbd()
      const payloadNow = { ...payload, city_id }
      this.SubletList.onReset(payloadNow)
      this.setState({ payload: payloadNow })
    }
  }

  //获取商圈
  onGetCbd() {
    //先拿城市code换取城市id
    const city_id = Taro.getStorageSync('user_info').citycode
    this.props.dispatchCityCodeList({ city_id }).then(res => {
      res.data.data.map(i => {
        if (Taro.getStorageSync('user_info').citycode === parseInt(i.code)) {
          this.props.dispatchSubleaseIndex({ city_id: i.id }).then(response => {
            this.setState({
              cbdList: response.data.data.cbd && response.data.data.cbd.map(k => ({ ...k, active: false }))
            })
          })
        }
      })
    })
  }

  async  onPullDownRefresh() {
    await this.SubletList.onReset(null)
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
      path: ' pages/postsublet/base', // 跳转的目标页面

      success(res) {
        // 打开成功
        console.log(res)
      },
      fail(res) {
        console.log(res)
      }

    }).catch(e => console.log(e))
  }


  //用户输入
  onInputValue({ currentTarget: { value } }) {
    this.setState({ inputValue: value })
  }
  //搜索
  async onInputConfirm() {
    const { inputValue, payload } = this.state
    this.setState({ showCancel: true })
    await this.SubletList.onReset({ ...payload, keyword: inputValue })
    await this.props.dispatchSubList({ ...payload, keyword: inputValue })

  }
  onInputCancel() {
    const { payload } = this.state
    this.SubletList.onReset({ ...payload })
    this.setState({ showCancel: false, inputValue: '' })
  }
  //切换整租合租
  async onNightListChange() {
    const { fullRent, payload } = this.state

    fullRent ? this.setState({ payload: { ...payload, type: 2 } }) : this.setState({ payload: { ...payload, type: 1 } })
    if (fullRent) {
      await this.SubletList.onReset({ ...payload, type: 2 })
    } else {
      await this.SubletList.onReset({ ...payload, type: 1 })
    }
    this.setState({
      fullRent: !fullRent,
    })
  }
  //选择商圈
  async onChangeCbd(value) {

    const { cbdList, payload } = this.state
    let cbdSeach = []
    cbdList.map(i => {
      if (i.id === value.id) {
        i.active = !i.active
      }
    })
    cbdList.map(i => {
      if (i.active === true) {
        cbdSeach.push(i.id)
      }
    })
    await this.SubletList.onReset({ ...payload, cbd_list: cbdSeach.toString(',') })
    this.setState({
      cbdList,
      payload: { ...payload, cbd_list: cbdSeach.toString(',') }
    })
  }
  render() {
    const { isInput, payload, showCancel, inputValue, fullRent, cbdList } = this.state
    const { sublet } = this.props

    return (
      <View style={{ background: '#FFFFFF', minHeight: '100vh', display: 'block', overflowY: 'auto' }}>
        <View className='home-search pl-3 pr-3 pt-2'>
          {
            <Search
              className='mb-1'
              showPicker={false}
              isInputSub={isInput}
              showCancel={showCancel}
              inputValue={inputValue}
              onInputValue={this.onInputValue}
              onInputCancel={this.onInputCancel}
              onInputConfirm={this.onInputConfirm}
            />
          }
        </View>
        <View className='mt-2 mx-3'>
          <SubletCbd
            NightList={fullRent}
            onNightListChange={this.onNightListChange}
            cbdList={cbdList}
            onChangeCbd={this.onChangeCbd}
          />
        </View>
        <View className='mt-2 mx-2'>
          <SubletList
            items={sublet.list}
            ref={this.refSubletList}
            defaultPayload={payload}
            dispatchList={this.props.dispatchSubList}
            dispatchNextPageList={this.props.dispatchNextPageSubList}
          />
        </View>
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
