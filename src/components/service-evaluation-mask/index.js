// Taro 相关
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtIcon, AtTextarea, AtButton } from 'taro-ui'


// 自定义组件
import Board from '@components/board'
import Masks from '@components/masks'
import ABCIcon from '@components/abc-icon'
import Component from '@components/base'

// 自定义常量
import { COLOR_YELLOW, COLOR_GREY_7, COLOR_GREY_2 } from '@constants/styles'
import { BUSINESS_LIKEABILITY_DIST } from '@constants/appointment'
import { PAYLOAD_REVULUTION_CREAT } from '@constants/api'
import { connect } from '@tarojs/redux'
import * as appointmentActions from '@actions/appointment'

import {
  LOCALE_APPOINTMENT_SERVICE,
  LOCALE_APPOINTMENT_SERVICE_EVALUTION
} from '@constants/locale'

@connect(state => state, {
  ...appointmentActions,
})

class AppointmentRevolution extends Component {
  static defaultProps = {
    show: false,
    Payload: PAYLOAD_REVULUTION_CREAT,

    score: '',
    lists: '',
  }
  state = {
    localComment: 0,
    localText: '',
  }

  //分数，星星数
  onScoreChange(score) {
    const { payload } = this.state
    this.setState({
      score: score,
      payload: { ...payload, score: score, appointment_id: this.props.appointment_id }
    })
  }

  // 本地存储数据
  onComment() {
    const { payload } = this.state
    this.setState({ localComment: payload.score, localText: payload.comment })
  }


  //获得评论
  onRemarkChange({ currentTarget: { value } }) {
    let { payload } = this.state
    this.setState({ payload: { ...payload, comment: value, appointment_id: this.props.appointment_id } })
  }
  //提交评价
  onClickPost() {
    let { payload } = this.state
    const { onEvalution, dispatchRevelutionComment, onClose } = this.props
    const { comment, score } = payload

    // 判断是否评价是否为空

    if (!comment || !score) {
      Taro.showToast({
        title: '您的评价信息尚未填写完整',
        icon: 'none',
        duration: 1000
      })
    } else {
      dispatchRevelutionComment(payload).then(() => {
        this.onComment()
        onEvalution()
        onClose()
      })
    }
  }


  onMaskTouchMove(e) {
    return e.stopPropagation()
  }

  render() {
    const { show, headimgurl, name, service_num, comment_score, appointment_id, comment, haveEvalution } = this.props
    const { score, localComment, localText } = this.state

    var nowScore;

    if (comment) {
      if (!comment.score && haveEvalution) {
        nowScore = localComment
      } else {
        nowScore = comment.score ? comment.score : score
      }
    }

    const textStyle = {
      wordBreak : 'break-all',
      textIndent : '15px',
      height : Taro.pxTransform(300)
    }


    return show && <View className='apartment-mask' onTouchMove={this.onMaskTouchMove}>
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
              <View className='text-small text-muted mt-1'>{LOCALE_APPOINTMENT_SERVICE}{service_num}次</View>
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
            <View className='text-large text-bold'>{LOCALE_APPOINTMENT_SERVICE_EVALUTION} </View>
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
                onClick={this.onScoreChange.bind(this, i)}
                color={i <= nowScore ? COLOR_YELLOW : COLOR_GREY_7}
              />
            )}
          </View>

          {/* 输入框 */}

          <View className='mt-4 '>
            {
              haveEvalution || comment.score ?
                <View className='text-normal p-3 mt-3' style={textStyle}>{comment.remark || localText}</View>
                : <AtTextarea
                  fixed
                  count={false}
                  value={comment.remark}
                  maxLength={200}
                  className='mt-3 textarea text-normal p-3'
                  onChange={this.onRemarkChange}
                  placeholder='评价'
                />
            }

          </View>
          {/* 按钮 */}
          <View className='mt-4' hidden={haveEvalution || comment.score ? true : false}>
            <AtButton
              onClick={this.onClickPost.bind(this, appointment_id)}
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
