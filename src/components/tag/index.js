// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'

const TYPE_CLASS = { special: 'special' }


export default class Tag extends BaseComponent {

  static defaultProps = {
    type: '',
    name: '',
    small: false,
    circle: false,
    active: false,
    circle: false,
    disabled: false,
  }

  onClick() {
    const { disabled } = this.props
    if (!disabled) {
      this.props.onClick && this.props.onClick({ name: this.props.name, active: this.props.active })
    }
  }

  render() {
    const { type, className, active, circle, small } = this.props
    const rootClassName = ['tag', `tag--${type}`, `text-small`]

    const classObject = {
      [`tag--${type}`]: TYPE_CLASS[type],
      'tag--active': active,
      'tag-circle': circle,
      'tag-small': small,
    }

    return (
      <View
        className={classNames(rootClassName, classObject, className)}
        onClick={this.onClick.bind(this)}
      >
        {this.props.children}
      </View>
    )
  }
}
