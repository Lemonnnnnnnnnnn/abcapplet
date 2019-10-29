// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as adActions from '@actions/ad'

// 自定义组件
import Borad from '@components/board'
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'
import { COLOR_BLACK } from '@constants/styles'

@connect(state => state, {
  ...adActions,
})
class RiskHeader extends BaseComponent {
  static defaultProps = {
    items: [],
  }
  onNavigetion() {
    Taro.navigateTo({ url: '/pages/risk/landing-page' })
  }

  render() {
    const { items, className, ads:{riskAd} } = this.props
    return (<View>
      <Borad color='black' className={className}>
        <View className='px-4 py-4' onClick={this.onNavigetion}>
          <View className='at-row at-row__justify--between '>
            {items.map(i => <View key={i.id}>
              <View className='at-row  at-row__align--center'>
                <View className=''>
                  <Image src={i.url} style={{ width: Taro.pxTransform(i.width), height: Taro.pxTransform(i.height) }}></Image>
                </View>
                <View className='text-white text-normal ml-2 mb-1'>
                  <View>{i.title}</View>
                  <View>{i.desc}</View>
                </View>
              </View>
            </View>
            )}
          </View>
        </View>
      </Borad>
      <View className='risk-ad  page-middile mb-3'>
        <View className='text-small' style={{ marginLeft: Taro.pxTransform(200) }}> 已有{riskAd.people_num || 50}人获得退租险  共赔付￥{riskAd.sum || 10000}</View>
      </View>
    </View>
    )
  }
}

export default RiskHeader
