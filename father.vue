<template>
  <div>
    <div class="filter-group">
      <Select v-model="attr" placeholder="统计维度" @on-open-change="openChange" filterable>
        <Option
          v-for="item in attrList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Select v-model="people" placeholder="人群属性" @on-open-change="openChange" filterable>
        <Option
          v-for="item in peopleList"
          :value="item.value"
          :key="item.value"
          >{{ item.label }}</Option
        >
      </Select>
      <Csearch
        placeholder="媒体"
        :default_selall="default_selall"
        :trans_unselList="Media_List"
        :trans_selList="res_Media_List"
        @func="getMedia_List"
      />
      <Button type="primary" ghost @click="game_modal = true">游戏组</Button>
    </div>
    <div class="check-box">
      <Checkbox v-model="is_forecast" @on-change="forecast_handle">模拟预测走势</Checkbox>
      <Upload action="" :before-upload="preUpload">
        <Button type="primary" ghost>导入模拟数据</Button>
      </Upload>
    </div>
    <div class="right-btn-group">
      <Button type="primary" v-if="combine_show" ghost @click="combine_handle">组合</Button>
      <date-pick
        type="daterange"
        :value="datetime"
        :options="datetimeOption"
        confirm
        :clearable="false"
        :editable="false"
        split-panels
        :transfer="false"
        @on-change="handleDatetime"
        @on-ok="confirmDatetime"
        @on-clear="day_clear"
        @on-clear-shortcut="clearShortCut"
        placement="bottom-end"
        placeholder="请选择查询日期范围"
        style="width: 200px"
      />
    </div>
    <div class="refresh-btn">
      <Button icon="md-refresh" type="dashed" @click="refresh_handle">刷新缓存</Button>
    </div>
    <div class="tags-group">
      <Tag
        v-for="item in count"
        :key="item.id"
        type="dot"
        color="#7da3c7"
        :name="item.name"
        closable
        @click.native="tag_click(item.id)"
        @on-close="tagClose(item.id)"
        >{{ item.name }}</Tag
      >
      <Button icon="ios-add" type="dashed" @click="handleAdd"
        >添加组合筛选</Button
      >
    </div>
    <div class="chart-table" :style="ct_style">
      <div>
        <Cchart :loading="chartloading" :options="options" />
      </div>
      <div>
        <Checkbox v-model="show_value" @on-change="showvalue_handle">显示具体数值</Checkbox>
        <div class="right-btn-group">
          <Button type="primary" size="small" @click="export_handle">导 出</Button>
        </div>
        <div class="table-box">
          <el-table
            ref="c_table"
            v-loading="tableloading"
            :data="tableData"
            :height="tableHeight"
            :cell-style="colorStyle"
            border
            style="width: 100%;"
            :row-style="{ height: '40px'}"
          >
            <el-table-column
              align="center"
              prop="date"
              label="日期"
              fixed
              min-width="130px"
            >
            </el-table-column>
            <el-table-column
              align="center"
              prop="peopleType"
              label="人群属性"
              fixed
              min-width="80px"
            >
            </el-table-column>
            <el-table-column
              align="left"
              prop="peopleNum"
              label="人数"
              fixed
              min-width="80px"
            >
            </el-table-column>
            <el-table-column prop="ltv_1day" label="1日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_1day.ltv_day_rate==='object'? '':scope.row.ltv_1day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_1day.ltv_day_num==='object'? '':scope.row.ltv_1day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_2day" label="2日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_2day.ltv_day_rate==='object'? '':scope.row.ltv_2day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_2day.ltv_day_num==='object'? '':scope.row.ltv_2day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_3day" label="3日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_3day.ltv_day_rate==='object'? '':scope.row.ltv_3day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_3day.ltv_day_num==='object'? '':scope.row.ltv_3day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_4day" label="4日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_4day.ltv_day_rate==='object'? '':scope.row.ltv_4day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_4day.ltv_day_num==='object'? '':scope.row.ltv_4day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_5day" label="5日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_5day.ltv_day_rate==='object'? '':scope.row.ltv_5day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_5day.ltv_day_num==='object'? '':scope.row.ltv_5day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_6day" label="6日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_6day.ltv_day_rate==='object'? '':scope.row.ltv_6day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_6day.ltv_day_num==='object'? '':scope.row.ltv_6day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_7day" label="7日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_7day.ltv_day_rate==='object'? '':scope.row.ltv_7day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_7day.ltv_day_num==='object'? '':scope.row.ltv_7day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_14day" label="14日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_14day.ltv_day_rate==='object'? '':scope.row.ltv_14day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_14day.ltv_day_num==='object'? '':scope.row.ltv_14day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_21day" label="21日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_21day.ltv_day_rate==='object'? '':scope.row.ltv_21day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_21day.ltv_day_num==='object'? '':scope.row.ltv_21day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_30day" label="30日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_30day.ltv_day_rate==='object'? '':scope.row.ltv_30day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_30day.ltv_day_num==='object'? '':scope.row.ltv_30day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_45day" label="45日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_45day.ltv_day_rate==='object'? '':scope.row.ltv_45day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_45day.ltv_day_num==='object'? '':scope.row.ltv_45day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_60day" label="60日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_60day.ltv_day_rate==='object'? '':scope.row.ltv_60day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_60day.ltv_day_num==='object'? '':scope.row.ltv_60day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_75day" label="75日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_75day.ltv_day_rate==='object'? '':scope.row.ltv_75day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_75day.ltv_day_num==='object'? '':scope.row.ltv_75day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_90day" label="90日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_90day.ltv_day_rate==='object'? '':scope.row.ltv_90day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_90day.ltv_day_num==='object'? '':scope.row.ltv_90day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_105day" label="105日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_105day.ltv_day_rate==='object'? '':scope.row.ltv_105day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_105day.ltv_day_num==='object'? '':scope.row.ltv_105day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_120day" label="120日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_120day.ltv_day_rate==='object'? '':scope.row.ltv_120day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_120day.ltv_day_num==='object'? '':scope.row.ltv_120day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_135day" label="135日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_135day.ltv_day_rate==='object'? '':scope.row.ltv_135day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_135day.ltv_day_num==='object'? '':scope.row.ltv_135day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_150day" label="150日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_150day.ltv_day_rate==='object'? '':scope.row.ltv_150day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_150day.ltv_day_num==='object'? '':scope.row.ltv_150day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_165day" label="165日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_165day.ltv_day_rate==='object'? '':scope.row.ltv_165day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_165day.ltv_day_num==='object'? '':scope.row.ltv_165day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_180day" label="180日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_180day.ltv_day_rate==='object'? '':scope.row.ltv_180day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_180day.ltv_day_num==='object'? '':scope.row.ltv_180day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_210day" label="210日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_210day.ltv_day_rate==='object'? '':scope.row.ltv_210day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_210day.ltv_day_num==='object'? '':scope.row.ltv_210day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_240day" label="240日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_240day.ltv_day_rate==='object'? '':scope.row.ltv_240day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_240day.ltv_day_num==='object'? '':scope.row.ltv_240day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_270day" label="270日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_270day.ltv_day_rate==='object'? '':scope.row.ltv_270day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_270day.ltv_day_num==='object'? '':scope.row.ltv_270day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_300day" label="300日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_300day.ltv_day_rate==='object'? '':scope.row.ltv_300day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_300day.ltv_day_num==='object'? '':scope.row.ltv_300day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_330day" label="330日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_330day.ltv_day_rate==='object'? '':scope.row.ltv_330day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_330day.ltv_day_num==='object'? '':scope.row.ltv_330day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="ltv_360day" label="360日" min-width="90px">
              <template slot-scope="scope">
                <span class="center-span" :style="p_style">{{
                  typeof scope.row.ltv_360day.ltv_day_rate==='object'? '':scope.row.ltv_360day.ltv_day_rate
                }}</span>
                <span class="right-span" v-if="show_value">{{
                  typeof scope.row.ltv_360day.ltv_day_num==='object'? '':scope.row.ltv_360day.ltv_day_num
                }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="combineDiv" v-if="com_show">
      <Ccombine
        :com_arr="com_arr"
        :max_com="max_com"
        @synfun="syn_handle"
        @fixfun="fix_handle"
        @delfun="del_handle"
        @changename="changename_handle"
      />
    </div>
    <Modal
      v-model="game_modal"
      title="游戏组选择"
      width="1000px"
      @on-ok="game_ok"
      @on-cancel="game_cancel"
    >
      <div class="select-div">
        <selecter
          v-model="mult_group"
          :data="gameGroup"
          search
          :title="['游戏组', '游戏包']"
          @on-select="selectAll"
          @on-delete="delTag"
          @on-clear="clearTag"
        />
      </div>
    </Modal>
    <Modal
      v-model="combine_modal"
      title="组合编辑"
      width="816px"
      @on-ok="combine_ok"
      @on-cancel="combine_cancel"
    >
      <div class="combine-div">
        <div class="filter-group">
          <Select v-model="attr" placeholder="统计维度" filterable>
            <Option
              v-for="item in attrList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Select v-model="people" placeholder="人群属性" filterable>
            <Option
              v-for="item in peopleList"
              :value="item.value"
              :key="item.value"
              >{{ item.label }}</Option
            >
          </Select>
          <Csearch
            placeholder="媒体"
            :trans_unselList="Media_List"
            :trans_selList="res_Media_List"
            @func="getMedia_List"
          />
          <Button type="primary" ghost @click="game_modal = true"
            >游戏组</Button
          >
          <date-pick
            type="daterange"
            :value="datetime"
            :options="datetimeOption"
            confirm
            :clearable="false"
            :editable="false"
            split-panels
            :transfer="false"
            @on-change="handleDatetime"
            @on-ok="confirmDatetime"
            @on-clear="day_clear"
            @on-clear-shortcut="clearShortCut"
            placement="bottom-end"
            placeholder="请选择查询日期范围"
            style="width: 200px"
          />
        </div>
        <Collapse v-model="sel_comid" accordion simple>
          <Panel :name="item.comid" v-for="item in comlist" :key="item.comid">
            {{ item.comname }}
            <p slot="content">{{ item.comcontent }}</p>
          </Panel>
        </Collapse>
      </div>
    </Modal>
    <Modal
      v-model="input_modal"
      title="请为组合命名："
      width="520px"
      @on-ok="input_ok"
      @on-cancel="input_cancel"
    >
      <Input
        v-model="tag_name"
        maxlength="10"
        clearable
        show-word-limit
        placeholder="如：组合一"
        style="width: 100%"
      />
    </Modal>
    <form style="visibility:hidden;" method="POST" target="_blank" action="https://***">
      <input type="hidden" name="params" :value="formval" />
    </form>
  </div>
</template>

<script>
import { getLTVReport, importLtvData, getGameGroup, getMedia, getLtvRetainReportMutiCondition, addLtvRetainReportMutiCondition, deleteLtvRetainReportMutiCondition, danalysisLtvPrediction } from '@/api/common.model'
import { color_cell_handle, gameGroup_handle, set_gameGroup, isArray } from '@/common/js/c_common'
import { Table, TableColumn } from 'element-ui'
import Selecter from '@/components/select/selecter.vue'
import Csearch from '@/components/c-search/index.vue'
import Cchart from '@/components/c-chart/index.vue'
import Ccombine from '@/components/c-combine/index.vue'
import DatePick from '@/components/date-picker'
import shortcuts from '@/data/shortcuts'
// import chartOption from '@/data/chart_option'
import tenOption from '@/data/options/ten_option'
import simOption from '@/data/options/sim_option'
import impOption from '@/data/options/imp_option'
import mixOption from '@/data/options/mix_options'
import selectList from '@/data/select_list'
import lineTableData from '@/data/ltv_detail_res'
import {
  findCheck,
  formatDate,
  debounce,
  getNameOfData,
  clearTagOfData,
  deepCopy
} from '@/common/js/utils'
export default {
  name: 'ltvpage',
  components: {
    Cchart,
    Csearch,
    Ccombine,
    Selecter,
    DatePick,
    ElTable: Table,
    ElTableColumn: TableColumn
  },
  props: {},
  computed: {
    ct_style () {
      return {
        height: `${this.screenHeight - 240}px`
      }
    },
    tableHeight () {
      return `${(this.screenHeight - 240) / 2 - 40}px`
    },
    mult_group () {
      return findCheck(this.gameGroup)
    }
  },
  data () {
    const date = new Date()
    var fday
    if (date.getMonth() < 9) {
      fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
    } else {
      fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
    }
    const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
    return {
      formval: '',
      max_com: 5, // 组合最大数量
      g_cur_idx: 0, // 当前聚焦组合index
      g_legend: [], // 图例
      condition_temp: {
        gameIds: [],
        gameKeys: [],
        mediaIds: [],
        peopleAttr: '1',
        peopleType: '1',
        beginTime: fday,
        endTime: now
      }, // 临时存储当前的条件
      line_temp: [], // 临时存储当前的折线数据
      table_temp: [], // 临时存储当前的表格数据
      big_data_box: [{ // 组合盒子
        name: '组合6',
        content: {},
        id: 0
      }, {
        name: '组合2',
        content: {},
        id: 1
      }],
      com_arr: [{ // 默认组合
        name: '双击命名',
        content: {},
        id: 0,
        selected: true,
        edit: false
      }],
      tableloading: false,
      default_selall: false,
      com_show: true,
      tableData: [],
      is_forecast: true,
      show_value: true,
      screenHeight: window.innerHeight,
      game_modal: false,
      combine_show: false,
      combine_modal: false,
      gameGroup: [],
      gameGroup_init: [],
      gameGroupIds: [],
      gameGroupKeys: [],
      input_modal: false,
      tag_name: '',
      count: [],
      Media_List: [],
      res_Media_List: [],
      sel_Media_List: [],
      chartloading: false,
      datetime: [fday, now],
      comDate: [fday, now],
      datetimeOption: {
        shortcuts,
        disabledDate (date) {
          return date && date.valueOf() > Date.now()
        }
      },
      options: mixOption,
      attrList: selectList.attrList,
      peopleList: selectList.peopleList,
      comlist: selectList.comlist,
      sel_comid: '1',
      attr: '1',
      people: '1',
      p_style: {
        left: '30%',
        top: '34%'
      }
    }
  },
  watch: {
    comDate (nVal) {
      debounce(() => {
        // console.log('send the xhr request')
      }, 500)()
    }
  },
  methods: {
    // 折线组合处理
    line_joint_handle (motion, l_data) {
      let option_temp = {}
      const series_temp = []
      this.g_legend = []
      this.com_arr.forEach(com => {
        this.g_legend.push(com.name)
        series_temp.push({
          name: com.name,
          type: 'line',
          data: com.content.line_data,
          smooth: true
        })
      })
      if (motion === 'd_search') { // 预测
        option_temp = deepCopy(this.options)
        if (option_temp.legend.data[0] === '导入模拟') { // 从导入到预测
          option_temp = this.option_handle('sim')
        }
        option_temp = this.option_handle('mix')
        option_temp.series = series_temp
        option_temp.series[this.g_cur_idx].data = l_data.realData

        this.g_legend.unshift(this.g_legend[this.g_cur_idx] + '模拟')
        option_temp.series.unshift({
          name: this.g_legend[0],
          type: 'line',
          data: l_data.predData,
          smooth: true,
          lineStyle: {
            type: 'dashed'
          }
        })

        option_temp.legend.data = this.g_legend
        this.line_temp = l_data.realData
      } else if (motion === 'search') {
        option_temp = this.option_handle('mix')
        option_temp.series = series_temp
        option_temp.series[this.g_cur_idx].data = l_data
        option_temp.legend.data = this.g_legend
        this.line_temp = l_data
      }
      return option_temp
    },
    // 表格数据拼接处理
    table_joint_handle (motion, t_data) {
      const mix_data = []
      const mix_box = []
      this.com_arr.forEach(com => {
        mix_box.push(com.content.table_data)
      })
      if (motion === 'd_search') { // 预测
        mix_box[this.g_cur_idx] = t_data.realData
        mix_box.unshift(t_data.predData)
        this.table_temp = t_data.realData
      } else if (motion === 'search') {
        mix_box[this.g_cur_idx] = t_data.realData
        this.table_temp = t_data
      }
      mix_box.forEach(data => {
        mix_data.push(...data)
      })
      return mix_data
    },
    syn_handle (newValue) {
      this.com_arr = newValue
    },
    // 上一个组合内容被锁定，并开始填充新增组合内容或者修改当前组合内容的操作，add或者focus点击触发
    fix_handle (motion, last_sel_id, param) {
      // let addcom = {}
      let cur_idx
      // 上一个选中组合的内容固定操作
      this.com_arr.forEach(com => {
        if (com.id === last_sel_id) {
          com.content = {
            condition: this.condition_temp,
            line_data: this.line_temp,
            table_data: this.table_temp
          }
        }
      })
      if (motion === 'add') { // 新增组合，因为新增组合虽然是选中组合但是没有内容所以不需要做赋值动作
        // addcom = param
        this.g_cur_idx = this.com_arr.length - 1
      } else if (motion === 'click') { // 选中某个组合,需要有赋值操作
        cur_idx = param
        this.g_cur_idx = param
        // 当前组合筛选条件赋值
        const content = this.com_arr[cur_idx].content
        const [t_con, t_table] = [content.condition, content.table_data]
        this.attr = t_con.peopleAttr
        this.people = t_con.peopleType
        this.res_Media_List = t_con.mediaIds
        this.clearTag({list: this.gameGroup})
        this.gameGroup = set_gameGroup(t_con.gameKeys
          ? t_con.gameKeys : [], this.gameGroup_init)
        this.gameGroupIds = t_con.gameIds
        this.gameGroupKeys = t_con.gameKeys
        this.datetime = [t_con.beginTime, t_con.endTime]
        this.comDate = [t_con.beginTime, t_con.endTime]
        // 表格显示组合拼接表格
        // console.log(t_table)
        this.tableData = t_table
        setTimeout(() => {
          this.ct_query()
        }, 500)
      }
    },
    // 删除某个组合
    del_handle (idx, cur_idx) {
      if (cur_idx === 999) {
        this.g_cur_idx -= 1
      } else {
        this.g_cur_idx = cur_idx
      }
      setTimeout(() => {
        this.ct_query()
      }, 500)
    },
    // 组合改名字
    changename_handle (idx, name) {
      setTimeout(() => {
        this.ct_query()
      }, 500)
    },
    // option的分别处理
    option_handle (type) {
      let option_temp = {}
      switch (type) {
        case 'sim': // 到模拟
          option_temp = deepCopy(simOption)
          break
        case 'ten': // 到趋势
          option_temp = deepCopy(tenOption)
          break
        case 'imp': // 到导入
          option_temp = deepCopy(impOption)
          break
        case 'mix': // 到混合
          option_temp = deepCopy(mixOption)
          break
      }
      return option_temp
    },
    // 导入模拟数据
    preUpload (file) {
      const {size, name, type} = file

      console.log(size)
      console.log(name)
      console.log(type)
      if (!['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
      // if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(type)) {
        this.$Message.error({
          closable: true,
          duration: 5,
          content: `${name} 格式错误！仅支持后缀.xlsx`
        })
        return false
      }
      if (size > 10 * 1024 * 1024) {
        this.$Message.error({
          closable: true,
          duration: 5,
          content: `上传的文件名 ${name} 超过限制大小10M~`
        })
        return false
      }
      this.uploadFile(file)
      return false
    },
    uploadFile (file) {
      this.is_forecast = true
      importLtvData({file}).then(data => {
        if (data && typeof data !== 'symbol') {
          this.tableData = [] // 导入不显示表格数据
          const l_data = data.lineData
          const option_temp = this.option_handle('imp')
          option_temp.series[0].data = l_data.predData
          this.options = option_temp
        }
      })
    },
    // 导出
    export_handle () {
      var req_obj = {
        gameIds: this.gameGroupIds,
        mediaIds: this.sel_Media_List,
        peopleAttr: this.attr,
        peopleType: this.people,
        beginTime: this.comDate[0],
        endTime: this.comDate[1]
      }
      let params = JSON.stringify(req_obj)
      params = params.replace(/"([^"]*)"/g, "'$1'")
      this.formval = params
      setTimeout(() => {
        document.forms[0].submit()
      })
    },
    // 单元格定制背景颜色
    colorStyle ({ row, column, rowIndex, columnIndex }) {
      if (['日期', '人群属性', '人数'].includes(column.label)) {
        return ''
      }
      return color_cell_handle(row, column, rowIndex, columnIndex)
    },
    // 具体数值显示与否
    showvalue_handle (status) {
      // this.show_value = false
      if (!status) {
        this.p_style.left = '50%'
        this.p_style.top = '50%'
      } else {
        this.p_style.left = '30%'
        this.p_style.top = '34%'
      }
    },
    // 是否模拟预测
    forecast_handle (status) {
      let option_temp = {}
      if (status) { // 预测
        option_temp = this.option_handle('mix')
      } else { // 取消预测
        option_temp = this.option_handle('mix')
      }
      this.options = option_temp
      setTimeout(() => {
        this.ct_query()
      }, 500)
    },
    // 选择游戏组
    game_ok () {
      this.gameGroupIds = gameGroup_handle(this.gameGroup).ids_arr
      this.gameGroupKeys = gameGroup_handle(this.gameGroup).keys_arr
      this.ct_query()
    },
    game_cancel () {
      this.$Message.info('已取消')
    },
    // 折线组合编辑
    combine_ok () {
      this.$Message.info('Clicked ok')
    },
    combine_cancel () {
      this.$Message.info('Clicked cancel')
    },
    // 折线组合
    combine_handle () {
      this.combine_modal = true
    },
    // 添加组合筛选
    handleAdd () {
      if (this.count.length <= 2) {
        this.input_modal = true
      } else {
        this.$Message.warning('最多记录3条组合')
      }
    },
    input_ok () {
      // 添加组合筛选————拿到输入值
      if (this.tag_name) {
        var tag_req = {
          name: this.tag_name,
          gameKeys: this.gameGroupKeys.join(','),
          mediaIds: this.sel_Media_List.join(','),
          type: 1,
          peopleAttr: this.attr,
          peopleType: this.people
        }
        addLtvRetainReportMutiCondition(tag_req).then(data => {
          if (data) {
            this.$Message.success('添加成功~')
            this.getLtvRetainReportMutiCondition()
          } else {
            // this.$Message.warning('最多记录3条组合')
            this.$Message.warning(data)
          }
        })
      } else {
        this.$Message.warning('输入为空不添加新组合！')
      }
    },
    input_cancel () {
      this.$Message.info('已取消')
    },
    tag_click (tagid) {
      // 点击tag去查筛选条件
      this.getLtvRetainReportMutiCondition({
        id: tagid
      })
    },
    tagClose (tagid) {
      // 删除某个tag
      deleteLtvRetainReportMutiCondition({
        ids: tagid
      }).then(data => {
        if (data) {
          this.$Message.success('删除成功~')
          this.getLtvRetainReportMutiCondition()
        } else {
          this.$Message.error('删除失败！')
        }
      })
    },
    getLtvRetainReportMutiCondition (addobj = {}) {
      if (Object.keys(addobj).length) {
        // 单个组合查询
        getLtvRetainReportMutiCondition({
          ...addobj,
          type: 1
        }).then(data => {
          if (data && data.length > 0) {
            this.res_Media_List = data[0].mediaIds
              ? data[0].mediaIds.split(',')
              : []
            this.attr = data[0].peopleAttr
            this.people = data[0].peopleType
            this.clearTag({list: this.gameGroup})
            this.gameGroup = set_gameGroup(data[0].gameKeys
              ? data[0].gameKeys.split(',') : [], this.gameGroup_init)
            this.gameGroupIds = gameGroup_handle(this.gameGroup).ids_arr
            this.gameGroupKeys = gameGroup_handle(this.gameGroup).keys_arr
            const self = this

            setTimeout(() => {
              self.ct_query()
            }, 100)
          }
        })
      } else {
        // alert('all')
        getLtvRetainReportMutiCondition({
          type: 1
        }).then(data => {
          this.count = data
        })
      }
    },
    // 日期选择器
    handleDatetime (val) {
      this.datetime = val
    },
    confirmDatetime () {
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
      setTimeout(() => {
        this.ct_query()
      }, 500)
    },
    day_clear () {
      const date = new Date()
      var fday
      if (date.getMonth() < 9) {
        fday = date.getFullYear() + '-0' + (date.getMonth() + 1) + '-01'
      } else {
        fday = date.getFullYear() + '-' + (date.getMonth() + 1) + '-01'
      }
      const now = formatDate(date, 'yyyy-MM-dd') // 初始化默认时间
      this.datetime = [fday, now]
      this.comDate = JSON.parse(JSON.stringify(this.datetime))
    },
    clearShortCut () {
      const shortCut = document.querySelectorAll('.ivu-picker-panel-shortcut')
      const len = shortCut.length
      for (let i = 0; i < len; i++) {
        shortCut[i].style.background = 'none'
      }
    },
    // 全选
    selectAll ({ list, check = true, current = '' }) {
      let data
      if (current) {
        const item = getNameOfData(list, current)
        data = item.children
      } else data = list
      data.forEach(ret => {
        if (ret.children && ret.children.length) {
          ret.children.map(rec => {
            this.$set(rec, 'check', check)
            return rec
          })
        } else this.$set(ret, 'check', check)
      })
    },
    // 删除已选
    delTag ({ list, name }) {
      const data = getNameOfData(list, name)
      if (data.children && data.children.length) {
        this.selectAll({ list, check: false, current: data.value })
      } else {
        this.$set(data, 'check', false)
      }
    },
    // 清空全部
    clearTag ({ list }) {
      clearTagOfData(list, this)
    },
    // 查询媒体
    getMediaList () {
      getMedia().then(data => {
        this.Media_List = this.selectedList_handle(data)
      })
    },
    // 拿到选择的媒体
    getMedia_List (list, first) {
      this.sel_Media_List = list
      if (list && !first) {
        setTimeout(() => {
          this.ct_query()
        }, 500)
      }
    },
    get_tabledata () {
      const self = this
      var res = lineTableData
      self.tableData = res.data.tableData
    },
    get_linedata () {
      var res = lineTableData.data.lineData
      let i = 0
      const option_temp = deepCopy(mixOption)
      res.forEach(line => {
        if (i < option_temp.series.length) {
          option_temp.series[i].data = line
        }
        i++
      })
      option_temp.dataZoom.start = 0
      option_temp.dataZoom.end = 100
      this.options = option_temp
    },
    getGameGroup () {
      getGameGroup().then(data => {
        if (data && isArray(data)) {
          // this.gameGroup = data
          this.gameGroup_init = data
          this.gameGroup = this.default_selall ? set_gameGroup([], this.gameGroup_init, this.default_selall) : data
          // this.gameGroupIds = gameGroup_handle(this.gameGroup).ids_arr
          // this.gameGroupKeys = gameGroup_handle(this.gameGroup).keys_arr
        }
      })
    },
    // 处理选项数组
    selectedList_handle (list) {
      if (isArray(list) && list.length > 0) {
        var res_list = []
        list.forEach(item => {
          var k_arr = Object.keys(item)
          var o = {}
          o.value = item[k_arr[0]]
          o.label = item[k_arr[1]]
          res_list.push(o)
        })
        return res_list
      }
    },
    // 下拉框控制搜索
    openChange (isopen) {
      if (!isopen) {
        this.ct_query()
      }
    },
    // 查询拿到表格以及折线图数据
    ct_query () {
      this.tableloading = true
      this.chartloading = true
      const req_obj = {
        gameIds: this.gameGroupIds,
        mediaIds: this.sel_Media_List,
        peopleAttr: this.attr,
        peopleType: this.people,
        beginTime: this.comDate[0],
        endTime: this.comDate[1]
      }
      this.condition_temp = {
        ...req_obj,
        gameKeys: this.gameGroupKeys
      }
      this.table_temp = []
      this.line_temp = []
      if (this.is_forecast) {
        danalysisLtvPrediction(req_obj).then(data => {
          if (data && typeof data !== 'symbol') {
            // 拼接
            // const t_data = deepCopy(data.tableData)
            // this.tableData = this.table_joint_handle('d_search', t_data)

            // 仅显示当前组合表格数据
            const t_data = deepCopy(data.tableData)
            const mix_data = deepCopy(t_data.realData)
            mix_data.push(...t_data.predData)
            this.tableData = mix_data
            this.table_temp = mix_data

            const l_data = data.lineData
            this.options = this.line_joint_handle('d_search', l_data)
          }
        })
      } else {
        getLTVReport(req_obj).then(data => {
          if (data && typeof data !== 'symbol') {
            // 拼接
            // const t_data = deepCopy(data.tableData)
            // this.tableData = this.table_joint_handle('search', t_data)

            // 仅显示当前组合表格数据
            this.tableData = data.tableData
            this.table_temp = data.tableData

            const l_data = data.lineData
            this.options = this.line_joint_handle('search', l_data)
          }
        })
      }
      setTimeout(() => {
        this.tableloading = false
        this.chartloading = false
      }, 800)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.screenHeight = window.innerHeight
    })
    window.onresize = () => {
      return (() => {
        window.screenHeight = window.innerHeight
        this.screenHeight = window.screenHeight
      })()
    }
  },
  created () {
    this.getGameGroup()
    this.getMediaList()
    // this.get_tabledata()
    // this.get_linedata()
    setTimeout(() => {
      this.getLtvRetainReportMutiCondition()
    }, 500)
  }
}
</script>

