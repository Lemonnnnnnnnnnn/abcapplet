// Taro 相关
import Taro from '@tarojs/taro'
import { View , Image } from '@tarojs/components'

// 自定义组件

// 自定义组件
import BaseComponent from '@components/base'
import Borad from '@components/board'
import { LOCALE_MY_ORDER } from '@constants/locale'



class UserOrderOptions extends BaseComponent {
  static defaultProps = {
    lists: [],
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }

  render() {
    const { lists, className } = this.props

    return (
      <Borad className={`${className} p-3`}>
        <View className='text-bold border-bottom pb-3 text-normal'>
          {LOCALE_MY_ORDER}
        </View>
        <View className='at-row pt-3'>
          {lists.map(i =>
            <View key={i.id} className='mx-2 at-col' onClick={this.onNavigation.bind(this, i.url)}>
              <View  className='ml-5 button-order at-row at-row__justify--center at-row__align--center'>
                <Image src={i.imageurl} style='width:45px;height:45px' />
              </View>
              <View >
                <View style='text-align : center' className='text-small mt-2'>{i.title}</View>
              </View>
            </View>
          )}
        </View>
      </Borad>
    )
  }
}

export default UserOrderOptions
