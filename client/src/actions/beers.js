import axios from 'axios'
export const BEERS = 'BEERS'

export const getBeers = (cb) => {
  return (dispatch) => {
    axios.get('/api/all_beers')
      .then(res => ({type: BEERS, beers: res.data.entries}))
      .then(cb())
  }
}
