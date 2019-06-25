// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// NPM 相关
import classNames from 'classnames'

// 自定义组件
import BaseComponent from '@components/base'

class Board extends BaseComponent {

  static defaultProps = {
    border: 'all', // 可选值 all, top, bottom, none
    fixed: false,
    title: false,
    fixedTop: false,
    color: '',
    style: {},
  }

  render() {
    const {
      fixed,
      border,
      className,
      styleName,
    } = this.props

    const rootClassName = [
      'board',
      `board--${border}`,
    ]

    const classObject = {
      'board--fixed': fixed === 'top',
      'board--fixed-top': fixed === 'bottom',
    }

    return (
      <View
        style={styleName}
        className={classNames(rootClassName, classObject, className)}
      >
        {this.props.children}
      </View>
    )
  }
}

export default Board
