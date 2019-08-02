// Taro 组件
import Taro from '@tarojs/taro'
import { AtIcon } from 'taro-ui'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'


// 自定义组件
import BaseComponent from '@components/base'


// 自定义常量
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'
import {HEART_YELLOW,HEART_YELLOW_EMPTY} from '@constants/picture'

class ApartmentContainer extends BaseComponent {

  static defaultProps = {
    swipers: [],
    width: 375 * 2,
    height: 250 * 2,
    isCollect: false,
    appointment_show_num: 0,
  }

  state = {
    current: 0
  }

  onShowPic() {
    const picList = []
    const { swipers } = this.props
    const { current } = this.state
    swipers.map(i => {
      picList.push(i.url)
    })
    const currentPic = picList[current + 1]


    Taro.previewImage({
      urls: picList,
      current: currentPic
    })
  }



  changePicIndex() {
    let { current } = this.state
    const { swipers } = this.props
    if (current > swipers.length - 2) { current = -1 }
    this.setState({
      current: current + 1
    })
  }

  render() {
    const { swipers, height, width, isCollect, show, appointment_show_num } = this.props

    const { current } = this.state

    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    const picIndexStyle = {
      left: Taro.pxTransform(40),
      top: Taro.pxTransform(height - 75),
    }


    const fontStyle = {
      borderRadius: "12px",
      left: Taro.pxTransform(40),
      top: Taro.pxTransform(height - 75),
    }


    return (
      <View className='position-relative' >
        {
          swipers.length > 1 ?
            <Swiper
              className='swiper'
              autoplay
              circular
              current
              onChange={this.changePicIndex}
              style={style}
              displayMultipleItems={1}
              indicatorActiveColor={COLOR_YELLOW}
              indicatorColor={COLOR_DOATS_CAROUSEL}
              onClick={this.onShowPic}
            >
              {swipers.map(i => <SwiperItem key={i.url}>
                <Image
                  style={style}
                  mode='scaleToFill'
                  src={`${i.url.split('?')[0]}?imageView2/1/w/${width}/h/${height}`}
                />
              </SwiperItem>)}
            </Swiper>
            :
            <Image
              style={style}
              mode='scaleToFill'
              src={swipers.length ? `${swipers[0].url.split('?')[0]}?imageView2/1/w/${width}/h/${height}` : ''} >
            </Image>
        }


        {/* index */}
        <View className='apartment-container-picIndexStyle' style={picIndexStyle}>
          <View  className='apartment-container-opacityBgStyle'></View>
        </View>
        <View className='text-normal at-row at-row__align--center at-row__justify--center apartment-container-picIndexStyle' style={fontStyle}>
          <Text className='text-yellow'>{current + 1}</Text>
          <Text className='text-white'>/{swipers.length}</Text>
        </View>

        <View className='page-white apartment-container p-3' >
          <View className='apartment-container-favorite at-row at-row__justify--center at-row__align--center' hidden={show === true ? true : false}>
            {isCollect
              ?
              <View className='mt-1' onClick={this.props.onDeleteFavorite}>
                <Image src={HEART_YELLOW} className='apartment-container-heart'></Image>
                <View className='apartment-container-heartNum' >{appointment_show_num}</View>
              </View>
              :
              <View className='mt-1' onClick={this.props.onCreateFavorite}>
                <Image src={HEART_YELLOW_EMPTY} className='apartment-container-heart' ></Image>
                <View className='apartment-container-heartNum' >{appointment_show_num}</View>
              </View>
            }
          </View>
          {this.props.children}
        </View>
      </View>

    )
  }
}

export default ApartmentContainer
