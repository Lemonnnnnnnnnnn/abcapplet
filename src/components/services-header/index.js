// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

class ServiceHeader extends BaseComponent {

  static defaultProps = {
  }

  render() {
    return (
      <View className='page-service-bg at-row at-row__justify--center '>
        <View className='page-service-left at-col at-col-5 m-2' onClick={this.props.onClickLeft}></View>
        <View className='page-service-right at-col at-col-5 m-2' onClick={this.props.onClickRight}></View>
      </View>

    )
  }
}

export default ServiceHeader
