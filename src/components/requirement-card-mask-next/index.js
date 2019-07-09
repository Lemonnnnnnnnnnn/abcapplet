// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon ,AtButton,AtTag } from 'taro-ui'

// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'//遮盖层
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'

class RequirementCardMaskNext extends BaseComponent {
  static defaultProps = {
    timeTagList:'',
    peopleTagList: '',

  }

  onShowPrice(){
    console.log("点击")
    this.setState({
      showPrice:true
    })
  }

  render() {
    let { show } = this.props
    return show &&
    <View className='apartment-mask'>

      {/* 主体内容 */}
      <Board fixed='top' border='top'>

        <View className='page-requirementnext'  >

          {/* 公寓头部 */}
          <View className='at-row at-row__justify--between p-3 mt-1 '>
            <View className='at-col at-col-8'></View>
            <View className='at-col at-col-3 ml-4 mt-2' onClick={this.props.onCloseNext}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          <View className='mt-5'></View>
            {/* 表单部分 */}
            <View className='mt-3'>
                <View className='at-row at-row__justify--center mt-5 '>
                     <View className='at-col at-col-2 text-small mt-1'>租房预算：</View>
                     <View className='at-col at-col-7 ml-1 pr-1'>
                         <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                            <View className='text-small '>无</View>
                           <AtIcon  value='chevron-down' size='15' onClick={this.props.onShowPrice} />
                         </Board>
                    </View>
                </View>
            </View>

            <View className='mt-3'>
                <View className='at-row at-row__justify--center mt-2 '>
                     <View className='at-col at-col-2 text-small mt-1'>目标区域：</View>
                     <View className='at-col at-col-7 ml-1 pr-1'>
                         <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                            <View className='text-small '>无</View>
                            <AtIcon
                              value='chevron-down'
                              size='15'
                            />
                         </Board>
                    </View>
                </View>
            </View>

            <View className='mt-3'>
                <View className='at-row at-row__justify--center mt-2 '>
                     <View className='at-col at-col-2 text-small mt-1'>入住时间：</View>
                     <View className='at-col at-col-7 ml-1 pr-1'>
                        <View className='at-row at-row__justify--around ml-2 '>


                      {this.state.timeTagList.map((item, index) => (
                        <View className='at-row at-row__justify--around ml-2 ' key={index}>
                          <AtTag
                            type='primary'
                            size='small'
                            name={item.name}
                            active={item.active}
                            circle
                            onClick={this.props.onTimeSelect}
                          >{item.name}</AtTag>
                       </View>
                      ))}


                        </View>
                    </View>
                </View>
            </View>
            <View className='mt-3'>
                <View className='at-row at-row__justify--center mt-2 '>
                     <View className='at-col at-col-2 text-small mt-1'>入住人数：</View>
                     <View className='at-col at-col-7 ml-1 pr-1'>
                        <View className='at-row at-row__justify--around ml-2 '>

                        {this.state.peopleTagList.map((item, index) => (
                        <View className='at-row at-row__justify--around ml-2 ' key={index}>
                          <AtTag
                            type='primary'
                            size='small'
                            name={item.name}
                            active={item.active}
                            circle
                            onClick={this.props.onPeopleSelect}
                          >{item.name}</AtTag>
                       </View>
                      ))}
                        </View>
                    </View>
                </View>
            </View>

            <View className='mt-3'>
                <View className='at-row at-row__justify--center mt-2 '>
                     <View className='at-col at-col-2 text-small mt-1'>意向户型：</View>
                     <View className='at-col at-col-7 ml-1 pr-1'>
                         <Board className='at-row at-row__align--center at-row__justify--between ml-2 pl-2 pr-2' style=' width: 25vw;height: 10px;'>
                            <View className='text-small '>无</View>
                            <AtIcon
                              value='chevron-down'
                              size='15'
                            />
                         </Board>
                    </View>
                </View>
            </View>

             {/*  {按钮部分} */}
             <View className='mt-5'>
              <View   className='select-button   at-row at-row__justify--center '>
                  <AtButton
                    circle
                    onClick={this.props.onFinish}
                    className='mx-2 btn-yellow active'>提交需求
                  </AtButton>
                </View>
            </View>

       </View>

      </Board>
        <View>
      </View>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default RequirementCardMaskNext
