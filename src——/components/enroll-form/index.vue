<template>
    <el-dialog :title="title" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh">     
        <el-form :model="form" label-width="150px" :rules="formRule" ref="form"  style="max-height:70vh;overflow-y:scroll">
            <div v-for="(item,index) in tableTitle" :key="index">
            <el-form-item :label="item.title" :prop="item.name" v-if="item.type=='input'" >
                <el-input v-model="form[item.name]" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item :label="item.title" :prop="item.name" v-else-if="item.type=='textarea'" >
                <el-input v-model="form[item.name]" type="textarea" :rows="10" placeholder="请输入内容" resize="none"></el-input>
            </el-form-item>
            <el-form-item :label="item.title" :prop="item.name" v-else-if="item.type=='select'">
                <!-- <el-input v-model="form.name" auto-complete="off"></el-input> -->
                <el-select v-model="form[item.name]" filterable placeholder="请选择">
                    <el-option
                    v-for="item in selectOptions"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props:{
        tableTitle:Array,
        formRule:Object
    },
    data(){
        return {
            formVisible:false,
            loading: false,
            fileList: [],
            options: [],
            selectOptions:[],
            //新增界面数据
            form: {},
            props:{
                value:"id",
                label:"name",
                children:"children"
            },
            organValue:[],
            organOptions: [],
            cascaderselectOptions:[],
            title:""
            
        }
    },
    methods:{
        //显示新增界面
			handleShow() {
                //console.log(this.form)
                if(this.form.submitType=="update")
                    this.title="修改"
                else if(this.form.submitType=="insert")
                    this.title="新增"
                this.formVisible = true;	
			},
            //新增
			addSubmit() {
                this.$refs.form.validate((valid) => {
					if (valid) {
                        //NProgress.start();
                            let para = Object.assign({}, this.form);
                        ////console.log(para)
                            if(para.submitType=="insert"){
                                this.$emit("insertData",para)
                            }else if(para.submitType=="update"){
                                this.$emit("updateData",para)
                            }else{
                                this.$message.warning("参数不明确");
                            }
                            this.formVisible = false;	
                        //NProgress.start();

                        
					}
				});
               
            },
            handleClose() {
                this.options=[]
                this.form={};
                this.formVisible=false
                this.loading=false
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
                this.$emit("handleClosed")
            }
               
    }
}
</script>