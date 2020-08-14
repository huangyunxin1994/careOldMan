<template>
    <el-dialog title="请选择需显示的字段" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh" width="500px">     
       <div class="more-term-contain">
           <div class="more-term-text" >
               <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedField" @change="handlecheckedFieldChange">
                    <el-checkbox v-for="(item,index) in tables" :label="item.name" :key="index" class="more-term-radio">{{item.title}}</el-checkbox>
                </el-checkbox-group>
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
const cityOptions = ['上海', '北京', '广州', '深圳'];
export default {
    props:{
        tableTitle:Array,
        showTableTitle:Array
    },
    data() {
      return {
        formVisible:false,
        loading: false,
        checkAll: false,
        checkedField: [],
        cities: cityOptions,
        isIndeterminate: false
      };
    },
    methods: {
      handleCheckAllChange(val) {
          //console.log(val)
        let arr = []
        this.tableTitle.forEach(item => {
            arr.push(item.name)
        });
        this.checkedField = val ? arr : ["name"];
        this.checkAll = this.checkedField.length === this.tableTitle.length
        this.isIndeterminate = this.checkedField.length> 0 && this.checkedField.length < this.tableTitle.length;
      },
      handlecheckedFieldChange(value) {
          //console.log(value)
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.tableTitle.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableTitle.length;
      },
      //显示新增界面
			handleShow() {
                let arr = this.showTableTitle.filter(item => this.tableTitle.indexOf(item) > -1);
                if(arr.length===this.tableTitle.length){
                    this.checkAll=true;
                    arr.forEach(item=>{
                        this.checkedField.push(item.name)
                    }) 
                }
                this.formVisible = true;	
            },
            //新增
			addSubmit() {      
               this.$emit("showField",this.checkedField)
               this.formVisible = false;	
            },
            handleClose() {
                this.checked=1,
                this.radio=""
                this.formVisible=false
                this.loading=false
                this.$emit("clearChoose")
            },
            changeRadio(val){
                if(this.checked!==1){
                    this.$emit("clearChoose")
                }
            }
    },
    computed:{
        tables:function(){
            return this.tableTitle.filter((i)=> i.name !== 'name'&&i.name!=='reviewState'&&i.name!=='readNot'&&i.name!=='submitTime')
        }
    }
}
</script>
<style lang="scss" scoped>

.more-term-main-radio{
    font-weight: 700;
    margin: 20px 0;
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
    width: 100px;
    white-space:nowrap;
    overflow: hidden;
}
.more-term-text{
    margin: 10px 0;
    padding: 20px;
    min-height: 100px;
    border: 1px solid #dcdfe6;
    &-title{
        display: block;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 20px ;
    }
}
</style>