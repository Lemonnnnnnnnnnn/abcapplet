// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'

class TabBarBoard extends BaseComponent {

  render() {
    const { className } = this.props

    return (
      <View className={classNames(className, 'tab-bar-height')}>
        <View class='tab-bar at-row at-row__align--center p-2'>
          {this.props.children}
        </View>
      </View>
    )
  }
}

export default TabBarBoard
