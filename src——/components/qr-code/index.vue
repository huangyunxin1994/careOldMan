<template>
    <el-dialog
            :visible.sync="dialogVisible"
            width="300px" height="300px" >
            <div>请打开手机微信扫一扫预览</div>
            <div class="qrcode-style" >
            <img style="width:100%;height:100%" :src="'http://47.115.89.236:9090/enrollSystem/src/assets/qrCode/'+imgPath+'.png'" alt="">
            </div>
        </el-dialog>
</template>
<script>
export default {
    props:{
      imgPath:String  
    },
    data(){
        return{
            dialogVisible:false
        }
    }
}
</script>
<style lang="scss" scoped>
.qrcode-style{
            margin-top: 50px;
            width: 260px;
            height: 260px;
        }
</style>