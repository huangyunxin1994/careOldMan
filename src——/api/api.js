import {getResultful,get,post,put,puts,deleteResultful} from '@/api/https.js'
let base = '';
export const requestLogin = params => { return post(`${base}/login/`, params, {emulateJSON: true}); }//登录

export const createEnrollment = params => { return post(`${base}/signup/createEnrollment`, params, {emulateJSON: true}); };//创建报名
export const selectSigup = params => { return get(`${base}/signup/selectSigup`, params); };//查询报名列表
export const getSignup = params => { return getResultful(`${base}/applicants/Signup`, params); };//查询报名项目信息
export const getSignupPerson = params => { return getResultful(`${base}/applicants/signup`, params); };//查询报名人员列表
export const getPersonDetial = params => { return getResultful(`${base}/applicants`, params); };//查询报名人员详细信息
export const changePass = params => { return post(`${base}/user/changePassword`, params, {emulateJSON: true}); };//修改密码

export const vaildIdCard = params => { return get(`${base}/user/getUserByIdCard`, params); };//验证身份证
export const checkEnroll = params => { return puts(`${base}/applicants/Signup`, params, {emulateJSON: true}); };//批量更新报名信息

export const getUserList = params => { return get(`${base}/user/`, params); };//获取用户信息
export const addUser = params => { return post(`${base}/user/`, params, {emulateJSON: true}); };//新增用户
export const updateUser = params => { return put(`${base}/user/`, params, {emulateJSON: true}); };//批量更新报名信息
export const deleteUser = params => { return deleteResultful(`${base}/user/`, params); };//查询报名项目信息
export const getUserName = params => { return getResultful(`${base}/user/user/`, params); };//获取url中account值的User信息

export const getPlatForm = params => { return get(`${base}/Platform/platform/getplatform`, params); };//获取平台名称
export const updatePlatform = params => { return put(`${base}/Platform/platform/putPlatform`, params, {emulateJSON: true}); };//更新平台名称