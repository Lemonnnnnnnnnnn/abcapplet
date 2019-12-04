// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'


import '../../styles/_page.scss'

class SubletItem extends BaseComponent {

  render() {
    const { item } = this.props


    return (
      <View className='at-row m-2 ' onClick={this.props.onNavicatSublet.bind(this, item)}>

        <View className='at-row'>
          <View style={{ position: 'relative' }}>
            <Image src={item.url} className='home-sublet-image' mode='aspectFill' ></Image>
            <View style={{ position: 'absolute', bottom: '280%', right: '-20%' }}>
              <View className='home-swiper-home page-middile ml-2'>
                <View className='text-mini at-row page-middile ' >
                  <Text className='text-white ml-1'>热度:</Text>
                  <Text className='text-white '>{item.look_num} </Text>
                </View>
              </View>
            </View>

          </View>

          <View className=' at-col-7 ml-2' style='position:relative'>
            <View >
              <View className='text-small page-middile text-secondary  at-col--wrap home-sublet-houseType  mt-1 text-over-one' style={{ float: 'left' }}>{item.type_name}</View>
              {item.type === '1' && <Text className='ml-2 text-bold text-normal '>整租</Text>}
              {item.type === '2' && <Text>
                <Text className='ml-2 text-bold text-normal '>合租</Text>
                {item.room_type === '1' && <Text className='text-bold text-normal '>/主卧</Text>}
                {item.room_type === '2' && <Text className='text-bold text-normal '>/次卧</Text>}
              </Text>
              }
              <Text className='text-bold text-normal ml-2' style={{ wordBreak: ' break-all' }}>{item.title}</Text>
              <View></View>

            </View>

            <View className='mt-1 at-row ' style='position:absolute;bottom:32% '>
              {item.cbd_name[0] && <View className='page-middile text-small  text-secondary home-sublet-cbd px-1' >{item.cbd_name[0]}</View>}
              {item.cbd_name[1] && <View className='page-middile text-small  text-secondary ml-2 home-sublet-cbd px-1' >{item.cbd_name[1]}</View>}
            </View>

            {/* 最后一行 */}

            <View className='at-row at-row__justify--between at-row__align--center' style={{ position: 'absolute', bottom: '0%' }}>
              {/* 左 */}
              <View>
                {item.mzq ?
                  <View className='px-1 page-middile text-small text-yellow home-sublet-favourable' >{item.mzq} </View>
                  : <View>
                    {item.kdf ? <View className='px-1 page-middile text-small text-yellow home-sublet-favourable' >{item.kdf} </View>
                      : <View>
                        {item.sdf ? <View className='px-1 page-middile text-small text-yellow home-sublet-favourable' >{item.sdf} </View>
                          :
                          item.rz ? <View className='px-1 page-middile text-small text-yellow home-sublet-favourable' >{item.rz} </View>
                            : <View>

                            </View>}
                      </View>}
                  </View>
                }
              </View>
              {/* 右 */}
              <View>
                <View className='at-row at-row__align--center at-row__justify--end'>
                  <View className='text-yellow text-small ' style={{ marginTop: Taro.pxTransform(9) }}>￥</View>
                  {item && <View className='text-yellow'>{parseInt(item.price)}</View>}
                  <View className='text-yellow text-small ml-1' style={{ marginTop: Taro.pxTransform(9) }}>/月</View>
                </View>
              </View>


            </View>
          </View>

        </View>
        <View className='mt-3 sublet-home-line' ></View>

      </View>

    )
  }
}

export default SubletItem
