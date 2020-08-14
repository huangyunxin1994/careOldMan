import axios from 'axios'
import { Message } from 'element-ui'
import Qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: "https://www.zkyfzx.com/signup", // url = base url + request url
 //baseURL: "http://192.168.1.111:8080", // url = base url + request url
  // baseURL: "http://192.168.1.3:8081", // url = base url + request url
//  baseURL: "http://47.115.89.236:9090/signup", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // if (store.getters.token) {
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation

    //   //config.headers={'Content-Type':'application/x-www-form-urlencoded'}
    //   config.headers['Authorization'] = getToken()
    // }
    return config
  },
  error => {
    // do something with request error
    //console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
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