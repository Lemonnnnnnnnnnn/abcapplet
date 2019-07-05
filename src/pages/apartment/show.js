// Taro 相关
import Taro, { Component } from '@tarojs/taro'
import { View, Map, Image } from '@tarojs/components'

// Redux 相关
import { connect } from '@tarojs/redux'
import * as userActions from '@actions/user'
import * as apartmentActions from '@actions/apartment'

// 自定义组件
import Tag from '@components/tag'
import ABCIcon from '@components/abc-icon'
import ApartmentList from '@components/apartment-list'
import ApartmentTypeItem from '@components/apartment-type-item'
import ApartmentContainer from '@components/apartment-container'
// 自定义变量
import { COLOR_GREY_2 } from '@constants/styles'
import { PAGE_ACTIVITY_APARTMENT } from '@constants/page'
import { APARTMENT_NOTICE_DIST, ACTIVITY_TYPE_DIST } from '@constants/apartment'

const city = userActions.dispatchUser().payload.citycode
@connect(state => state, {
  ...userActions,
  ...apartmentActions,
})
class ApartmentShow extends Component {
  config = {
    navigationBarTitleText: '公寓详情',
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
    }
  }

  async componentDidMount() {
    const { id = 255 } = this.$router.params

    const { data: { data } } = await this.props.dispatchApartmentShow({ id })

    this.setState({
      apartment: {
        id: data.id,
        title: data.title,
        intro: data.one_word,
        // address: data.address,
        cbds: data.cbd_list,
        types: data.house_types,
        isCollect: data.is_collect,
        rules: data.extend_info.rules,
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
    const { apartment, map } = this.state
    const { latitude, longitude, markers } = map
    const {
      title, swipers, isCollect, special, types,
      notices, cbds, intro, hotRules, rules, facilitys } = apartment

    const colors = ['blue', 'red', 'yellow']

    return <ApartmentContainer
      swipers={swipers}
      isCollect={isCollect}
      onCreateFavorite={this.onCreateFavorite}
      onDeleteFavorite={this.onDeleteFavorite}
    >

      {/* 头部 */}
      <View className='text-bold text-huge'>{title}</View>
      <View className='text-secondary text-normal'>{intro}</View>

      {/* 活动信息 */}
      <View className='at-row at-row--wrap'>
        {rules.map(i =>
          <View key={i.id} className='at-col mt-2 mr-3'>
            <View className='at-row at-row__align--center'>
              <View className={`badge badge-${i.type}`}>
                {ACTIVITY_TYPE_DIST[i.type]['simple']}
              </View>
              <View className='text-secondary text-small ml-1'>{i.content}</View>
            </View>
          </View>
        )}
      </View>

      {/* 品牌宣传 */}
      <Tag className='my-3' type='yellow' active circle>
        <View className='at-row at-row__justify--around at-row__align--center'>
          <View>100%免中介费</View>
          <ABCIcon icon='lens' color='#FFEBA5' size='8' />
          <View>严选厦门3万+房源</View>
          <ABCIcon icon='lens' color='#FFEBA5' size='8' />
          <View>预定保障</View>
        </View>
      </Tag>

      {/* 文章相关 */}
      <View className='at-row'>
        {hotRules.map((i, index) =>
          <Tag
            small active
            circle key={i.id}
            type={colors[index % 3]}
            onClick={this.onNavigation.bind(this, i.url)}
          >#{i.title}#</Tag>
        )}
      </View>

      {/* 户型 */}
      <View className='mt-2'>
        {types.map((i, index) =>
          <View key={i.id} className={`${index - 1 !== types.length} border-bottom`}>
            <ApartmentTypeItem item={i} />
          </View>)}
      </View>


      {/* 公寓详情 */}
      <View className='text-bold text-huge mt-4'>公寓详情</View>
      <View className='text-secondary text-normal'>融寓县后店释放的房源为标准复式LOFT，融寓县后店释放的房源为标准复式LOFT，融寓县后店释放的房源为标准复式LOFT。融寓县后店释放的房源为标准复式LOFT。</View>

      {/* 公共配置 */}
      <View className='at-row at-row--wrap mt-2'>
        {facilitys.map(i =>
          <View key={i.title} className='at-col-3 text-center mt-2'>
            <Image src={i.icon} mode='aspectFit' style={{ height: '30px', width: '30px' }} />
            <View className='text-small'>{i.title}</View>
          </View>
        )}
      </View>

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
        <View className='at-col text-secondary text-normal mr-2'>附近商圈：</View>
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
          <View className='text-bold text-huge mt-4'>看了又看</View>
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
