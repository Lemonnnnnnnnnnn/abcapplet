// Taro 组件
import Taro from '@tarojs/taro'
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components'

// 自定义组件
import BaseComponent from '@components/base'
import MaskTop from '@components/maskTop'

// 自定义常量
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'
import { HEART_YELLOW, HEART_YELLOW_EMPTY } from '@constants/picture'

class ApartmentContainer extends BaseComponent {

  static defaultProps = {
    swipers: [],
    width: 375 * 2,
    height: 250 * 2,
    isCollect: false,
    appointment_show_num: 0,
  }

  state = {
    current: 0,
    showPhotos: false,
  }
  //展示样板房
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

  changePicIndex(e) {
    const current = e.detail.current
    this.setState({ current: current - 1 })
  }


  //展示清水房照片
  onShowPhoto() {
    const picList = []
    const { qsf_picture } = this.props
    const { current } = this.state
    qsf_picture.map(i => {
      picList.push(i.url)
    })
    const currentPic = picList[current + 1]

    Taro.previewImage({
      urls: picList,
      current: currentPic
    })
  }

  render() {
    const { swipers, height, isCollect, show, num, type, qsf_picture } = this.props

    const { current, showPhotos } = this.state

    const style = {
      width: '100%',
      height: Taro.pxTransform(height),
    }

    return (
      <View className='position-relative' >
        {type && qsf_picture.length ? <View>
          {showPhotos ? <View>
            <View className='apartment-container-opactyRoom text-white text-small' onClick={this.onShowPhoto}>
              <View className='mask inherit-Width inherit-Height'></View>
              <View className='num text-normal at-row at-row__align--center at-row__justify--center '>查看清水房照片</View>
            </View>
            <View className='apartment-container-picIndexStyle'>
              <View className='mask inherit-Width inherit-Height'></View>
              <View className='num text-normal at-row at-row__align--center at-row__justify--center '>
                <Text className='text-yellow'>{current + 1 ? current + 1 : qsf_picture.length}</Text>
                <Text className='text-white'>/{qsf_picture.length}</Text>
              </View>
            </View>
          </View>
            :
            <View>
              <View className='apartment-container-opactyRoom text-white text-small ' onClick={this.onShowPhoto}>
                <View className='mask inherit-Width inherit-Height'></View>
                <View className='num text-normal at-row at-row__align--center at-row__justify--center '>查看清水房照片</View>
              </View>
              <View className='apartment-container-picIndexStyle'>
                <View className='mask inherit-Width inherit-Height'></View>
                <View className='num text-normal at-row at-row__align--center at-row__justify--center '>
                  <Text className='text-yellow'>{current + 1 ? current + 1 : swipers.length}</Text>
                  <Text className='text-white'>/{swipers.length}</Text>
                </View>
              </View>
            </View>
          }
        </View>
          :
          <View className='apartment-container-picIndexStyle'>
            <View className='mask inherit-Width inherit-Height'></View>
            <View className='num text-normal at-row at-row__align--center at-row__justify--center '>
              <Text className='text-yellow'>{current + 1 ? current + 1 : swipers.length}</Text>
              <Text className='text-white'>/{swipers.length}</Text>
            </View>
          </View>
        }

        {!showPhotos ? <View>
          {swipers && swipers.length ? <View>
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
                      lazyLoad
                      style={style}
                      mode='aspectFill'
                      src={i.url}
                    />
                  </SwiperItem>)}
                </Swiper>
                :
                <Image
                  lazyLoad
                  style={style}
                  mode='aspectFill'
                  src={swipers.length ? `${swipers[0].url}` : ''}
                >
                </Image>
            }
          </View>
            : <View style={{ height: Taro.pxTransform(500) }}></View>
          }</View>
          : <View>{qsf_picture && qsf_picture.length ? <View>
            {
              qsf_picture && qsf_picture.length > 1 ?
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
                  onClick={this.onShowPicPhoto}
                >
                  {qsf_picture.map(i => <SwiperItem key={i.url}>
                    <Image
                      lazyLoad
                      style={style}
                      mode='aspectFill'
                      src={i.url}
                    />
                  </SwiperItem>)}
                </Swiper>
                :
                <Image
                  lazyLoad
                  style={style}
                  mode='aspectFill'
                  src={qsf_picture.length ? `${qsf_picture[0].url}` : ''}
                >
                </Image>
            }
          </View>
            : <View style={{ height: Taro.pxTransform(500) }}></View>
          }</View>}

        <MaskTop />

        <View className='page-white apartment-container pb-3' >
          <View className='apartment-container-favorite at-row at-row__justify--center at-row__align--center' hidden={show === true ? true : false}>
            {isCollect
              ?
              <View className='at-row at-row__justify--center at-row__align--center' style={{ marginTop: '1px' }} onClick={this.props.onDeleteFavorite}>
                <Image lazyLoad src={HEART_YELLOW} className='apartment-container-heart'></Image>
                <View className='apartment-container-heartNum' >{num}</View>
              </View>
              :
              <View className='at-row at-row__justify--center at-row__align--center' style={{ marginTop: '1px' }} onClick={this.props.onCreateFavorite}>
                <Image lazyLoad src={HEART_YELLOW_EMPTY} className='apartment-container-heart' ></Image>
                <View className='apartment-container-heartNum' >{num}</View>
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
