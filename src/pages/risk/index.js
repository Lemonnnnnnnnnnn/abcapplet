// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as riskActions from '@actions/risk'

// 自定义组件
import RiskList from '@components/risk-list'
import Decorate from '@components/decorate'
import RiskHeader from '@components/risk-header'

// 自定义常量
import { RISK_HEADERS } from '@constants/risk'
import { PAYLOAD_RISK_LIST } from '@constants/api'

@connect(state => state, {
  ...riskActions,
})
class RiskIndex extends Component {
  config = {
    navigationBarTitleText: '风险金',
    navigationBarBackgroundColor: '#FFC919',
  }

  render() {
    const { risks } = this.props
    return (
      <View className='px-3 pt-3'>
        {/* 背景底色 */}
        <Decorate height='180' />

        {/* 风险金头部 */}
        <RiskHeader
          className='mb-3'
          items={RISK_HEADERS}
        />

        {/* 风险列表 */}
        <RiskList
          items={risks.list}
          ref={this.refRiskList}
          defaultPayload={PAYLOAD_RISK_LIST}
          dispatchList={this.props.dispatchRiskList}
          dispatchNextPageList={this.props.dispatchNextPageRiskList}
        />
      </View>
    )
  }
}

export default RiskIndex
