
import Taro, { Component } from '@tarojs/taro'
import classNames from 'classnames'
import { Image, Swiper, SwiperItem, View, ScrollView, Text } from '@tarojs/components'
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'

class Carousel extends Component {
  static options = {
    addGlobalClass: true
  }

  static defaultProps = {
    carousel: [],
    type: 'banner',
    imageHeight: 344,
    imageWidth: 626,
    hasContent: true,
    contentHeight: 170,
    displayMultipleItems: 1,
  }

  onNavigation(url) {
    // TODO Taro.reLaunch({ url })
    console.log(url)
  }

  render() {
    const {
      type,
      imageHeight,
      imageWidth,
      carousel,
      className,
      hasContent,
      contentHeight,
      displayMultipleItems,
    } = this.props

    /**
     * 计算轮播高度
     */
    const swiperHeight = hasContent ? imageHeight + contentHeight : imageHeight
    const swiperStyle = { height: `${Taro.pxTransform(swiperHeight)}` }
    const contentStyle = { height: `${Taro.pxTransform(contentHeight)}` }
    const imageStyle = {
      height: `${Taro.pxTransform(imageHeight)}`,
      width: hasContent ? '100%' : `${Taro.pxTransform(imageWidth)}`,
    }


    return (
      <View className={classNames(className, 'carousel')}>

        {type === 'banner' &&
          <Swiper
            autoplay
            circular
            indicatorDots
            style={swiperStyle}
            indicatorActiveColor={COLOR_YELLOW}
            indicatorColor={COLOR_DOATS_CAROUSEL}
            displayMultipleItems={displayMultipleItems}
          >
            {carousel.map((item, index) =>
              <SwiperItem key={index} onClick={this.onNavigation.bind(this, item.url)}>
                <Image
                  src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                  mode='scaleToFill' style={imageStyle}
                />
                <View style={contentStyle}>
                  <View className='mt-1 text-large'>{item.title}</View>
                  <View className='mt-1 text-small text-muted'>{item.subtitle ? item.subtitle : ' '}</View>
                </View>
              </SwiperItem>
            )}
          </Swiper>
        }


        {type === 'normal' &&
          <ScrollView scrollX className='carousel-normal' style={swiperStyle}>
            {carousel.map((item, index) =>
              <View
                key={index}
                style={imageStyle}
                onClick={this.onNavigation.bind(this, item.url)}
                className='mr-2 carousel-normal-item'
              >
                <Image
                  src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                  mode='scaleToFill' style={imageStyle}
                />
                <Text className='title text-large text-white'>{item.title}</Text>
                {item.sum && <Text className='count text-mini text-yellow'>{item.sum}</Text>}
              </View>
            )}
          </ScrollView>
        }
      </View>
    )
  }
}

export default Carousel
