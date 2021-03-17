<template>
  <div class="c-combine">
    <div class="comBox">
      <div v-for="(item,idx) in com_arr" :key="item.id" class="comcell" :class="{'selcomcell': item.selected}" @click="selcom_handle(idx)">
        <span v-if="!item.edit" @dblclick.stop="name_click(2, idx)" @click.stop="name_click(1, idx)">{{item.name}}</span>
        <input v-else v-model="item.name" type="text" placeholder="组合名" maxlength="5" class="name-input" @focus="name_input(idx)" @blur="input_over(idx,item.name)" @click.stop>
        <Icon type="md-close-circle" @click.stop="close_com(idx)" />
      </div>
      <button type="text" class="add-btn" @click="addcom_handle()">+添加</button>
    </div>
  </div>
</template>
<script>
import { genID, isArray } from './com.js'
export default {
  name: 'c-combine',
  data () {
    return {
      cell_status: [1, 0]
    }
  },
  computed: {
  },
  props: {
    com_arr: {
      type: Array,
      default () {
        return [{ // 默认组合
          name: '组合1',
          content: {},
          id: 0,
          selected: true,
          edit: false
        }, {
          name: '组合2',
          content: {},
          id: 1,
          selected: false,
          edit: false
        }]
      }
    },
    max_com: {
      type: Number,
      default () {
        return 100
      }
    }
  },
  methods: {
    // 输入组合名字
    name_input (idx) {
      // console.log('聚焦')
    },
    // 组合名字输入完毕
    input_over (idx, name) {
      this.com_arr[idx].edit = false
      // console.log('失焦')
      console.log('子：' + name)
      this.$emit('changename', idx, name)
      this.$emit('synfun', this.com_arr)
    },
    name_click (_type, idx) {
      var self = this
      clearTimeout(this.timer)
      if (_type === 1) { // 单击某个组合
        if (event.detail === 2) return
        this.timer = setTimeout(function () {
          // console.log('单击')
          let last_sel_id = 0
          if (isArray(self.com_arr)) {
            self.com_arr.forEach(com => {
              if (com.selected)last_sel_id = com.id
              com.edit = false
              com.selected = false
            })
            self.com_arr[idx].selected = true
            self.$emit('fixfun', 'click', last_sel_id, idx)
          }
        }, 100)
      } else {
        // console.log('双击')
        this.com_arr[idx].edit = true
      }
      this.$emit('synfun', this.com_arr)
    },
    // 选中某个组合
    selcom_handle (idx) {
      if (isArray(this.com_arr)) {
        let last_sel_id = 0
        this.com_arr.forEach(com => {
          if (com.selected)last_sel_id = com.id
          com.selected = false
        })
        this.com_arr[idx].selected = true
        this.$emit('synfun', this.com_arr)
        this.$emit('fixfun', 'click', last_sel_id, idx)
      }
    },
    // 删除某个组合
    close_com (idx) {
      if (this.com_arr.length === 1) {
        this.$Message.warning('组合不能清空哦-_-')
      } else {
        alert('删除' + (idx + 1) + 'id: ' + this.com_arr[idx].id)
        let cur_idx = 999
        if (this.com_arr[idx].selected) {
          this.com_arr.splice(idx, 1)
          this.com_arr[0].selected = true
          cur_idx = 0
        } else {
          this.com_arr.splice(idx, 1)
        }
        this.$emit('synfun', this.com_arr)
        this.$emit('delfun', idx, cur_idx)
      }
    },
    // 新增组合
    addcom_handle () {
      if (this.com_arr.length === this.max_com) {
        this.$Message.warning('最多只能添加5个组合~.~')
      } else if (isArray(this.com_arr)) {
        let last_sel_id = 0
        this.com_arr.forEach(com => {
          if (com.selected)last_sel_id = com.id
          com.selected = false
          com.edit = false
        })
        const id_temp = genID(1)
        const addcom = {
          name: '双击命名',
          content: {},
          id: id_temp,
          selected: true,
          edit: true
        }
        this.com_arr.push(addcom)
        this.$emit('synfun', this.com_arr)
        this.$emit('fixfun', 'add', last_sel_id, addcom)
      }
    }
  },
  watch: {

  },
  created () {

  }
}
</script>
<style lang="stylus" scoped>
@import './com.styl';
</style>
