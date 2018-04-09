
import {combineReducers} from 'redux'
import flash from './flash'
import beers from './beers'

const rootReducer = combineReducers({
  flash,
  beers,
})

export default rootReducer
