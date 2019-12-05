// Taro 相关
import Taro from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

// 自定义组件
import ABCIcon from '@components/abc-icon'
import BaseComponent from '@components/base'

// 自定义常量
import { COLOR_GREY_2 } from '@constants/styles'
import { API_UPLOAD_IMAGE } from '@constants/api'

class ImageUpload extends BaseComponent {
  static defaultProps = {
    placeholer: 6,
  }

  state = {
    index: 0,
    files: [],
    picArr: [],
  }

  componentWillMount(){
    const { placeholer } = this.props

    const files = Array.from({ length: placeholer }).map(() => ({ url: '' }))
    this.setState({ files })
  }

  async onClick() {
    let { files, index, picArr } = this.state
    const { placeholer } = this.props
    let picArrNew = []

    let picArrClone = JSON.parse(JSON.stringify(picArr))
    let indexClone = JSON.parse(JSON.stringify(index))
    let filesClone = JSON.parse(JSON.stringify(files))
    let waitAddNum = 0

    picArrClone = []


    await Taro.chooseImage({
      count: placeholer,
      sizeType: ['compressed'],
      success: (res) => {
        if (indexClone <= placeholer) {
          picArrNew = picArrClone.concat(res.tempFilePaths)
          this.setState({ picArr: picArrNew })
          Taro.showLoading({ title: '正在上传照片' })
        }
      }
    })

    for (let i = 0; i < picArrNew.length; i++) {
      if (index >= placeholer) {
        Taro.showToast({
          title: '上传图片数量达到限制',
          icon: 'none'
        })
        return;
      }

      await Taro.uploadFile({
        name: 'risk',
        url: API_UPLOAD_IMAGE,
        filePath: picArrNew[i],

        success: (res) => {
          if (indexClone < placeholer) {
            Taro.showLoading({ title: '正在上传照片' })
            const file = (JSON.parse(res.data)).data[0]
            filesClone[indexClone] = {
              // files: filesClone[indexClone],
              url: file.path,
            }
            indexClone += 1
            waitAddNum += 1
            this.setState({ files: filesClone, index: indexClone })
          }
        },

        complete: () => {
          if (waitAddNum === picArrNew.length) {
            Taro.hideLoading()
            return
          } else if (indexClone >= 6) {
            Taro.hideLoading()
            Taro.showToast({
              title: '上传图片数量达到限制',
              icon: 'none'
            })
            return
          }
        }
      })
      const picJsonArr = JSON.stringify(filesClone.filter(i => i.url !== '').map(i => i.url))
      this.props.onChange(picJsonArr)
    }
  }

  onDeletePic(key) {
    const { files, index } = this.state
    let filesClone = JSON.parse(JSON.stringify(files))
    let picLen = 0

    filesClone.forEach(i => {
      if (i.url) {
        picLen += 1
      }
    })

    filesClone[key].url = ''

    filesClone.forEach((i, k) => {
      if (i.url && k > 0 && k > key) {
        filesClone[k - 1] = i
      }
    })

    let filesCloneTwo = JSON.parse(JSON.stringify(filesClone))

    filesCloneTwo[picLen - 1].url = ''

    this.setState({ files: filesCloneTwo, index: index - 1 })

    const picJsonArr = JSON.stringify(filesCloneTwo.filter(i => i.url !== '').map(i => i.url))
    this.props.onChange(picJsonArr)

  }

  render() {
    const { files, index } = this.state
    const { text } = this.props
    const closeStyle = {
      position: 'absolute',
      right: Taro.pxTransform(20),
      top: Taro.pxTransform(20),
      padding: Taro.pxTransform(10),
      background: 'rgb(153,153,153)',
      borderRadius: '50%',
      color : '#fff',
      height : Taro.pxTransform(20),
      width : Taro.pxTransform(20)
    }
    return (
      <View className='at-row at-row--wrap'>
        {
          files.map((i, key) =>
            key !== index ?
              <View key={i.id} className='at-col at-col-4' style={{ position: 'relative' }}>
                {
                  i.url ?
                    <View>
                      <View className='upload-image-item at-row at-row__align--center at-row__justify--center' style={{ overflow: 'hidden' }}>
                        <Image lazyLoad src={i.url} mode='widthFix' style={{ width: '80%', height: '80%' }} />
                      </View>
                      <View className='text-small  at-row at-row__align--center at-row__justify--center' style={closeStyle} onClick={this.onDeletePic.bind(this, key)} >
                        {/* <AtIcon value='close' size='10' color='#fff'></AtIcon> */}
                        —
                      </View>
                    </View>
                    :
                    <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                      <Image lazyLoad src={i.url} style={{ width: '80%', height: '80%' }} />
                    </View>
                }
              </View>

              :

              <View className='at-col at-col-4' onClick={this.onClick}>
                <View className='upload-image-item at-row at-row__align--center at-row__justify--center'>
                  <View>
                    <View className='at-row at-row__justify--center'>
                      <ABCIcon icon='add' color={COLOR_GREY_2} size='32' />
                    </View>
                    <View className='text-normal text-secondary mt-2'>{text}</View>
                  </View>
                </View>
              </View>
          )
        }
      </View >
    )
  }
}

export default ImageUpload

