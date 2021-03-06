
import Taro, { Component } from '@tarojs/taro'
import classNames from 'classnames'
import { Image, Swiper, SwiperItem, View, ScrollView, Text } from '@tarojs/components'
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'
import { PAGE_EXTERNAL_INDEX, PAGE_ARTICLE_SHOW, PAGE_APARTMENT_SHOW } from '@constants/page'
import { PAYLOAD_HOME_INDEXDATAPOAT } from '@constants/api'

// Redux 相关
import { connect } from '@tarojs/redux'

import * as homeActions from '@actions/home'

@connect(state => state, {
  ...homeActions,
})
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
    contentHeight: 200,
    displayMultipleItems: 1,
    haveText: true
  }
  state = {
    payload: PAYLOAD_HOME_INDEXDATAPOAT,
  }

  refSwiper = node => this.swiper = node

  onNavigation({ url, title, id }) {
    const { type } = this.props
    const { payload } = this.state


    type === 'banner' && this.props.dispatchHomeIndexData({ ...payload, type: 1, origin_id: id })
    type === 'normal' && this.props.dispatchHomeIndexData({ ...payload, type: 2, origin_id: id })
    type === 'cbd' && this.props.dispatchHomeIndexData({ ...payload, type: 3, origin_id: id })
    let newUrl = url

    if (url === '') return;

    // 判断是否为外链
    const externalLink = /(http|https):\/\/([\w.]+\/?)\S*/
    const isExternal = url.search(externalLink) !== -1
    if (isExternal) {
      newUrl = `${PAGE_EXTERNAL_INDEX}?src=${url}&title=${title}`
    } else {
      newUrl = `${url}&title=${title}`
    }


    return Taro.navigateTo({ url: newUrl })
  }

  componentWillReceiveProps() {
    this.setState({ current: 0 })
  }

  onChangeIndex({ detail: { current} }) {
    this.setState({ current })
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
      haveText,
    } = this.props

    const { current } = this.state

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

    // 轮播图
    const bannerCarousel = type === 'banner' &&
      <Swiper
        ref={this.refSwiper}
        current={current}
        className='mr-3'
        autoplay
        circular
        indicatorDots
        style={swiperStyle}
        indicatorActiveColor={COLOR_YELLOW}
        indicatorColor={COLOR_DOATS_CAROUSEL}
        displayMultipleItems={displayMultipleItems}
        onChange={this.onChangeIndex}
      >
        {carousel.map(item =>
          <SwiperItem key={item.id} onClick={this.onNavigation.bind(this, item)}>
            <View style={{ height: Taro.pxTransform(380), overflow: 'hidden', position: 'relative' }}>
              <Image
                lazyLoad
                // src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                src={item.cover}
                mode='withfix'
                className='carousel-image vertical-level-center carousel-banner'
              />
            </View>
            <View style={contentStyle}>
              <View className='mt-1 text-large'>{item.title}</View>
              <View className='mt-2 text-small text-muted'>{item.subtitle ? item.subtitle : ' '}</View>
            </View>
          </SwiperItem>
        )}
      </Swiper>

    // 可滑动模块
    const normalCarousel = (type === 'normal' || type === 'cbd') &&
      <ScrollView scrollX className='carousel-normal' style={swiperStyle}>
        {carousel.map(item =>
          <View
            key={item.id}
            style={imageStyle}
            onClick={this.onNavigation.bind(this, item)}
            className='mr-2 carousel-normal-item'
          >
            <Image
              lazyLoad
              className='carousel-image'
              src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
              mode='withfix'
              style={imageStyle}
            />
            {
              haveText && <View >
                <Text className='title text-large text-white'>{item.title}</Text>
                <View className='carousel-image carousel-normal-item-mask'></View>
              </View>
            }

            {item.sum &&
              <View>
                <View className='count-bg'></View>
                <View className='at-row at-row__align--center count-text'>
                  <Image src='https://images.gongyuabc.com//image/fire.png' lazyLoad className='ml-1' style={{ width: Taro.pxTransform(20), height: Taro.pxTransform(20) }}></Image>
                  <View className='at-col at-col-8 text-mini text-yellow ' style={{ overflow: 'hidden', lineHeight: Taro.pxTransform(40) }}>{item.sum}</View>
                </View>
              </View>
            }
          </View>
        )}
      </ScrollView>

    return (
      <View className={classNames(className, 'carousel', 'ml-3')} >
        {bannerCarousel}
        {normalCarousel}
      </View>
    )
  }
}

export default Carousel
