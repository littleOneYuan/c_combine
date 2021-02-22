<template>
  <div class="c-combine">
    <div class="comBox">
      <div v-for="(item,idx) in com_arr" :key="item.id" class="comcell" :class="{'selcomcell': item.selected}" @click="selcom_handle()">
        <span v-if="!item.edit" @dblclick.stop="name_click(2, idx)" @click.stop="name_click(1, idx)">{{item.name}}</span>
        <input v-else v-model="item.name" type="text" placeholder="组合名" maxlength="5" class="name-input" @focus="name_input(idx)" @blur="input_over(idx)">
        <Icon type="md-close-circle" @click.stop="close_com(idx)" />
      </div>
      <button type="text" class="add-btn" @click="addcom_handle()">+添加</button>
    </div>
  </div>
</template>
<script>
import { genID } from '@/common/js/c_common'
export default {
  name: 'c-combine',
  data () {
    return {
      cell_status: [1, 0],
      com_arr: [{
        name: '组合1',
        content: '',
        id: 0,
        selected: true,
        edit: false
      }, {
        name: '组合2',
        content: '',
        id: 1,
        selected: false,
        edit: false
      }]
    }
  },
  computed: {
  },
  props: {

  },
  methods: {
    // 输入组合名字
    name_input (idx) {

    },
    // 组合名字输入完毕
    input_over (idx) {
      this.com_arr[idx].edit = false
      console.log('失焦')
    },
    name_click (_type, idx) {
      clearTimeout(this.timer)
      if (_type === 1) {
        if (event.detail === 2) return
        this.timer = setTimeout(function () {
          console.log(genID(20))
          console.log('单击')
        }, 300)
      } else {
        console.log('双击')
        this.com_arr[idx].edit = true
      }
    },
    selcom_handle (e) {
      console.log(e)
      alert('成功')
    },
    close_com (idx) {
      alert('删除' + (idx + 1) + 'id: ' + this.com_arr[idx].id)
      if (this.com_arr[idx].selected) {
        this.com_arr.splice(idx, 1)
        this.com_arr[this.com_arr.length - 1].selected = true
      } else {
        this.com_arr.splice(idx, 1)
      }
    },
    // 新增组合
    addcom_handle () {
      this.com_arr.forEach(com => {
        com.selected = false
      })
      // const name_temp = '组合' + (this.com_arr.length + 1)
      const id_temp = this.com_arr.length
      this.com_arr.push({
        name: '',
        content: '',
        id: id_temp,
        selected: true,
        edit: true
      })
    }
  },
  watch: {

  },
  created () {

  }
}
</script>
<style lang="stylus" scoped>
.comBox {
  padding: 6px 8px;
  background-color: #a197e059;
  border-radius: 6px;
  border: 1px solid rgba(93,73,204,0.741);
  box-shadow: 0px 1px 2px 0px #3c3086cf;
  &:focus {
    border: 2px solid rgba(93,73,204,0.741)
  }
}
.comcell, .selcomcell {
  display: inline-block;
  margin-right: 10px;
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid #8476d7;
  width: 80px;
  height: 26px;
  span, i {
    display: inline-block;
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    color: #8476d7
    &:hover {
      cursor: pointer
    }
  }
  span {
    font-weight: 600;
    width: 60px;
    &:hover {
      background-color #e7e2ff
    }
  }
  i {
    flex: 1
    &:hover {
      font-size: 15px;
    }
  }
}
.selcomcell {
  background-color: #8476d7;
  span, i {
    color: #fff
  }
  span {
    &:hover {
      background-color: #8476d7;
    }
  }
  input.name-input {
    background: #8476d7;
  }
}
input.name-input {
  width: 50px;
  background: #fff;
  margin-left: 10px;
  line-height: 24px;
  font-size: 14px;
  color: #fff;
}
button.add-btn {
  padding: 2px 4px;
  color: #8073d6;
  font-weight: 600;
  background: #fff0;
}
</style>
