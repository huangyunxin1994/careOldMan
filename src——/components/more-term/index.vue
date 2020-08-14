<template>
    <el-dialog title="更多筛选条件" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="700px">     
       <div class="more-term-main-radio">
           <!-- <el-checkbox v-model="checked" :true-label="1" :false-label="2">在当前结果筛选</el-checkbox> -->
           <div class="choose-history" v-for="(item,index) in showTableTitle" :key="index" v-show="item.name!=='reviewState'&&item.name!=='readNot'&&item.name!=='submitTime'&&titlePara[item.name]['showVal'].length>0">
                <el-tag class="choose-history-tag"  >
                   {{item.title}}: 
                   <!-- <span v-for="(i,index) in titlePara[item.name]['showVal']" :key='index'>{{i}} </span>  -->
                   <el-tag class='tag-item' v-for="(i,index) in titlePara[item.name]['showVal']" :key='index' size='mini'  effect="dark">
                     {{i}}
                   </el-tag>
                </el-tag>
                <el-link  :underline="false" icon="el-icon-error" type="danger" class="delHisIcon" @click="delHisIcon(item.type,item.name)"></el-link>
            </div>
       </div>
       <div class="more-term-contain">
           <div class="more-term-text" >
               <span class="more-term-text-title">选择字段</span>
               <div class="more-term-contain-type">
                   <div class="more-term-radio" v-for="(item,index) in showTableTitle" :key="index">
                        <el-radio v-model="radio" :label="item.name" v-if="item.name!=='reviewState'&&item.name!=='readNot'&&item.name!=='submitTime'">{{item.title}}</el-radio>
                  </div>
               </div>
                
           </div>
           <div class="more-term-text">
               <span  class="more-term-text-title">筛选内容</span>
                <div  v-for="(item,index) in showTableTitle" :key="index">
                    <!-- <div v-for="(itee,index) in titlePara[item.name]" :key="index"> -->
                        
                        <div v-show="(item.type==='input'||item.type==='idCard')&&item.name===radio">
                            <el-link :underline="false" icon="el-icon-circle-plus" type="primary" class="addIcon" @click='addIcon(item.type,item.name)' ></el-link>
                            <div class="item-style" v-for="(itee,index) in titlePara[item.name]['value']" :key="index">
                                <div  class="item-style-input" >
                                <el-input v-model="itee['value']"  placeholder="请输入内容"></el-input>
                                </div>
                                <el-link :underline="false" icon="el-icon-remove" type="danger" class="delIcon" @click="delItem(item.name,index)" v-if="index>0" ></el-link>
                            </div>
                            
                        </div>
                        <div v-show="(item.type==='number'||item.type==='phone')&&item.name===radio">
                            <el-link :underline="false" icon="el-icon-circle-plus" type="primary" class="addIcon" @click='addIcon(item.type,item.name)' ></el-link>
                            <div class="item-style" v-for="(itee,index) in titlePara[item.name]['value']" :key="index">
                                <div  class="item-style-input" >
                                    <el-input v-model="itee['sNum']"   type="number" placeholder="请输入内容"></el-input>
                                    <el-input v-model="itee['eNum']"   type="number" placeholder="请输入内容" v-show="itee['type']==='2'"></el-input>
                                </div>
                                <el-select v-model="itee['type']" placeholder="请选择">
                                    <el-option
                                        v-for="item in numOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-link :underline="false" icon="el-icon-remove" type="danger" class="delIcon" @click="delItem(item.name,index)" v-if="index>0" ></el-link>
                                <div v-else style="width:30px;height:30px"></div>
                            </div>

                            
                        </div>
                        <div v-show="item.type==='textarea'&&item.name===radio">
                             <div class="item-style" v-for="(itee,index) in titlePara[item.name]['value']" :key="index">
                                <el-input v-model="itee['value']" v-for="(itee,index) in titlePara[item.name]['value']" :key="index" placeholder="请输入内容"  type="textarea" :rows="2"></el-input>
                               
                            </div>
                            
                        </div>
                        <div v-show="item.type==='date'&&item.name===radio">
                            <el-link :underline="false" icon="el-icon-circle-plus" type="primary" class="addIcon" @click='addIcon(item.type,item.name)' ></el-link>
                            <div class="item-style" v-for="(itee,index) in titlePara[item.name]['value']" :key="index">
                                 <div  class="item-style-input" >
                                    <el-date-picker v-model="itee['sdate']" type="date" placeholder="选择日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable='false' :editable='false' :picker-options="startTimeOptions" @focus="setStartDate(item.name,index)"></el-date-picker>
                                    -
                                    <el-date-picker v-model="itee['edate']" type="date" placeholder="选择日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" :clearable='false' :editable='false' :picker-options="endTimeOptions" @focus="setStartDate(item.name,index)"></el-date-picker>
                                 </div>
                                 <el-link :underline="false" icon="el-icon-remove" type="danger" class="delIcon" @click="delItem(item.name,index)" v-if="index>0" ></el-link>
                            </div>
                            
                        </div>
                        <div v-show="item.type==='checkbox'&&item.name===radio">
                            <div class="item-style">
                                <div  class="item-style-input" >
                                    <el-checkbox-group 
                                        v-model="titlePara[item.name]['value']">
                                        <el-checkbox v-for="(ite,index) in item.childs" :label="ite.name" :key="index">{{ite.name}}</el-checkbox>
                                    </el-checkbox-group>
                                </div>
                            <el-select v-model="titlePara[item.name]['type']" placeholder="请选择">
                                <el-option
                                    v-for="item in chboxOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            </div>
                            
                        </div>
                        <div v-show="item.type==='radio'&&item.name===radio">
                             <el-checkbox-group 
                                v-model="titlePara[item.name]['value']">
                                <el-checkbox v-for="(ite,index) in item.childs" :label="ite.name" :key="index">{{ite.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div v-show="item.type==='select'&&item.name===radio">
                             <el-checkbox-group 
                                v-model="titlePara[item.name]['value']">
                                <el-checkbox v-for="(ite,index) in item.childs" :label="ite.name" :key="index">{{ite.name}}</el-checkbox>
                            </el-checkbox-group>
                        </div>
                </div>
           </div>
       </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { randomStr } from "@/utils/index.js"
export default {
    props:{
        showTableTitle:Array,
        titlePara:Object
    },
    data(){
        return {
            formVisible:false,
            loading: false,
            checked:1,
            radio:"",
            numOptions:[
                {value:"1",label:"精确"},
                {value:"2",label:"范围"},
            ],
            chboxOptions:[
                {value:"1",label:"或"},
                {value:"2",label:"与"},
            ],
            endDate:{name:"",index:""},
        }
    },
    methods:{
        //显示新增界面
			handleShow() {
                this.formVisible = true;	
            },
            //新增
			addSubmit() {    
               this.checked=1,
                this.radio=""
                this.formVisible=false       
               this.$emit("selectByTerm")
            },
            handleClose() {
                this.checked=1,
                this.radio=""
                this.formVisible=false
                this.loading=false
            },
            /* 新增筛选项内容 */
            addIcon(type,name){
                 //console.log(name,this.titlePara[name])
                 if(type=="number"||type=="phone")
                
                    this.titlePara[name].value.push({sNum:"",eNum:"",type:"1"})
                else if(type=="date")
                    this.titlePara[name].value.push({sdate:"",edate:""})
                else
                    this.titlePara[name].value.push({value:""})
            },
            /*删除筛选内容 */
            delItem(name,index){
                //console.log(name,index)
                this.titlePara[name].value.splice(index,1)
            },
            delHisIcon(type,name){
                //console.log(type,name)
                this.titlePara[name].value=[]
                this.titlePara[name].showVal=[]
                 if(type=="number"||type=="phone"){
                     this.titlePara[name].value.push({sNum:"",eNum:"",type:"1"})
                 }
                else if(type=="date"){
                    this.endDate={name:"",index:""}
                    this.titlePara[name].value.push({sdate:"",edate:""})
                } 
                else{
                    if(type!="select"&&type!="radio"&&type!="checkbox")
                        this.titlePara[name].value.push({value:""})
                }
                    
            },
            setStartDate(name,index){
                //console.log(name,index)
                this.endDate.name=name
                this.endDate.index=index
            }
               
    },
    computed:{
        startTimeOptions(){
            // 开始时间
            return{
                disabledDate:(time)=>{
                    //结束时间之后的时间不能作为开始时间
                    if(this.endDate.name!==""&&this.endDate.index!==""){
                        let disabledDate;
                        let endTime = this.titlePara[this.endDate.name]['value'][this.endDate.index].edate
                        if(endTime!=""){
                            disabledDate = new Date(endTime);
                            disabledDate.setDate(disabledDate.getDate()-1);
                            return time.getTime()>disabledDate.getTime();
                        }
                    }
                }
            }
        },
        endTimeOptions(){
            // 结束时间
            return{
                disabledDate:(time)=>{
                    //起始时间之前的时间不能作为结束时间
                    
                    if(this.endDate.name!==""&&this.endDate.index!==""){
                        let disabledDate
                        let startTime = this.titlePara[this.endDate.name]['value'][this.endDate.index].sdate
                        if(startTime!=""){
                                disabledDate = new Date(startTime);
                                disabledDate.setDate(disabledDate.getDate()-1);
                                return time.getTime() < disabledDate.getTime();
                        }
                    }
                    
                   
                }
            }    
        }

    },
    watch:{
        titlePara:{
            handler:(val)=>{
                //console.log(val)
                Object.keys(val).forEach(i=>{
                    if(i!=='reviewState'&&i!=='readNot'&&i!='submitTime'){
                        let arr = val[i].value
                        let type =val[i].opType
                        if(arr){
                            val[i].showVal=[]
                            arr.forEach(item=>{
                                //console.log(item.hasOwnProperty('value'))
                                if(item.hasOwnProperty('value')){
                                  if(item.value!=="")
                                    val[i].showVal.push(item.value)
                                }else if(item.hasOwnProperty('sNum')&&item.hasOwnProperty('eNum')){
                                    if(item.type==='1'&&item.sNum!=="")
                                        val[i].showVal.push(item.sNum)
                                    else if(item.sNum!==""&&item.eNum!=="")
                                        val[i].showVal.push(item.sNum+" 至 "+item.eNum)
                                }else if(item.hasOwnProperty('sdate')&&item.hasOwnProperty('edate')) {
                                    if(item.sdate!==""&&item.edate!=="")
                                        val[i].showVal.push(item.sdate+" 至 "+item.edate)
                                }else{
                                    val[i].showVal.push(item)
                                }
                            }) 
                        }
                    }
                    
                })
            },
            deep:true
        }
        
    }

}
</script>
<style lang="scss" scoped>

.more-term-main-radio{
    font-weight: 700;
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    .choose-history{
        margin: 4px;
         position: relative;
        &-tag{
            height: auto;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
            .tag-item{
                margin: 2px;
            }
        }
        .delHisIcon{
                position: absolute;
                font-size: 16px;
                top: -8px;
                right: -8px;
            }
    }
}
.more-term-contain{
    &-type{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    
}
.more-term-radio{
    margin: 10px 0;
    width: 150px;
    white-space:nowrap;
    overflow: hidden;
}
.more-term-text{
    margin: 10px 0;
    padding: 20px;
    min-height: 100px;
    border: 1px solid #dcdfe6;
    position: relative;
    &-title{
        display: block;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 20px ;
        height: 30px;
        line-height: 30px;
    }
    .addIcon{
        position: absolute;
        font-size:30px;
        top:20px;
        right:20px
    }
    .item-style{
        margin: 5px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        &-input{
            flex-basis: 250px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .el-date-editor{
                width: 150px;
            }
        }
        
        .delIcon{
             font-size:30px;  
        }
        .el-select{
            flex-basis: 90px;
        }
    }
    
}
</style>