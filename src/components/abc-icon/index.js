import Taro from '@tarojs/taro'
import { Text, View } from '@tarojs/components'
import classNames from 'classnames'

import BaseComponent from '@components/base'

class ABCIcon extends BaseComponent {
  static defaultProps = {
    customStyle: '',
    className: '',
    icon: '',
    size: 24,
    color: ''
  }

  render() {
    const { customStyle, className, icon, size, color } = this.props

    const rootStyle = {
      fontSize: `${Taro.pxTransform(parseInt(size) * 2)}`,
      color
    }

    return (
      <View className='at-row at-row__align--center '>
        <Text
          className={classNames(className, 'material-icons')}
          style={this.mergeStyle(rootStyle, customStyle)}
        >
          {icon}
        </Text>
      </View>
    )
  }
}

export default ABCIcon
