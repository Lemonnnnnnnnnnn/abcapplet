// Taro 相关
import Taro from '@tarojs/taro'

import { View, Text, Icon, ScrollView } from '@tarojs/components'
import { AtTabs ,AtButton} from 'taro-ui'
import classNames from 'classnames'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2,TABS_SELECT_ITEM_HEIGHT } from '@constants/styles'
import { LOCALE_RESET,LOCALE_CONFIRM, LOCALE_ROOM_CBD} from '@constants/locale'


class RequirementCbdMask extends BaseComponent {
  static defaultProps = {
    show: true,
    apartments: [],
    headerIndex:'price',
    priceDist: [],
    tabItemHeight: TABS_SELECT_ITEM_HEIGHT,

  }
  render() {
    let { show ,cbdDist} = this.props
    const { current,currentCbdTwo,cbdListItem,placeSelected,className,tabItemHeight} = this.props

    cbdDist !==undefined && cbdDist !==null &&  delete cbdDist[0]
    const nowCbdDist = cbdDist
    const tabsHeight =  (cbdDist !==undefined && cbdDist !==null)? Taro.pxTransform(tabItemHeight * cbdDist.length+20):'0'

    const rootClassName = ['at-row', 'select-cbd']
    const classObject = {}

    return show && <View className='apartment-mask'>

    <View className={classNames(rootClassName, classObject, className)}>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between mb-3'>
            <View className='text-bold'>{LOCALE_ROOM_CBD}</View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
           {/* 主体 */}
           {/* 第一层 */}
           <View className='at-row at-row__justify--around'>
            <View className='at-col-3'>
              <AtTabs
                scroll
                tabDirection='vertical'
                tabList={nowCbdDist}
                height={tabsHeight}
                onClick={this.props.onChangeCbd}
                current={this.props.current}
              />
          </View>
             {/* 第二层 */}
          <View className='at-col-3'>
              {current != -1&&<AtTabs
                scroll
                tabDirection='vertical'
                tabList={cbdDist[current].list}
                height={tabsHeight}
                onClick={this.props.onChangeCbdTwo}
                current={currentCbdTwo}
              />}
          </View>
        {/* 第三层 */}
         <View className='at-col-3'>
         {cbdListItem !== undefined &&<ScrollView scrollY >{cbdListItem.map(i =>
            <View key={i.id}
              onClick={this.props.onChangeCbdThree.bind(this, i)}
              className={`ml-3 multi-${placeSelected.includes(i.id) ? 'selected' : 'unselect'}`}
            >
              <Icon />
              <Text className='ml-2'>{i.title}</Text>
            </View>)}
          </ScrollView>}
          </View>

        </View>
          {/* 按钮 */}
          <View>
          <View className='select-button my-2 at-row at-row__justify--between'>
            <View className='at-col at-col-4'>
              <AtButton
                circle
                onClick={this.props.onResetClickC}
                className='ml-2 btn-yellow'
              >
                {LOCALE_RESET}
              </AtButton>
            </View>
            <View className='at-col at-col-8'>
              <AtButton
                circle
                onClick={this.props.onComfireCbd}
                className='mx-2 btn-yellow active'
              >
                {LOCALE_CONFIRM}
              </AtButton>
            </View>
          </View>
          </View>
        </View>
      </Board>
      </View>
      {/* 遮罩层 */}
      <Masks show={show} style='position:relative;z-index:1'/>
    </View>
  }
}

export default RequirementCbdMask
