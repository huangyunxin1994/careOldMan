<template>
    <el-dialog
        title="回复信息"
        :visible.sync="centerDialogVisible"
        width="30%"
        center
        >
        <div style="font-size:12px;color:#909399;margin-bottom:20px">
            注：点击提交后，系统将发送短信告知报名者审核结果，而您在此编写的内容将同步到报名者的小程序端
        </div>
        <el-input type='textarea' :rows="4" v-model="replyMessage">需要注意的是内容是默认不居中的</el-input>
        <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible=false">取 消</el-button>
            <el-button type="primary" @click="submitReview">确 定</el-button>
        </span>
        </el-dialog>
</template>
<script>
import { checkEnroll } from "@/api/api"
import { parseTime } from "@/utils/index.js"
export default {
    data(){
        return{
            sels:[],
            centerDialogVisible:false,
            replyMessage:"",
            reviewFlag:"",
        }
    },
    methods:{
        submitReview(){
            this.$confirm('确认提交吗?', '提示', {
					type: 'success'
                }).then(() => {
                    
                    let checkTime = parseTime(new Date())
                    let arr =[]
                    this.sels.forEach(i=>{
                        let para = {}
                        para.reviewTime = checkTime;
                        para.reviewState = this.reviewFlag;
                        para.replyMessage = this.replyMessage
                        para.id = i.personId
                        arr.push(para)
                    })
                    checkEnroll(arr).then(res=>{
                        if(res.code==0){
                            this.$notify({
                                title: '成功',
                                message: '提交成功',
                                type: 'success'
                            });
                            this.centerDialogVisible = false
                            this.$emit("getSignupPerson")
                        }else{
                            this.$notify({
                            title: '错误',
                            message: res.msg,
                            type: 'error'
                        }); 
                        }
                    }).catch((err) => {
                        this.$notify({
                            title: '错误',
                            message: err.msg,
                            type: 'error'
                        });
                    });
                }).catch(() => {
                    
                });
        }
    }
}
</script>
<style lang="scss" scoped>

</style>