<template>
      <div class="tree">
        <el-input  v-model="filterText" placeholder="请输入内容" suffix-icon="el-icon-search"></el-input>
        
        <!-- <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree"></el-tree> -->
       
        <el-tree
          :data="data"
          :props="defaultProps"
          node-key="uid"
          ref="tree"
          highlight-current
          :render-content="renderContent" 
          @node-click="handleNodeClick"
          :filter-node-method="filterNode"
          >
        </el-tree>
       
      </div>
</template>

<script>
import { getOrganData,insertUserData,updateUserData,removeUserData,bRemoveUserData,findSubordinate } from '@/api/table'
import { getUser, getRole } from '@/utils/auth'
function filterArray(data) {
    data.forEach(function (item) {
        delete item.children;
    });
    var map = {};
    data.forEach(function (item) {
        map[item.uid] = item;
    });
    var val = [];
    data.forEach(function (item) {
        if(item.uorganizationId)
          item.className="person"
        else
          item.className="organ"
        var parent = map[item.uparentId]||map[item.uorganizationId];
        if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
        } else {
            val.push(item);
        }
    });
    return val;
}
export default {
  name: 'tree',
  props:{
    showPerson:{
      type:String,
      default:'false'
    }
    
  },
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
    methods: {
      handleNodeClick(data) {
        this.$emit('getThisOrgan',data)
      },
       filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getOrganData(){
        let user = JSON.parse(getUser()) 
        console.log(user)
        let organizaId = user.organizationId;
        let userid = user.userId;
        let role = JSON.parse(getRole()) 
        let para ={organizaId:organizaId,roleId:role,userId:userid}
        getOrganData(para).then(res=>{
          this.data=res.data.data
          let organ = res.data.data;
          organ.map(item=>{
            item.uid="O"+item.id
            item.uparentId="O"+item.parentId
          })
          let person = res.data.user;
          person.map(item=>{
            item.uid="P"+item.id
            item.uorganizationId="O"+item.organizationId
          })
          
          this.$emit("getPersonData",person)
          let arr=[]
          if(this.showPerson=="true")
            arr = organ.concat(person)
          else
            arr = organ

          console.log(arr)
          let filterarr = filterArray(arr)
          console.log("filterarr")
          console.log(filterarr)
          this.data=filterarr
        }).catch(err=>{
        })
      },
      renderContent(h, { node, data, store }) {
        if(data.className=="person"){
          return (
              <span style="display:block;width:100%;">
                <i class="el-icon-user-solid" style="color:rgb(179, 216, 255);float:right"></i> 
                <span  style="display:block;width:3.2vw;color:#409EFF">{node.label}</span>
                
              </span>
              );
        }else{
          return (
              <span>
                <i class="el-icon-s-operation" style="color:rgb(179, 216, 255);margin-right:0.5em"></i> 
                <span style="font-weight:bold">{node.label}</span>
              </span>
              );
        }
            
        },
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    mounted(){
      this.getOrganData()
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
    .el-input{
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
    }
    .el-tree{
      height: 90%;
      padding: 5% 2%;
      border-radius: 5px;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      font-size:0.8vw;
    }
}
</style>
