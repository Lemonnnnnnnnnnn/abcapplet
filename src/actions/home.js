import { createAction } from '@utils/redux'

import { GET_HOME_MESSAGE } from '@constants/home'
import { API_INDEXPOST , API_CBD_SHOW  , API_ACTIVITY_SHOW} from '@constants/api'
import { PAGE_CBD_APARTMENT, PAGE_ACTIVITY_APARTMENT, PAGE_ARTICLE_SHOW } from '@constants/page'

// cbd
import { SHOW_CBD } from '@constants/cbd'

// 获取活动详情

import { SHOW_ACTIVITY } from '@constants/activity'

/**
 * 获取banner、热门租房商圈、推荐品牌公寓、活动专区
 */
export const dispatchHomeMsg = payload => createAction({
    payload: { city: payload, },
    method: 'POST',
    type: GET_HOME_MESSAGE,
    url: API_INDEXPOST,
    cb: (res) => {
        let homeArr = {
            hot_cbd : res.data.data.hot_cbd.map(i => ({ ...i, url: `${PAGE_CBD_APARTMENT}?id=${i.id}` })),
            banner : res.data.data.banner,
            hot_activity : res.data.data.hot_activity.map(i => ({ ...i, url: `${PAGE_ACTIVITY_APARTMENT}?id=${i.id}` })),
            recommend : res.data.data.recommend.map(i => ({ ...i, url: `${PAGE_ARTICLE_SHOW}?id=${i.article_id}` }))
        }
        return homeArr
    }
})


/**
 * 获取商圈详情
 */
export const dispatchCbdShow = payload => createAction({
    payload,
    method: 'POST',
    type: SHOW_CBD,
    url: API_CBD_SHOW,
    // TODO 这里后端单词打错了
    // cb: ({ data: { data } }) => ({ ...data.cbd, id: payload.cbd, url: `${PAGE_CBD_APARTMENT}?id=${payload.cbd}` })
  })

  
/**
 * 获取活动详情
 */
export const dispatchActivityShow = payload => createAction({
    payload,
    method: 'POST',
    type: SHOW_ACTIVITY,
    url: API_ACTIVITY_SHOW,
    cb: ({ data: { data } }) => ({ ...data.hot_rule, url: `${PAGE_ACTIVITY_APARTMENT}?id=${payload.id}` })
  })
  

