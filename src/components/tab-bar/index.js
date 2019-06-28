// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtButton } from 'taro-ui'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// NPM 包
import classNames from 'classnames'

class TabBar extends BaseComponent {

  static defaultProps = {
    show: true,
    buttons: [],
    hasShare: true,
  }

  render() {
    const { className, buttons, hasShare, show } = this.props

    return (
      show && <View className={classNames(className)}>
        <View class='tab-bar at-row at-row__align--center p-2'>
          {hasShare && <View className='at-col-2'>
            <AtButton open-type='share' className='tab-bar__item--icon at-row at-row__justify--center at-row__align--center'>
              <ABCIcon icon='share' color='#000' />
            </AtButton>
          </View>}

          {/* 暂时隐藏，设计稿和接口有出入 */}
          {/* <View className='at-col-2'>
            <AtButton className='tab-bar__item--icon at-row at-row__justify--center at-row__align--center'>
              <ABCIcon icon='favorite_border' color='#000' />
            </AtButton>
          </View>

          <View className='at-col-2'>
            <AtButton className='tab-bar__item--icon at-row at-row__justify--center at-row__align--center'>
              <ABCIcon icon='star' color='#000' />
            </AtButton>
          </View> */}

          {buttons.map((i, index) =>
            <View key={i.id} className={classNames(i.className || 'at-col', buttons.length - 1 !== index && 'pr-2')}>
              <AtButton
                circle
                className='btn-yellow active'
                onClick={this.props.onClick.bind(this, i.method)}
              >
                {i.message}
              </AtButton>
            </View>)}
        </View>
      </View>

    )
  }
}

export default TabBar
