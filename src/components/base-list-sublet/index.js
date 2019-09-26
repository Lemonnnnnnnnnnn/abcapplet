import BaseComponent from '@components/base'
import { PAGE_SIZE } from '@constants/api'
import Taro from '@tarojs/taro'

class BaseListSublet extends BaseComponent {
  static defaultProps = {
    items: [],
    show: true,
    message: '暂无数据',
    defaultPayload: {},
    dispatchList: null,
    size: 6,
    dispatchNextPageList: null,
    initReset: true,
  }

  state = {
    page: 1,
    loading: false,
    hasMore: true,
    payload: {},
    latitude: 0,
    longitude: 0,
    count: 0,
  }


  async componentDidMount() {
    const { defaultPayload } = this.props
    await Taro.getLocation({
      success: (res) => { this.onReset({ ...defaultPayload, latitude: res.latitude, longitude: res.longitude }) },
      fail: () => { this.onReset({ ...defaultPayload, latitude: 0, longitude: 0 }) }
    }).catch((err) => { console.log(err) })
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
    let { size } = this.props

    if (!hasMore || loading || !this.props.dispatchList) return;

    this.setState({ loading: true })

    payload = { ...payload, page: page }


    const onSuccess = res => {
      const listNum = res.data.data.total || res.data.data.list.total
      this.setState({
        page: page + 1,
        loading: false,
        hasMore: listNum > size * page,
      })
    }


    const onFail = () => this.setState({
      loading: false,
      hasMore: false,
    })


    page === 1
      ? this.props.dispatchList(payload).then(onSuccess).catch(onFail)
      : this.props.dispatchNextPageList(payload).then(onSuccess).catch(onFail)

  }
}

export default BaseListSublet
