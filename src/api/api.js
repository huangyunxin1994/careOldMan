import {getResultful,get,post,put,puts,post2,deleteResultful} from '@/api/https.js'
let base = '';

export const getPlatform = params => { return get(`${base}/platform/`, params); }//查询所有平台

export const addPlatform = params => { return post(`${base}/platform/`, params); }//添加子平台

export const deletePlatform = params => { return deleteResultful(`${base}/platform/`, params); }//删除子平台

export const getEquipment = params => { return get(`${base}/equipment/`, params); }//查询设备

export const updateEquipment = params => { return put(`${base}/equipment/`, params, {emulateJSON: true}); }//更新设备

export const downloadModal = params => { return get(`${base}/equipment/download`, params); }//下载设备导入模板

export const ImportExcel = params => { return post2(`${base}/equipment/ImportExcel`, params); }//导入设备列表

export const forceImport = params => { return post(`${base}/equipment/forceImport`, params); }//强制导入设备列表

export const synchronization = params => { return get(`${base}/equipment/synchronization`, params); }//同步下发设备

export const requestLogin = params => { return get(`${base}/login/`, params); }//登录

