import BaseComponent from '@components/base'
import { PAGE_SIZE } from '@constants/api'
import Taro from '@tarojs/taro'

class BaseList extends BaseComponent {
  static defaultProps = {
    items: [],
    show: true,
    message: '暂无数据',
    defaultPayload: {},
    dispatchList: null,
    pageSize: PAGE_SIZE,
    dispatchNextPageList: null,
    initReset: true,
  }

  state = {
    page: 1,
    loading: false,
    hasMore: true,
    payload: {},
    latitude:0,
    longitude:0,
    count:0,
  }


  async componentDidShow() {
    const { defaultPayload } = this.props
    const { count } = this.state
    const { latitude, longitude } = await Taro.getLocation()

    const {is_select} = defaultPayload
    if(is_select===1 && count === 0){
      this.onReset({...defaultPayload,latitude,longitude})
      this.setState({
        count:1
      })
    }
    if(!is_select){
      this.onReset()
    }
  }

  onReset(payload) {
    payload = payload || this.props.defaultPayload

    this.setState({
      page: 1,
      payload,
      loading: false,
      hasMore: true,
    }, () => this.onNextPage())
  }

  onNextPage() {
    let { page, payload, loading, hasMore } = this.state
    let { pageSize } = this.props

    if (!hasMore || loading || !this.props.dispatchList) return;

    this.setState({ loading: true })

    payload = { ...payload, current_page: page }

    const onSuccess = res => this.setState({
      page: page + 1,
      loading: false,
      hasMore: res.data.data.total > pageSize * page,
    })

    const onFail = () => this.setState({
      loading: false,
      hasMore: false,
    })

    page === 1
      ? this.props.dispatchList(payload).then(onSuccess).catch(onFail)
      : this.props.dispatchNextPageList(payload).then(onSuccess).catch(onFail)
  }
}

export default BaseList
