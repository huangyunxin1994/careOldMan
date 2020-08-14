<template>
    <el-dialog title="自定义字段" :visible.sync="formVisible" :before-close="handleClose" :close-on-click-modal="false" top="5vh">     
        <el-form :model="form" label-width="150px" :rules="formRule" ref="form"  style="max-height:70vh;overflow-y:scroll">
            
            <el-form-item label="字段名称" prop="name">
                <el-input v-model="form['name']" auto-complete="off"></el-input>
            </el-form-item>
             <el-form-item label="字段类型" prop="type">
                <el-select v-model="form['type']" placeholder="请选择" @change="changeType">
                    <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="最小字符数" prop="minimumCharacters" v-show="form['type']=='input'">
                <el-input v-model="form['minimumCharacters']" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="最大字符数" prop="maximumCharacters" v-show="form['type']=='input'">
                <el-input v-model="form['maximumCharacters']" auto-complete="off"></el-input>
            </el-form-item> -->
			<el-form-item prop="maximumCharacters" v-show="form['type']=='input'">
				<el-radio-group v-model="form['maximumCharacters']">
				    <el-radio :label="20" class="sortText">短文本 <p class="explain">(最多可填10个字)</p></el-radio>
				    <el-radio :label="60" class="longText">长文本 <p class="explain">(最多可填30个字)</p></el-radio>
				</el-radio-group>
			</el-form-item>
            <el-form-item label="最小长度" prop="minimumCharacters" v-show="form['type']=='number'">
                <el-input v-model="form['minimumCharacters']" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="最大长度" prop="maximumCharacters" v-show="form['type']=='number'">
                <el-input v-model="form['maximumCharacters']" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="选项" prop="type" v-show="form['type']=='radio'||form['type']=='checkbox'||form['type']=='select'">
                <div class="form-option" v-for="(item,index) in form['childs']" :key="index"  style="margin-bottom:10px">
                    <el-link :underline="false" icon="el-icon-remove" type="danger" style="font-size:30px;margin:0 20px" @click="removeItem(index)"></el-link>
                    <el-input v-model="item.name" auto-complete="off" placeholder="请输入选项"></el-input>
                </div>
                <el-link :underline="false" icon="el-icon-circle-plus" type="primary" style="font-size:30px;margin:0 20px" @click="addItem()"></el-link>
            </el-form-item>
            <el-form-item label="最多选几项" prop="maximumCharacters" v-show="form['type']=='checkbox'">
                <el-input v-model="form['maximumCharacters']" auto-complete="off"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click.native="handleClose">取消</el-button>
            <el-button type="primary" @click.native="addSubmit" :loading="loading">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { randomStr,getByteLen } from "@/utils/index.js"
import { makePy } from "@/utils/pinying.js"
export default {
    data(){
        var validateLen =(rule, value, callback) => {
			if(value ===''){
				callback(new Error('字段名称不能为空'));
			}else{
				let bool = getByteLen(value)
				if(bool>16){
					callback(new Error('字段名称最多8个汉字或16个字符'));
				}else{
					callback();
				}
				
			}
		};
        return {
            formVisible:false,
            loading: false,
            options: [
                {
                value: 'input',
                label: '单行文本'
                }, {
                value: 'textarea',
                label: '多行文本'
                }, {
                value: 'number',
                label: '数字'
                }, {
                value: 'date',
                label: '日期'
                }, {
                value: 'time',
                label: '时间'
                }, {
                value: 'img',
                label: '上传图片'
                }, {
                value: 'radio',
                label: '单选'
                }, {
                value: 'checkbox',
                label: '多选'
                }, {
                value: 'select',
                label: '下拉框'
                }, {
                value: 'idCard',
                label: '身份证'
                }, {
                value: 'phone',
                label: '手机号码'
                }
            ],
            //新增界面数据
            form: {
               name :'',
               type :'',
               minimumCharacters:'',
               maximumCharacters:'',
               required:0,
               childs:[] 
            },
            formRule:{
                name: [
                    { required: true, message: '字段名称不能为空', trigger: 'blur' },
                    { required: true,validator: validateLen, trigger: 'change' }
                ],
            }
            
        }
    },
    methods:{
        //显示新增界面
			handleShow() {
                if(this.form.maximumCharacters==''){
                    if(this.form.type=='idCard'){
                        this.form.minimumCharacters=18
                        this.form.maximumCharacters=18
                    }else if(this.form.type=='phone'){
                        this.form.minimumCharacters=11
                        this.form.maximumCharacters=11
                    }else if(this.form.type=='number'){
                        this.form.minimumCharacters=1
                        this.form.maximumCharacters=20
                    }else if(this.form.type=='checkbox'){
                        this.form.minimumCharacters=1
                        this.form.maximumCharacters=""
                    }else {
                        this.form.minimumCharacters=""
                        this.form.maximumCharacters=20
                    }
                }
                this.formVisible = true;	
                //console.log(this.form)
            },
            addItem(){
                //console.log(this.form)
                let para = {name:""}
                this.form.childs.push(para)
            },
            removeItem(i){
                this.form.childs.splice(i,1)
            },
            //新增
			addSubmit() {
				//console.log(123)
                this.$refs.form.validate((valid) => {
					if (valid) {
                        this.submitData()
					}
				});
               
            },
			//提交
			submitData(){
				//NProgress.start();
					//console.log(this.form)
				    let para = Object.assign({}, this.form);
				    let arr = makePy(para.name)
				    let key = randomStr(false,12)
				    para.dataKey=arr[0].toLowerCase()+"_"+key
				    
				    //console.log(para)
				    if(para.submitType=="insert"){
				        this.$emit("insertOption",para)
				    }else if(para.submitType=="update"){
				        this.$emit("updateOption",para)
				    }else{
				        this.$message.warning("参数不明确");
				    }
				    this.form= {
				        name :'',
				        type :'',
				        minimumCharacters:'',
				        maximumCharacters:'',
				        required:0,
				        childs:[] 
				    };
				    this.formVisible = false;	
			},
            handleClose() {
                this.form= {
                    name :'',
                    type :'',
                    minimumCharacters:'',
                    maximumCharacters:'',
                    required:0,
                    childs:[] 
                };
                this.formVisible=false
                this.loading=false
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
                this.$emit("handleClosed")
            },
            changeType(val){
                 this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
                //console.log(val)
                if(val=='idCard'){
                    this.form.minimumCharacters=18
                    this.form.maximumCharacters=18
                }else if(val=='phone'){
                    this.form.minimumCharacters=11
                    this.form.maximumCharacters=11
                }else if(val=='number'){
                    this.form.minimumCharacters=1
                    this.form.maximumCharacters=20
                }else if(val=='checkbox'){
                    this.form.minimumCharacters=1
                    this.form.maximumCharacters=""
                }else {
                    this.form.minimumCharacters=""
                    this.form.maximumCharacters=20
                }
            }
               
    }
}
</script>
<style lang="scss" scoped>
.form-option{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.sortText,.longText{
	position: relative;
}
</style>