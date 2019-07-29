// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Map, Image, Text, ScrollView } from '@tarojs/components'
import { AtAvatar } from 'taro-ui'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Tag from '@components/tag'
import TabBar from '@components/tab-bar'
import ABCIcon from '@components/abc-icon'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import ApartmentContainer from '@components/apartment-container'
// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ACTIVITY_APARTMENT, PAGE_HOUSE_TYPE_SHOW } from '@constants/page'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST } from '@constants/apartment'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class ApartmentShow extends Component {
  config = {
    navigationBarTitleText: '',
  }

  state = {
    apartment: {
      cbds: [],
      rules: [],
      swipers: [],
      special: [],
      notices: [],
      hotRules: [],
      facilitys: [],
    },
    map: {
      latitude: 0,
      longitude: 0,
      markers: [],
    },
    buttons : [],
  }

  async componentDidMount() {
    const { id = 255 } = this.$router.params

    const { data: { data } } = await this.props.dispatchApartmentShow({ id })

    let facilitys = data.facility_list
    let publicMatch = []
    facilitys && facilitys.map(i => {
      publicMatch.push(i)
    })

    const publicMatch_list = publicMatch.slice(0, 5)

    Taro.setNavigationBarTitle({ title: data.title })

    const buttons = !data.is_sign
      ? [{ message: '预约看房', method: 'onCreateBusiness' }]
      : [{ message: '预约看房', method: 'onCreateBusiness' }, { message: '签约下定', method: 'onCreateOrder' }]

    this.setState({
      publicMatch_list: publicMatch_list,
      buttons: buttons,
      apartment: {
        id: data.id,
        title: data.title,
        intro: data.one_word,
        cover: data.extend_info.pictures[0].url,
        tags: data.tags,
        desc: data.desc,
        apartmentTitle: data.apartment_title,

        // address: data.address,
        cbds: data.cbd_list,
        types: data.house_types.map(i => ({ ...i, url: `${PAGE_HOUSE_TYPE_SHOW}?id=${i.id}` })),
        isCollect: data.is_collect,
        rules: data.extend_info.rules,
        position: data.position,
        is_sign: data.is_sign,
        facilitys: data.facility_list,
        special: data.extend_info.special,
        notices: data.extend_info.notices,
        swipers: data.extend_info.pictures,
        hotRules: data.hot_rules.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
      },
      map: {
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        markers: [{
          id: data.id,
          latitude: data.latitude,
          longitude: data.longitude,
          callout: {
            content: data.title,
            display: 'ALWAYS',
            bgColor: "#3a3a3a",
            color: "#fff",
            borderRadius: 50,
            padding: 10,
          },
        }],
      }
    })
  }

  onNavigation(url) {
    Taro.navigateTo({ url })
  }

  onOpenMap() {
    const { apartment, map } = this.state
    const { latitude, longitude } = map
    const { address } = apartment

    Taro.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 18,
      address: address,
    })
  }

  onCreateFavorite() {
    const { apartment } = this.state
    const { id } = apartment

    this.props.dispatchFavoriteCreate({ id })
      .then(() => this.setState({ apartment: { ...apartment, isCollect: true } }))
  }

  onDeleteFavorite() {
    const { apartment } = this.state
    const { id } = apartment

    this.props.dispatchFavoriteDelete({ id })
      .then(() => this.setState({ apartment: { ...apartment, isCollect: false } }))
  }

  render() {
    const { apartments } = this.props
    const { apartment, map, publicMatch_list , buttons } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, special, types, apartmentTitle, tags, desc,
      notices, cbds, intro, rules, facilitys, position, cover } = apartment

    const BrandingStyle = {
      backgroundColor: "rgb(248,248,248)",
      borderRadius: "12px",
    }

    const textDeal = {
      wordBreak: "break-all",
      textIndent: "10px"
    }

    const PublicConfiguration = {
      backgroundColor: "rgba(248, 248, 248, 1)",
      borderRadius: "12px",
      padding: " 2px 6px"
    }

    const ScrollWrapStyle = {
      height: '210px',
      whiteSpace: "nowrap",
    }


    const imageStyle = {
      width: '300px',
      height: Taro.pxTransform(346),
      display: "inline-block",
    }


    return <ApartmentContainer
      swipers={swipers}
      isCollect={isCollect}
      onCreateFavorite={this.onCreateFavorite}
      onDeleteFavorite={this.onDeleteFavorite}
    >

      <TabBar
        show
        hasShare
        hasContact
        buttons={buttons}
        onClick={this.onClick}
      />

      {/* 头部 */}
      <View className='text-bold text-huge'>{title}</View>
      <View className='text-secondary text-normal'>{intro}</View>

      {/* 活动信息 */}
      <View className='mt-2'>
        {rules.length ? rules.map(i =>
          <View key={i.id} className=' mt-2 mr-3 mb-3'>
            <Text className={`text-normal badge badge-${i.type}`}> #{ACTIVITY_TYPE_DIST[i.type]['message']}#</Text>
            <Text className='text-secondary text-small ml-2'>{i.content}</Text>
          </View>
        ):<View className='text-secondary'>暂无相关活动信息</View>  
      }
      </View>
      <View className='at-row at-row--wrap'>

      </View>


      <View style={BrandingStyle}>
        <Tag className='my-3' active circle>
          <View className='at-row  at-row__align--center text-secondary'>

            <Image className='ml-4' src='https://images.gongyuabc.com//image/free.png' style='width:18px;height:18px'></Image>
            <View className='ml-2'>100%免中介费</View>
            <Image className='ml-4' src='https://images.gongyuabc.com//image/home.png' style='width:18px;height:18px'></Image>
            <View className='ml-2'>严选厦门3万+房源</View>

          </View>
        </Tag>
      </View>


      {/* 地图 */}
      <View className='at-row at-row__align--center mb-2'>
        <View className='at-col at-col-1 mt-1'>
          <Image src='https://images.gongyuabc.com//image/path.png' style='width:12px;height:16px'></Image>
        </View>
        {
          position ?<View className='at-col at-col-3 text-large text-secondary  ml-1'>{position}</View> : <View className='text-secondary'>暂无相关位置信息</View>
        }
        
      </View>

      {/* 公寓列表 */}

      <View style={ScrollWrapStyle} className='at-col' >
        <ScrollView scrollX>
          {types && types.map((i, index) =>
            <View style={imageStyle} key={i.id} className={`${index + 1 != types.length && 'border-bottom'} at-col at-col-5 pr-3  mt-2 `}>
              <View >
                <ApartmentTypeItem apartmentDetail item={i} />
              </View>
            </View>)}
        </ScrollView>
      </View>

      {/* 户型 */}


      <View>
        <View className='text-bold text-huge mt-2 mb-3'>公寓信息</View>
        <View className='at-row at-row__align--center  at-row__justify--between my-2'>
          <View>
            <View className='at-row at-row__align--center'>
              <View className='at-col'>
                <AtAvatar circle image={cover} />
              </View>
              <View>
                <View className='text-normal ml-2'>{title}</View>
                <View className='text-normal text-secondary ml-2'>{tags}</View>
              </View>
            </View>

          </View>
        </View>
        {
          desc ? <View className='text-secondary text-normal' style={textDeal}>{desc}</View> : <View className='text-secondary'>暂无相关描述</View>
        }
        
        {/* 公共配置 */}

        <View className='at-row at-row--wrap mt-3 mb-3'>
          {publicMatch_list && publicMatch_list.map(i =>
            <View key={i.title} className='at-col at-col-1 text-center at-col--auto  mr-4'>
              <Image src={i.icon} mode='aspectFit' style={{ height: '35px', width: '35px' }} />
              <View className='text-small'>{i.title}</View>
            </View>
          )}

          {publicMatch_list && publicMatch_list.length > 5 && <View style={PublicConfiguration} className='text-center'>
            <View onClick={this.onOpenAllMatching} style={{ height: '35px', width: '35px' }}>...</View>
            <View className='text-small'>更多</View>
          </View>}
        </View>

      </View>


      {/* 公寓详情 */}



      {/* 特色服务 */}
      <View className='text-normal mt-2'>
        {special.length && <View className='text-secondary at-col-3 mr-2'>特色服务：</View>}
        <View className='at-row at-row--wrap'>
          {special.map(i => <View key={i} className='mr-2'>{i}</View>)}
        </View>
      </View>

      {/* 位置信息 */}
      <View className='text-bold text-huge mt-4'>位置信息</View>
      <Map
        className='mt-2'
        showLocation
        markers={markers}
        latitude={latitude}
        longitude={longitude}
        style={{ width: '100%' }}
        onClick={this.onOpenMap}
      />

      {/* 周边生活 & 附近交通 */}
      <View className='at-row mt-2'>
        <View className='at-col text-secondary text-normal mr-2'>附近商圈</View>
        <View>
          <View className='text-normal'>{cbds.join('、')}</View>
        </View>
      </View>

      {/* 用户须知 */}
      {/* 左分3栏，右分9栏 */}
      {/* 右边里面各自分为两栏并居中*/}
      {notices.length > 0 && <View className='text-bold text-huge mt-4'>用户须知</View>}
      {notices.map((i, index) =>
        <View key={i.id} className={`at-row at-row__align--center ${index + 1 !== notices.length && 'border-bottom'} py-2`}>
          <View className='text-secondary at-col-3'>
            <View className='at-row at-row__justify--center '>
              <ABCIcon icon={APARTMENT_NOTICE_DIST[i.id].icon} color={COLOR_GREY_2} size='30' />
            </View>
            <View className='at-row at-row__justify--center '>
              <View className='text-small'>{APARTMENT_NOTICE_DIST[i.id].message}</View>
            </View>
          </View>
          <View className='at-col-9 at-row at-row--wrap'>
            {i.word.map(w => <View key={w} className='text-normal at-col-6 text-center'>{w}</View>)}
          </View>
        </View>
      )}

      {/* 其他公寓 */}
      {city &&
        <View>
          <View className='text-bold text-huge mt-4 mb-3'>看了又看</View>
          <ApartmentList
            mini
            key={apartments.type}
            type={apartments.type}
            items={apartments.list}
            defaultPayload={{ city }}
            dispatchList={this.props.dispatchRecommendHouseType}
          />
        </View>
      }

    </ApartmentContainer>
  }
}

export default ApartmentShow
