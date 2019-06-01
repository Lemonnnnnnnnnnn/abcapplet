import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import { COLOR_GREY_2 } from '@constants/styles'
import { MESSAGE_MORE } from '@constants/message'
import { PAGE_HOME } from '@constants/page'
import classNames from 'classnames'

class Header extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    size: 17,
    title: [],
    hasExtra: false,
    url: PAGE_HOME,
    extraText: MESSAGE_MORE,
  }

  onNavigation(url) {
    // TODO Taro.reLaunch({ url })
    console.log(url)
  }

  render() {

    const { title, hasExtra, extraText, url, size, className } = this.props

    return (
      <View className={classNames(className, 'at-row at-row__justify--between')}>
        <View className='text-bold text-huge'>{title}</View>
        {hasExtra && <View onClick={this.onNavigation.bind(this, url)}>
          <Text className='text-small text-muted'>{extraText}</Text>
          <AtIcon value='chevron-right' color={COLOR_GREY_2} size={size} />
        </View>}
      </View>
    )
  }
}

export default Header
