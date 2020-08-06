import {
  CATSLOAD,
} from '../constants/cats'
import { createAction } from '../utils/redux'
import { API_CATS } from '../constants/api'

export const dispatchCats = payload => createAction({
  url: API_CATS,
  type: CATSLOAD,
  payload
})
