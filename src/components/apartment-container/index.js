// Taro 组件
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { View, Swiper, SwiperItem, Image } from '@tarojs/components'


// 自定义组件
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'

class ApartmentContainer extends BaseComponent {

  static defaultProps = {
    swipers: [],
    width: 375 * 2,
    height: 250 * 2,
    isCollect: false,
  }

  render() {
    const { swipers, height, width, isCollect } = this.props

    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    return (
      <View>
        <Swiper
          autoplay
          circular
          style={style}
          displayMultipleItems={1}
          indicatorActiveColor={COLOR_YELLOW}
          indicatorColor={COLOR_DOATS_CAROUSEL}
        >
          {swipers.map(i => <SwiperItem key={i.url}>
            <Image
              style={style}
              mode='scaleToFill'
              src={`${i.url.split('?')[0]}?imageView2/1/w/${width}/h/${height}`}
            />
          </SwiperItem>)}
        </Swiper>

        <View className='page-white apartment-container p-3'>
          <View className='apartment-container-favorite at-row at-row__justify--center at-row__align--center'>
            {isCollect
              ? <AtIcon value='heart-2' size='35' color={COLOR_YELLOW} onClick={this.props.onDeleteFavorite} />
              : <AtIcon value='heart' size='35' color={COLOR_YELLOW} onClick={this.props.onCreateFavorite} />
            }
          </View>
          {this.props.children}
        </View>
      </View>

    )
  }
}

export default ApartmentContainer
