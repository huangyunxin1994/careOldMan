<template>
      <div class="tree">
        <el-input  v-model="filterText" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>

        <el-tree
          :data="data"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          ref="tree"
          highlight-current
          ></el-tree>
      </div>
</template>

<script>
import { getPlatform } from "@/api/api"
export default {
  name: 'tree',
  data(){
    return{
      filterText:"",
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted(){
    getPlatform().then(res=>{
      console.log(res)
      this.data = res.data.data
    }).catch(err=>{

    })
  },
    methods: {
      handleNodeClick(data) {
        console.log(data);
        this.$emit('getPlatformData',data.id)
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
}
</script>

<style lang="scss" scoped>
.tree{
    height: 100%;
    padding: 1%;
    display: flex;
    flex-direction:column;
    justify-content: space-between;
    // .el-input{
    //   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    // }
    .el-tree{
      height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      font-size:0.8vw;
    }
}
</style>
