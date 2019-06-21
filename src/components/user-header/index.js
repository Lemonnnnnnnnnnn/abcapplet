// Taro 组件
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

// NPM 包
import classNames from 'classnames'

// 自定义组件
import BaseComponent from '@components/base'


class UserHeader extends BaseComponent {
  static defaultProps = {
    username: '',
    mobile: '',
  }

  render() {
    const { username, mobile, onLogin, className } = this.props

    const userAvatar = (
      <View className='mr-3'>
        <AtAvatar circle openData={{ type: 'userAvatarUrl' }} />
      </View>
    )

    const userInfo = (
      <View className='at-row at-row__align--center'>
        <View className='at-col'>
          <Text className='at-col text-super text-bold'>{username}</Text>
          <Text className='at-col text-normal'>{mobile}</Text>
        </View>
      </View>
    )

    const userLogin = (
      <View className='at-row at-row__align--center' onClick={onLogin}>
        <Text className='text-huge'>点击登录</Text>
      </View>
    )

    return (
      <View className={classNames(className, 'user-card at-row')}>
        {userAvatar}
        {username === '' ? userLogin : userInfo}
      </View>
    )
  }
}

export default UserHeader
