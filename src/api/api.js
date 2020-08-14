import {getResultful,get,post,put,puts,deleteResultful} from '@/api/https.js'
let base = '';
export const getEquipment = params => { return get(`${base}/equipment/`, params); }//查询设备

export const updateEquipment = params => { return put(`${base}/equipment/`, params, {emulateJSON: true}); }//更新设备