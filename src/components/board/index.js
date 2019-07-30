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
    color: 'white',
    style: {},
  }

  render() {
    const {
      fixed,
      color,
      border,
      className,
      customStyle,
    } = this.props

    const rootClassName = [
      'board',
      `board--${border}`,
      `board--${color}`
    ]

    const classObject = {
      'board--fixed': fixed === 'bottom',
      'board--fixed-top': fixed === 'top',
    }


    return (
      <View
        style={customStyle}
        className={classNames(rootClassName, classObject, className)}
      >
        {this.props.children}
      </View>
    )
  }
}

export default Board
