import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: "/api", // url = base url + request url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    switch (response.data.code) {

      case '-2':
          location.reload()
          Message({
            message: '登录过期，请重新登录',
            type: 'error',
            duration: 5 * 1000
          })
        break
      default:
        break
    }
    return response
  },
  error => {
    //console.log(error)
    return Promise.reject(error)
  }
)

export default service

/**
 * post 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data) {
    let para,bool;
    if(Array.isArray(data)){
      bool = true
    }else {
      let flag =  Object.values(data).some(i=>{
        return Array.isArray(i)
      })
      bool = flag
    }
    if(bool){
      para = data
    }else{
      para = Qs.stringify(data)
    }
    return new Promise((resolve, reject) => {

      service.post(url, para)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
}
/**
 * get 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get (url, data = {}) {
  return new Promise((resolve, reject) => {
    service.get(url, {params: data})
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * get 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function getResultful (url, data = {}) {
    return new Promise((resolve, reject) => {
        //console.log(data)
        for(let key in data){
            url=url+'/'+ data[key]
        }
      service.get(url)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
  }

/**
 * puts 批量方法封装
 * @param url
 * @param { Array } data
 * @returns {Promise}
 */
export function puts (url, data) {
    return new Promise((resolve, reject) => {
      service.put(url, data)
        .then(response => {
          resolve(response.data)
        }, err => {
          reject(err)
        })
    })
}
 /**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put (url, data = {}) {
  return new Promise((resolve, reject) => {
      //console.log(data)
      for(let key in data){
		  if(url.indexOf('?')>-1){
			  url=url+'&'+ key +'='+ data[key]
		  }else{
			  url=url+'?'+ key +'='+ data[key]
		  }
          
      }
    service.put(url)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
  }
  
  /**
   * delete 方法封装
   * @param url
   * @param data
   * @returns {Promise}
   */
  export function deleteResultful (url, data = {}) {
      return new Promise((resolve, reject) => {
          //console.log(data)
          for(let key in data){
              url=url+'/'+ data[key]
          }
        service.delete(url)
          .then(response => {
            resolve(response.data)
          }, err => {
            reject(err)
          })
      })
    }