<style lang="stylus" scoped>
.ivu-select {
    width: 150px;
}
.chart {
  width: 100%
  height: 400px
}
.right-btn-group .ivu-btn {
    margin-right: 6px;
    margin-left: 0px
}
.combine-div .ivu-btn {
    margin-right: 6px;
}
.filter-group>div:last-child {
    margin-right: 0px;
}
/deep/.ivu-picker-confirm>.ivu-btn:first-child {
  display: none;
}
.ivu-collapse {
  margin-top: 10px
}
.tags-group {
  margin-top: 8px
}
.right-btn-group {
    right: 150px;
  }
.check-box {
  position: absolute;
  z-index: 10;
  right: 8px;
  top: 52px;
  border: 1px solid #7da3c7ba;
  padding: 6px;
  border-radius: 8px;
  box-shadow: 0px 0px 2px 1px #7da3c7;
  .ivu-btn {
    margin-top: 4px
  }
  .ivu-checkbox-wrapper {
    display: block;
    margin-right: 8px;
  }
}
span.center-span {
    display: inline-block;
    position: absolute;
    left: 40%;
    top: 30%;
    transform: translate(-50%, -50%);
    transition: .5s
    color: #5d49cc
}
span.right-span {
    display: inline-block;
    position: absolute;
    right: 1px;
    bottom: -6px;
    transition: .5s
}
.chart-table {
  background-color: #fff;
  width: 100%;
  margin-top: 10px;
  border-radius: 8px;
  border: 1px solid #bad1e6;
  box-shadow: 0px 0px 4px 0px #436586;
}
.chart-table>div {
  position: relative
  height: 50%
  padding: 14px
  .right-btn-group {
    top: 2px;
    right: 7px;
    z-index: 10
    .ivu-btn {
      width: 60px
      margin-right: 0px
    }
  }
  &:first-child {
    border-bottom: 2px solid rgb(186, 209, 230)
    padding: 10px 14px 4px
  }
  &:last-child {
    padding-top: 6px
    padding: 6px
  }
}
// 自定义组合
.combineDiv {
  top: 150px
  left: 120px
  position: absolute
  z-index: 10
}

/deep/ .ivu-upload-list {
  display: none;
}
</style>
