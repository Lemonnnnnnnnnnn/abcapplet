
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
    contentHeight: 170,
    displayMultipleItems: 1,
    haveText: true
  }
  state = {
    payload : PAYLOAD_HOME_INDEXDATAPOAT
  }

  onNavigation({ url, title,id }) {
    const { type } = this.props
    const { payload } = this.state


    type==='banner' && this.props.dispatchHomeIndexData({...payload,type:1,origin_id:id})
    type==='normal' && this.props.dispatchHomeIndexData({...payload,type:2,origin_id:id})
    type==='cbd' && this.props.dispatchHomeIndexData({...payload,type:3,origin_id:id})
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

    // // 判断是否为 后端传递的文章链接
    // const artileLink = '/pages/home/article/detail/index'
    // const isBackendArtile = url.search(artileLink) !== -1
    // if (isBackendArtile) newUrl = `${url.replace(artileLink, PAGE_ARTICLE_SHOW)}&title=${title}`

    // // 判断是否为公寓详情
    // const apartmentLink = '/pages/home/detail/index'
    // const isBackendApartment = url.search(apartmentLink) !== -1
    // if (isBackendApartment) newUrl = `${url.replace(apartmentLink, PAGE_APARTMENT_SHOW)}`

    // // 判断是否 本身就是文章链接
    // const isArtile = url.search(PAGE_ARTICLE_SHOW) !== -1
    // if (isArtile) newUrl = `${url}&title=${title}`

    return Taro.navigateTo({ url: newUrl })
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

    const bgStyle = {
      position: "absolute",
      left: Taro.pxTransform(16),
      top: Taro.pxTransform(16),
      borderRadius: Taro.pxTransform(32),
      // padding: " 6px 5px",
      backgroundColor: "#000",
      width: Taro.pxTransform(120),
      height: Taro.pxTransform(35),
      opacity: "0.5",
    }

    const countStyle = {
      position: "absolute",
      left: Taro.pxTransform(16),
      top: Taro.pxTransform(16),
      // padding: " 6px 5px",
      width: Taro.pxTransform(120),
      height: Taro.pxTransform(35),
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    }

    const maskStyle = {
      position: "absolute",
      background: 'linear-gradient(to bottom ,rgba(0,0,0,0) 0%,rgba(50,50,50,0.7) 100% )',
      bottom: 0,
      left: 0,
      height: '35%',
      width: '100%',
      zIndex: '20',
    }

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
      <View className={classNames(className, 'carousel', 'ml-3')} >

        {type === 'banner' &&
          <Swiper
            className='mr-3'
            autoplay
            circular
            indicatorDots
            style={swiperStyle}
            indicatorActiveColor={COLOR_YELLOW}
            indicatorColor={COLOR_DOATS_CAROUSEL}
            displayMultipleItems={displayMultipleItems}
          >
            {carousel.map(item =>
              <SwiperItem key={item.id} onClick={this.onNavigation.bind(this, item)}>
                <Image
                  src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                  mode='scaleToFill' style={imageStyle}
                  className='carousel-image'
                />
                <View style={contentStyle}>
                  <View className='mt-1 text-large'>{item.title}</View>
                  <View className='mt-2 text-small text-muted'>{item.subtitle ? item.subtitle : ' '}</View>
                </View>
              </SwiperItem>
            )}
          </Swiper>
        }


        {(type === 'normal' || type === 'cbd') &&
          <ScrollView scrollX className='carousel-normal' style={swiperStyle}>
            {carousel.map(item =>
              <View
                key={item.id}
                style={imageStyle}
                onClick={this.onNavigation.bind(this, item)}
                className='mr-2 carousel-normal-item'
              >
                <Image
                  className='carousel-image'
                  src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                  mode='scaleToFill' style={imageStyle}
                />
                {
                  haveText && <View >
                    <Text className='title text-large text-white'>{item.title}</Text>
                    <View style={maskStyle} className='carousel-image'></View>
                  </View>
                }

                {item.sum &&
                  <View>
                    <View style={bgStyle} ></View>
                    <View style={countStyle} className='at-row at-row__align--center'>
                      <Image src='https://images.gongyuabc.com//image/fire.png' className='ml-1' style={{ width: Taro.pxTransform(20), height: Taro.pxTransform(20) }}></Image>
                      <View className='at-col at-col-8 text-mini text-yellow ' style={{ overflow: 'hidden', lineHeight: Taro.pxTransform(40) }}>{item.sum}</View>
                    </View>
                  </View>
                }
              </View>
            )}
          </ScrollView>

        }
      </View>
    )
  }
}

export default Carousel
