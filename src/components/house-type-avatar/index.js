import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import BaseComponent from '@components/base'


class houseTypeAvatar extends BaseComponent {

  config = {
    navigationBarTitleText: ''
  }

  state = {
  }

  render() {

    const { item } = this.props

    const items = item ? item.map((i, index) => ({ ...i, leftvalue: 16 * index+16 })) : ''




    return (
      <View className='at-row at-row__justify--between'>
        <View className='mx-2'>
          {items && <View >
            {items.map((i, index) =>
              <View key={i.id}>
                {index < 6 && <Image
                  src={i.headimgurl}
                  className='image-list'
                  style={{ left: `${i.leftvalue}px` }}

                />}
              </View>
            )}

            {item.length < 7 ? <Image
              src='https://images.gongyuabc.com/image/sublease/more.png'
              className='image-list'
              style={{ left: `${items.length * 16}px` }}
            />
              :
              <Image
                src='https://images.gongyuabc.com/image/sublease/more.png'
                className='image-list'
                style={{ left: '80px' }}
              />
            }

          </View>}


        </View>


        <View>
          <View className='text-normal text-muted'>已有50人获得退租险</View>
        </View>
      </View>

    )
  }
}
export default houseTypeAvatar;
