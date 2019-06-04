import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import classNames from 'classnames'

const TYPE_CLASS = { special: 'special' }


export default class AtTag extends Component {
  static options = {
    addGlobalClass: true,
  }

  static defaultProps = {
    type: '',
    name: '',
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
    const { type, className, active } = this.props
    const rootClassName = ['tag p-2 mr-1', `tag--${type}`, `text-small`]

    const classObject = {
      [`tag--${type}`]: TYPE_CLASS[type],
      'tag--active': active,
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
