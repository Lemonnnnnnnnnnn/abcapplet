
import Taro, { Component } from '@tarojs/taro'
import classNames from 'classnames'
import { Image, Swiper, SwiperItem, View, ScrollView, Text } from '@tarojs/components'
import { COLOR_DOATS_CAROUSEL, COLOR_YELLOW } from '@constants/styles'
import { PAGE_EXTERNAL_INDEX, PAGE_ARTICLE_SHOW, PAGE_APARTMENT_SHOW } from '@constants/page'

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

  onNavigation({ url, title }) {
    let newUrl = url

    if (url === '') return;

    // 判断是否为外链
    const externalLink = /(http|https):\/\/([\w.]+\/?)\S*/
    const isExternal = url.search(externalLink) !== -1
    if (isExternal) newUrl = `${PAGE_EXTERNAL_INDEX}?src=${url}&title=${title}`

    // 判断是否为 后端传递的文章链接
    const artileLink = '/pages/home/article/detail/index'
    const isBackendArtile = url.search(artileLink) !== -1
    if (isBackendArtile) newUrl = `${url.replace(artileLink, PAGE_ARTICLE_SHOW)}&title=${title}`

    // 判断是否为公寓详情
    const apartmentLink = '/pages/home/detail/index'
    const isBackendApartment = url.search(apartmentLink) !== -1
    if (isBackendApartment) newUrl = `${url.replace(apartmentLink, PAGE_APARTMENT_SHOW)}`

    // 判断是否 本身就是文章链接
    const isArtile = url.search(PAGE_ARTICLE_SHOW) !== -1
    if (isArtile) newUrl = `${url}&title=${title}`

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
      left: " 8px",
      top: "8px",
      borderRadius: " 16px",
      padding: " 6px 5px",
      backgroundColor: "#fff",
      width: "50px",
      height: "5px",
      opacity: "0.8",
    }

    const countStyle = {
      position: "absolute",
      left: " 8px",
      top: "8px",
      padding: " 6px 5px",
      width: "50px",
      height: "5px",
      textAlign: "center",
      justifyContent: "center",
      alignItems: "center",
    }

    const maskStyle = {
      position : "absolute",
      background : 'linear-gradient(to bottom ,rgba(0,0,0,0) 0%,rgba(50,50,50,0.7) 100% )',
      bottom : 0,
      left : 0,
      height : '35%',
      width : '100%',
      zIndex: '20'
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
      <View className={classNames(className, 'carousel', 'ml-3')}>

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
                />
                <View style={contentStyle}>
                  <View className='mt-1 text-large'>{item.title}</View>
                  <View className='mt-2 text-small text-muted'>{item.subtitle ? item.subtitle : ' '}</View>
                </View>
              </SwiperItem>
            )}
          </Swiper>
        }


        {type === 'normal' &&
          <ScrollView scrollX className='carousel-normal' style={swiperStyle}>
            {carousel.map(item =>
              <View
                key={item.id}
                style={imageStyle}
                onClick={this.onNavigation.bind(this, item)}
                className='mr-2 carousel-normal-item'
              >
                <Image
                  src={`${item.cover}?imageView2/1/w/${imageWidth}/h/${imageHeight}`}
                  mode='scaleToFill' style={imageStyle}
                />
                {
                  haveText && <View >
                    <Text className='title text-large text-white'>{item.title}</Text>
                    <View style={maskStyle}></View>
                  </View>
                }

                {item.sum &&
                  <View>
                    <View style={bgStyle} ></View>
                    <View style={countStyle} className='at-row at-row__align--center'>
                      <View className='at-col at-col-2'>
                        <Image src='https://images.gongyuabc.com//image/fire.png' style={{ width: "12px", height: "12px" }}></Image>
                      </View>
                      <View className='at-col at-col-8 text-mini text-yellow ml-1' style={{ marginTop: "1Px", overflow: 'hidden' }}>{item.sum}</View>
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
