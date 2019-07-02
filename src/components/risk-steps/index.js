// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import BaseComponent from '@components/base'

export default class AtSteps extends BaseComponent {
  static defaultProps = {
    items: [],
    current: 0,
  }
  render() {
    const {
      customStyle,
      className,
      items,
      current,
    } = this.props

    return (
      <View
        className={classNames('at-steps', className)}
        style={customStyle}
      >
        {
          items.map((item, i) => (
            <View
              key={item.title}
              className={
                classNames({
                  'at-steps__item': true,
                  'at-steps__item--active': i <= current,
                  'at-steps__item--inactive': i > current,
                  'at-steps__item--error': item.error,
                })
              }
            >
              <View className='at-steps__circular-wrap'>

                {i !== 0 && <View className={
                  classNames({
                    'at-steps__left-line': true,
                    'at-steps__left-line--active': i <= current,
                  })}
                ></View>}

                <View className='at-steps__circular'></View>
                {i !== items.length - 1 && <View className={
                  classNames({
                    'at-steps__right-line': true,
                    'at-steps__right-line--active': i < current,
                  })}
                ></View>}
              </View>
              <View className='at-steps__title'>
                {item.title}
              </View>
            </View>
          ))
        }
      </View>
    )
  }
}
