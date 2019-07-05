import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
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
    const { className, icon, size, color } = this.props

    const rootStyle = {
      fontSize: `${Taro.pxTransform(parseInt(size) * 2)}`,
      color,
    }

    return (
      <View className={classNames(className)}
        style={this.mergeStyle(rootStyle, {
          'text-align': 'center',
          display: 'table',
        })}
      >
        <View
          className='material-icons'
          style={this.mergeStyle(rootStyle, {
            'vertical-align': 'middle',
            display: 'table-cell',
          })}
        >
          {icon}
        </View>
      </View>
    )
  }
}

export default ABCIcon
