<template>
    <el-scrollbar style="width:100%;height:calc(100% - 17px);" :vertical="true" v-loading='loading'>
        <enroll-main @setLoading="setLoading" @backPage='backPage'></enroll-main>
    </el-scrollbar>
</template>
<script>
import enrollMain from '@/components/enroll-main'
export default {
    components:{
        enrollMain
    },
    data(){
        return{
            loading:false
        }
    },
    methods:{
        setLoading(para){
            this.loading=para.bool
        },
        backPage(){
            console.log(22)
            this.$router.push({
                path:"/main"
            })
        }
    }
}
</script>