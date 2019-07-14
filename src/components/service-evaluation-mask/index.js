// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon ,AtTextarea, AtButton } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import Component from '@components/base'

// 自定义常量
import { COLOR_YELLOW , COLOR_GREY_7 ,COLOR_GREY_2} from '@constants/styles'
import { BUSINESS_LIKEABILITY_DIST } from '@constants/appointment'

import { PAYLOAD_REVULUTION_CREAT } from '@constants/api'

import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

@connect(state => state , {
  ...appointmentActions,
})

class AppointmentRevolution extends Component {
  static defaultProps = {
    show: false,
    Payload:PAYLOAD_REVULUTION_CREAT,
    score:'',
    lists:''
}

//分数，星星数
onScoreChange(score) {
  const { payload } = this.state
  this.setState({
    score:score,
    payload: { ...payload, score:score ,appointment_id:this.props.appointment_id}
  })

}
//获得评论
onRemarkChange({ currentTarget: { value } }){
  let { payload } = this.state
  this.setState({ payload: { ...payload, comment: value ,appointment_id:this.props.appointment_id} })
}
//提交评价
onClickPost(){
  let { payload } = this.state
  this.props.dispatchRevelutionComment(payload)
}

  render() {
    const { show , headimgurl,name,service_num,comment_score,appointment_id ,comment} = this.props
    const { score } = this.state
    var nowScore;
    nowScore =  comment !== undefined ? (
        comment.score !== undefined && comment.score === 0 ? score : comment.score
       ) : score;

    return show && <View className='apartment-mask'>
      {/* 主体内容 */}
      <Board fixed='bottom' border='top'>
        <View className='m-3'>
          {/* 公寓头部 */}
          <View className='at-row at-row__justify--between'>
            <View className='text-bold'></View>
            <View onClick={this.props.onClose}>
              <ABCIcon icon='close' color={COLOR_GREY_2} />
            </View>
          </View>
          <View className='at-row'>
            <View className='at-col-3 ml-1'>
              <image src={headimgurl} style='width:70PX;height:70PX;background:rgba(255,255,255,1);border-radius:50%;'></image>
            </View>
            <View className='at-col-6 ml-2'>
              <View className='mt-1'>{name}</View>
              <View className='text-small text-muted mt-1'>已带看服务{service_num}次</View>
              <View className='at-row'>
                <AtIcon
                  value='star-2'
                  size='11'
                  color='#FFCB1F'
                />
                <View className='text-small text-muted mt-1 ml-1'>{comment_score}分</View>
              </View>
            </View>
          </View>
          <View className='at-row mt-3 ml-2  at-row__align--end'>
            <View className='text-large text-bold'>管家服务评价</View>
            <View className='text-large ml-3' style='color:#FFCB1F' >
               {BUSINESS_LIKEABILITY_DIST[nowScore].message}
             </View>

          </View>
          <View className='mt-4' >
            {[1, 2, 3, 4, 5].map(i =>
              <AtIcon
                size='38'
                key={i}
                value='star-2'
                className='ml-3'
                onClick={this.onScoreChange.bind(this,i)}
                color={i<=nowScore?COLOR_YELLOW:COLOR_GREY_7}
              />
            )}
          </View>

          {/* 输入框 */}

          <View className='mt-4 '>
            <AtTextarea
              fixed
              count={false}
              value={comment.remark}
              maxLength={200}
              className='mt-3 textarea text-normal p-3'
              onChange={this.onRemarkChange}
              placeholder='评价'
            />
          </View>
          {/* 按钮 */}
          <View className='mt-4'>
            <AtButton
              onClick={this.onClickPost.bind(this,appointment_id)}
              circle
              type='primary'
              >匿名评价</AtButton>

          </View>
        </View>
      </Board>

      {/* 遮罩层 */}
      <Masks show={show} />
    </View>
  }
}

export default AppointmentRevolution
