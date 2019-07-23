// Taro 相关
import Taro from '@tarojs/taro'
import { View, Input } from '@tarojs/components'
import { AtIcon , AtButton , AtTag} from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import Component from '@components/base'

// 自定义常量
import { COLOR_YELLOW , COLOR_GREY_7 ,COLOR_GREY_2} from '@constants/styles'
import { APPOINTMENT_LIKEABILITY_DIST } from '@constants/appointment'
import { PAYLOAD_INTENTION_CREATE ,PAYLOAD_INTENTION_ROOM_SHOW} from '@constants/api'

import {
  LOCALE_APPOINTMENT_INTENTION_DU,
  LOCALE_APPOINTMENT_INTENTION_LOCAL,
  LOCALE_APPOINTMENT_INTENTION_FIND,
  LOCALE_APPOINTMENT_INTENTION_LOOKROOM,
} from '@constants/locale'

import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

@connect(state => state , {
  ...appointmentActions,
})

class AppointmentIntention extends Component {
  static defaultProps = {
    show: false,

    active:false,
}
state = {
  score:'',
  selectRoom:[],
  roomList:[],
  payload:PAYLOAD_INTENTION_CREATE,//appointment_id: 0, score: 1, room_ids:''
  Payloadlist:PAYLOAD_INTENTION_ROOM_SHOW,//行程下相关的房间列表appointment_id: 0, room_no:''
}
componentDidMount(){
  const { roomList } = this.state
  this.setState({
    roomList :roomList.map( i=> ({ ...i, active : false }))
  }
  )
}
//分数，星星数
onScoreChange(value) {
  const { payload,Payloadlist } = this.state
  this.setState({
    score:value,
    payload:{...payload, score:value ,appointment_id:this.props.appointment_id,room_ids:''},
  })
  console.log(this.props)
  if(value>=4){
    this.props.dispatchIntentionList({...Payloadlist,appointment_id:this.props.appointment_id}).
    then((res)=>
      this.setState({
      roomList:res.data.data.list
    })
    )

  }
}
onSelectClick(id){
  const { roomList } = this.state
  this.setState({
    roomList:roomList.map(i => i.id == id?{ ...i,active:!i.active }:i)
  })

}
//提交
onClickPost(){
  const { payload , roomList  ,selectRoom} = this.state
  roomList.map(i => {
    if(i.active==true)
      selectRoom.push(i.no)
  })
  var room_ids = selectRoom.join(',')
  this.props.dispatchIntentionComment({...payload,room_ids:room_ids})
}

  render() {
    const { show,intention,appointment_id, apartment_title,house_type_title} = this.props
    const { score , roomList} = this.state
    var nowIntention;
    nowIntention =  intention===0?score:intention;
    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top' >
        <View className='m-3'>
          {/* 头部 */}
          <View className='at-row at-row__justify--between'>
            <View className='text-bold'></View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          <View className='at-row at-row__align--end'>
            <View className='text-large  text-bold'>{LOCALE_APPOINTMENT_INTENTION_DU}</View>
            <View className='text-normal ml-2' style='color:#FFC919'>{APPOINTMENT_LIKEABILITY_DIST[nowIntention].message}</View>
          </View>

          </View>
          <View className='mt-4 mb-3' >
            {[1, 2, 3, 4, 5].map(i =>
              <AtIcon
                size='38'
                key={i}
                value='heart-2'
                className='ml-3'
                onClick={this.onScoreChange.bind(this,i)}
                color={i<=nowIntention?COLOR_YELLOW:COLOR_GREY_7}
              />
            )}
          </View>
          <View className='mt-4' hidden={nowIntention>=4 &&  intention ===0 ? false:true}>
            <View className=''>
              <View className='at-row ml-3'>
                <View className='button-yellow mt-1'></View>
                <View className='text-small text-bold ml-2'>{LOCALE_APPOINTMENT_INTENTION_LOCAL}</View>
              </View>
              <View className=''>
                {/* 搜索  先隐藏未实现搜索功能 hidden='true*/}
              <View className=' at-row  m-3' hidden='true'>
                <View className='mt-1 at-row at-row  at-row__align--center button--shallow-grey ' style='height:30px; width:75%;border-radius:15px;background:#F8F8F8'>
                  <View className='at-row at-row-5 at-row__align--center'>
                      <View className='ml-2'>
                        <AtIcon value='search' size='15' />
                      </View>
                      <View className='ml-4  text-small'>
                        <Input
                          type='text'
                          placeholder='搜索房间号/户型'
                          value={this.state.value}
                          onChange={this.onHandleChange}
                        />
                      </View>
                  </View>
                </View>
                  <View className='ml-2 mt-1'>
                    <AtButton
                      type='primary'
                      size='small'
                      onClick={this.onActionClick}>{LOCALE_APPOINTMENT_INTENTION_FIND}</AtButton>
                  </View>
              </View>
               {/* 搜索代码结束*/}
              <View className='at-row at-row__align--end ml-4'>
                <View className='text-bold text-normal'>{LOCALE_APPOINTMENT_INTENTION_LOOKROOM}</View>
                <View className='text-muted text-small'>{apartment_title}</View>
                <View className='text-muted text-small ml-2'>{house_type_title}</View>
              </View>

              <View className='at-row '>
                <View className='at-row at-col--wrap '>
                  <View className='m-3 '>
                    {roomList.map(i=>
                      <AtTag
                        active={i.active}
                        circle
                        key={i}
                        name={i.no}
                        className='ml-4 mt-3'
                        onClick={this.onSelectClick.bind(this,i.id)}
                      >{i.no}
                      </AtTag>
                    )}
                  </View>
                </View>
              </View>
          </View>
          </View>
          </View>
          <View className='p-1 m-2' hidden={intention ===0 ? false:true}>
            <AtButton
              circle
              type='primary'
              onClick={this.onClickPost.bind(this,appointment_id)}
            >提交意向</AtButton>
          </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default AppointmentIntention
