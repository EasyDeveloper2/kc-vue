<template>
    <div class="title">
       {{name}}
    </div>
</template>

<script>
  import utils from '../../utils/index';
    export default {
        name:'index',
        data(){
          return {
              name:'xxx'
          }  
        },
        created(){
           this.name = utils.formatNumber('1234')
        }
    }
</script>

<style lang="less" scoped>
@import "./index.less";


.title3{
    color:red;
    font-size: 12px;
    border: 1px solid red;
}

</style>