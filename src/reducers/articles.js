import { ARTICLE_DEFAULT, SET_ARTICLE } from '@constants/article'


export default function home(state = ARTICLE_DEFAULT, action) {
  switch (action.type) {
    case SET_ARTICLE: {
      return [
        action.payload,
        ...state.filter(i => i.id !== action.payload.id)
      ]
    }

    default: {
      return state
    }
  }
}
