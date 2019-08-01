// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtButton, AtTag } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { LOCALE_ROOM_BUDGE, LOCALE_ROOM_CBD, LOCALE_ROOM_LIVINFTIME, LOCALE_ROOM_PEOPLE, LOCALE_ROOM_HOUSETYPE } from '@constants/locale'

class RequirementCardMaskNext extends BaseComponent {
  static defaultProps = {
    timeTagList: '',
    peopleTagList: '',

  }

  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    let { show, roomDetail, floorDetail } = this.props

    return show &&
      <View className='apartment-mask' onTouchMove={this.onMaskTouchMove} >

        {/* 主体内容 */}
        <Board fixed='top' border='top'>

          <View className='page-requirementnext' style='height:120vw;width: 100vw' >

            {/* 公寓头部 */}
            <View className='at-row at-row__justify--between   '>
              <View className='at-col at-col-9'></View>
              <View className='at-col at-col-3 ml-4 mt-3' onClick={this.props.onCloseNext}>
                <ABCIcon icon='close' color={COLOR_GREY_2} />
              </View>
            </View>


            {/* 表单部分 */}
            <View className='mt-4' style='position:relative;'>
              <View style='position:absolute;'>
                <View className='mt-5  ml-4' style='width:80vw;top:30vw'>
                  <View className='at-row at-row__justify--center mt-5' >
                    <View className='at-col at-col-2 text-small mt-1'>{LOCALE_ROOM_BUDGE}：</View>
                    <View className='at-col at-col-7 ml-3 pr-1' onClick={this.props.onShowPrice} >
                      <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                        <View className='text-normal ' >{this.props.budgetDetail}</View>
                        <AtIcon value='chevron-down' size='15' />
                      </Board>
                    </View>
                  </View>
                </View>

                <View className='mt-4  ml-4' style='width:80vw;'>
                  <View className='at-row at-row__justify--center mt-4 '>
                    <View className='at-col at-col-2 text-small mt-1' >{LOCALE_ROOM_CBD}：</View>
                    <View className='at-col at-col-7 ml-3 pr-1' onClick={this.props.onShowCbd} >
                      <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                        <View className='text-normal overtext'>{this.props.cdbDetailDetail}</View>
                        <AtIcon value='chevron-down' size='15' />
                      </Board>
                    </View>
                  </View>
                </View>

                <View className='mt-4  ml-4' style='width:80vw'>
                  <View className='at-row at-row__justify--center mt-2 '>
                    <View className='at-col at-col-2 text-small mt-2' > {LOCALE_ROOM_LIVINFTIME}:</View>
                    <View className='at-col at-col-7 ml-3 pr-1'>
                      <View className='at-row at-row__justify--around ml-3 '>

                        {this.state.timeTagList.map((item, index) => (
                          <View className='at-row at-row__justify--around ml-2 ' key={index}>
                            <AtTag
                              type='primary'
                              size='small'
                              name={item.name}
                              active={item.active}
                              circle
                              onClick={this.props.onTimeSelect.bind(this, item)}
                            >{item.name}</AtTag>
                          </View>
                        ))}


                      </View>
                    </View>
                  </View>
                </View>
                <View className='mt-4  ml-4' style='width:80vw'>
                  <View className='at-row at-row__justify--center mt-2 '>
                    <View className='at-col at-col-2 text-small mt-1'>{LOCALE_ROOM_PEOPLE}：</View>
                    <View className='at-col at-col-7 ml-3 pr-1'>
                      <View className='at-row at-row__justify--around ml-3 '>

                        {this.state.peopleTagList.map((item, index) => (
                          <View className='at-row at-row__justify--around ml-2 ' key={index}>
                            <AtTag
                              type='primary'
                              size='small'
                              name={item.name}
                              active={item.active}
                              circle
                              onClick={this.props.onPeopleSelect.bind(this, item)}
                            >{item.name}</AtTag>
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>

                <View className='mt-4  ml-4' style='width:80vw'>
                  <View className='at-row at-row__justify--center mt-2 '>
                    <View className='at-col at-col-2 text-small mt-1'>{LOCALE_ROOM_HOUSETYPE}：</View>
                    <View className='at-col at-col-7 ml-3 pr-1' onClick={this.props.onShowHouse}>
                      <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                        {
                          roomDetail === "不限" &&  floorDetail === "不限" ?
                            <View className='text-normal '>不限</View>
                            :
                            <View className='text-normal '>{this.props.roomDetail + "、" + this.props.floorDetail}</View>
                        }
                        <AtIcon
                          value='chevron-down'
                          size='15'

                        />
                      </Board>
                    </View>
                  </View>
                </View>

                {/*  {按钮部分} */}
                <View className='mt-5 ' style='width:100vw '>
                  <View className='select-button at-row at-row__justify--center '>
                    <AtButton
                      circle
                      onClick={this.props.onFinish}
                      className='mx-2 btn-yellow active'>提交需求
                    </AtButton>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Board>
        <View>
        </View>

        {/* 遮罩层 */}
        <Masks show={show} style='position:relative;z-index:0' />
      </View>
  }
}

export default RequirementCardMaskNext
