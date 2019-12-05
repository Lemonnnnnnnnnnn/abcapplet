import { AD_DEFAULT, SET_AD_LIST, TYPE_SETTING_RISK_POST } from '@constants/ad'

export default function adReducer(state = AD_DEFAULT, action) {
  switch (action.type) {
    case SET_AD_LIST: {
      return { ...state, list: [...action.payload] }
    }

    case TYPE_SETTING_RISK_POST: {
      const { people_num, sum } = action.payload
      return { ...state, riskAd: { people_num, sum } }
    }

    default: {
      return state
    }
  }
}
