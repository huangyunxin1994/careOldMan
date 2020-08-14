<template>
    <el-scrollbar style="width:100%;height:calc(100% - 17px);" :vertical="true">
        <div class="enroll-details-main">
            <el-link class="enroll-details-nav" :underline="false" @click="backpage"><i class="el-icon-arrow-left"></i> 返回上一级 </el-link>
            
            <div class="enroll-details-container" ref="container">
                <div class="enroll-details-container-img">
                    <el-button type="primary" size="medium" @click="exportData()">导出</el-button>
                    <!-- <el-avatar shape="square" :size="100" :src="squareUrl"></el-avatar> -->
                </div> 
                <el-scrollbar style="width:100%;height:calc(100% - 36px);" :vertical="true">
                <div class="enroll-details-container-msg" >
                    <div id='pdfDom' style="padding-top:50px">
                    <h1 style="text-align:center">{{mainMsg.name}}</h1>
                    <div class="base-msg" >
                            <div v-for="(item,index) in mainMsg.child" :key="index">
                                <div v-if="item.type!=='textarea'&&item.type!=='img'" class="base-msg-item ">
                                    <span class="base-msg-item-label">{{item.name}}</span>
                                    <span class="base-msg-item-text small" v-if="item.type!=='textarea'&&item.type!=='img'&&item.type!=='checkbox'&&(!item.maximumCharacters||item.maximumCharacters<=20)">{{mainMsg.submitData[0][item.dataKey]}}</span>
                                    <span class="base-msg-item-text medium" v-else-if="item.type==='checkbox'||(item.type!=='textarea'&&(item.maximumCharacters>20&&item.maximumCharacters<=60))">{{mainMsg.submitData[0][item.dataKey]}}</span>
                                </div>
                                <div v-else class="base-msg-item-l ">
                                    <span class="base-msg-item-label">{{item.name}}</span>
                                    <pre v-if="item.type!=='img'" class="large">{{mainMsg.submitData[0][item.dataKey]}}</pre>
                                </div>
                                
                            </div>
                    </div>
                     <div class="base-msg" >
                            <div v-for="(item,index) in imgArr" :key="index">
                                <div  class="base-msg-item-l ">
                                    <span class="base-msg-item-label">{{item.name}}</span>
                                    <span class="img">
                                        <img  height="100%" :src="'data:image/png;base64,'+mainMsg.submitData[0][item.dataKey]" v-if="mainMsg.submitData[0][item.dataKey]" />
                                    </span>
                                </div>
                                
                            </div>
                    </div>
                     </div>
                    <div class="other-msg">
                        <div v-for="(item,index) in otherMsg" :key="index">
                            <div class="other-msg-title">{{item.name}}</div>
                            <el-table :data="item.submitData" border style="width: 96%">
                                <el-table-column v-for="(ite,index) in item.child" :key="index" :prop="ite.dataKey" :label="ite.name" :min-width="ite.width">
                                    <template slot-scope="scope">
                                        <span v-if="ite.type!=='img'"  v-html="scope.row[ite.dataKey]"></span>
                                        <img v-else width="100%;height100%;" :src="'data:image/png;base64,'+scope.row[ite.dataKey]" />
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="other-msg-title">回复信息</div>
                        <pre class="other-msg-message">{{replyMessage}}</pre>
                    </div>

                </div>
                </el-scrollbar>
            </div>      
        </div>
        <el-dialog :visible.sync="dialogVisible" width="300px" top="30vh">
            <div>
                <el-checkbox v-model="checked1">{{mainTitle}}（PDF）</el-checkbox>
            </div>
            <br/>
            <div>
                <el-checkbox v-model="checked2">附加信息（Excel）</el-checkbox>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="downLoad" size="mini">确 定</el-button>
            </div>
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import { randomStr,getByteLen } from "@/utils/index.js"
import { getSignup,getPersonDetial } from "@/api/api"
export default {
    data(){
        return {
            squareUrl: "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
            mainMsg:{},
            imgArr:[],
            otherMsg:[],
            htmlTitle: '',
            mainTitle:"",
            enrollerName:"",
            enrollName:"",
            dialogImageUrl:"",
            dialogVisible:false,
            checked1:false,
            checked2:false,
            replyMessage:""
        }
    },
    methods:{
        //回到上一页
        backpage(){
            this.$router.go(-1);
        },
        getWidth(str){
            //console.log(str)
            let length = getByteLen(str)
            //console.log(length)
        },
        getEnrollPersonData(id){
            getPersonDetial({id:id}).then(res=>{
                if(res.code==0){
                    let para = res.data.data;
                    this.replyMessage = para.replyMessage
                    let enrolldata = JSON.parse(para.registrationInformation)
                    console.log(para)
                    this.enrollName = enrolldata.title
                    let personMsg = enrolldata.form;
                   getSignup({id:para.sid}).then(res=>{
                       if(res.code==0){
                           let titleData = res.data.data 
                           console.log(titleData)
                           for(let i=0;i<titleData.length;i++){
                               personMsg[i].child=titleData[i].child
                           }
                           personMsg[0].submitData.forEach(item=>{
                                    for(let key in item){
                                        if(Array.isArray(item[key]) ){
                                            let str=""
                                            for(let i=0;i<item[key].length;i++){
                                                if(str==""){
                                                    str+=item[key][i]
                                                }else{
                                                    str+=","+item[key][i]
                                                }
                                            }
                                            item[key]=str
                                        }
                                    }
                           })
                            this.mainMsg = personMsg[0]
                            this.mainTitle = this.mainMsg.name
                            this.htmlTitle = `${this.enrollName}_${this.mainMsg.submitData[0]['name']}_${this.mainMsg.name}`
                            this.enrollerName = this.mainMsg.submitData[0]['name']
                            let smallArr=[],mediumArr=[],largeArr=[],imgArr=[]
                            this.mainMsg.child.forEach(i=>{
                                //console.log(i.type)
                               if(i.type!=='textarea'&&i.type!=='img'){
                                   if(i.type!=='checkbox'&&(!i.maximumCharacters||i.maximumCharacters<=30)){
                                       smallArr.push(i)
                                   }else{
                                       mediumArr.push(i)
                                   }
                               }else if(i.type==='img'){
                                   imgArr.push(i)
                               }else{
                                   largeArr.push(i)
                               }
                            })
                            console.log(mediumArr )
                            // this.mainMsg.child=smallArr.concat(mediumArr).concat(largeArr).concat(imgArr)
                            this.mainMsg.child=[...smallArr,...mediumArr,...largeArr]
                            this.imgArr = imgArr
                            //console.log(this.mainMsg.child )
                            personMsg.splice(0,1)
                            // //console.log(personMsg)
                            this.otherMsg=personMsg
                       }
                   })
                }
            }).catch(err=>{
                //console.log(err)
            })
        },
        handlePictureCardPreview(src){
            this.dialogImageUrl = src;
            this.dialogVisible = true
        },
        exportData(){
            this.dialogVisible = true
        },
        downLoad(){
            this.dialogVisible = false
            if(this.checked1)
                this.getPdf();
            if(this.checked2)
                this.exportToExcel()
        },
        //excel数据导出
        exportToExcel() {
            if(this.otherMsg.length>0){
                console.log(this.otherMsg)
                    require.ensure([], () => {
                        const {
                            export_json_to_excel
                        } = require('@/export/Export2Excel');
                        const tHeaders = [] // 对应表格输出的中文title
                        const datas = []  // 对应表格输出的数据   
                        const sheetNames = [] // 对应表格sheet的名称
                        const fileName =`${this.enrollName}_${this.enrollerName}_附加信息`
                        console.log(fileName)
                        this.otherMsg.forEach(i=>{
                            const tHeader = []
                            const filterVal = [] 
                            const sheetName =i.name
                            i.child.forEach(val => {
                                tHeader.push(val.name)
                                filterVal.push(val.dataKey)
                            })
                            const list = i.submitData;
                            const data = this.formatJson(filterVal, list);
                            tHeaders.push(tHeader)
                            datas.push(data)
                            sheetNames.push(sheetName)
                        })

                         export_json_to_excel(tHeaders, datas, sheetNames, fileName);
                    })
               
                 
            }else{
                this.$notify({
                    title: '警告',
                    message: '没有数据可以导出',
                    type: 'warning'
                });
            }
           
        },
        formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => {
                        if(j=='reviewState')
                            return v[j] == 1 ? '未审核' :( v[j] == 2 ? '已通过' : ( v[j] == 3 ? '未通过' : ''));
                        else if(j=='readNot')
                            return v[j] == 1 ? '未读' : v[j] == 2 ? '已读' :'';
                        else
                            return v[j]
                    }
                ))
        },
    },
    mounted(){
       let id =  this.$route.query.id
       this.getEnrollPersonData(id)
        
    },
    watch: {
        /**
         * 监控表格的数据data，自动设置表格宽度
         * @Array valArr
         */
        otherMsg(valArr) {
            valArr.forEach((item)=> {
                item.child.forEach(i=>{
                    //const arr = item.sumbitData.map(x => x[i.prop])  // 获取每一列的所有数据
                    if(i.type!=="img"){
                        let temp=[];
                        item.submitData.forEach(x => {
                            let str=""
                            if(Array.isArray(x[i.dataKey])){
                                x[i.dataKey].forEach(m=>{
                                    if(str=="")
                                        str+=m
                                    else
                                    str+=","+m
                                })
                                x[i.dataKey]=str
                            }else{
                                str=x[i.dataKey]
                            }
                            str+=i.name
                            temp.push(getByteLen(str)*10) //获得列的最大长度
                            
                        })
                        i.width=Math.max(...temp)
                    }else{
                       i.width=250 
                    }
                    
                })
                
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .enroll-details-main {
        height: 100%;
        width: 1150px;
        margin: 0 auto;
        .enroll-details-nav{
            height: 50px;
            line-height: 50px;
        }
        .enroll-details-container{
            width: 100%;
            height: calc(100% - 80px);
            padding: 2% 0;
            margin-bottom: 2%;
            background: #fff;
            &-img{
               padding-left: 2%; 
            }
            &-msg{
                width: calc(100% - 0px);
                 .base-msg{
                     width: calc(100% - 40px);
                     padding: 0 20px;
                     display: flex;
                     justify-content: flex-start;
                     align-items: center;
                     flex-wrap: wrap;
                     &-item-l{
                        margin: 10px;
                        display: flex;
                        justify-content: space-between;
                        box-sizing: border-box;
                        .img{
                            width: 200px; 
                             height: 150px; 
                             overflow: hidden;
                             img{
                                 object-fit: cover;
                             }
                        }
                        .large{
                            
                        width: 960px; 
                        display: block;
                        box-sizing: border-box;
                        font-family: inherit;
                        white-space: pre-wrap;
                        white-space: -moz-pre-wrap;
                        white-space: -o-pre-wrap;
                        word-wrap: break-word;
                        padding: 10px;
                        margin: 0;
                        font-size: 16px;
                        line-height: inherit;
                        color: inherit;
                        word-break: break-all;
                        background-color: transparent;
                        border: 1px solid rgb(228, 228, 228);
                         border-radius: 0; 
                        }
                     }
                     &-item{
                        margin: 10px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        box-sizing: border-box;
                        &-label{
                            width: 150px;
                            font-size: 14px;
                            font-weight: 700;
                            text-align: right;
                            padding: 0 10px;
                            box-sizing: border-box;
                        }
                        &-text{
                            min-width: 150px;
                            height: 40px;
                            padding: 10px;
                            font-size: 16px;
                            border: 1px solid rgb(228, 228, 228);
                            box-sizing: border-box;
                            
                        }
                        .small{
                           width: 200px; 
                        }
                        .medium{
                            width: 570px; 
                        }
                     }
                     
                     
                 }
                 .other-msg{
                     width: 100%;
                     padding: 30px;
                     
                     &-title{
                         font-size: 24px;
                         font-weight: 700;
                         margin: 50px 0 20px 0;
                     }
                     &-message{
                          padding: 10px;
                            font-size: 14px;
                            border: 1px solid rgb(228, 228, 228);
                            box-sizing: border-box;
                            width: calc(100% - 60px);
                            min-height: 100px; 
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            
                     }
                 }
            }
        }
    }
</style>