// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { LOCALE_LOGIN } from '@constants/locale'


class UserHeader extends BaseComponent {
  static defaultProps = {
    username: '',
    mobile: '',
  }

  render() {
    const { username, mobile, onLogin, className } = this.props

    const userAvatar = (
      <View className='at-col at-col-3'>
        <AtAvatar circle openData={{ type: 'userAvatarUrl' }} />
      </View>
    )

    const userInfo = (
      <View className=' at-col at-col-9 at-col__align--center'>
        <View className='at-col text-super text-bold overtext '>{username}</View>
        <View className='at-col text-normal'>{mobile}</View>
      </View>
    )

    const userLogin = (
      <View className='at-row at-row__align--center' onClick={onLogin}>
        <Text className='text-huge'>{LOCALE_LOGIN}</Text>
      </View>
    )

    return (
      <View className={classNames(className, 'user-card display-flex')}>
        {userAvatar}
        {username === '' ? userLogin : userInfo}
      </View>
    )
  }
}

export default UserHeader
