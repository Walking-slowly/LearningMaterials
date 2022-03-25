<template>
  <el-form
    class="common-form"
    ref="CommonForm"
    :model="formValues"
    v-bind="{
      ...formProps,
      rules
    }"
    :validate-on-rule-change="false"
  >
    <el-row :gutter="gutter">
      <el-col
        v-for="(item, i) in formCols"
        :key="i"
        v-bind="item.span ? { span: item.span } : {}"
      >
        <!-- label -->
        <div v-if="item.type === 'label'">
          <h4 class="label-title">
            {{ item.label }}
            <el-tooltip
              :content="item.tips"
              placement="top"
              v-if="item.tips"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
          </h4>
        
          <el-divider class="label-title"/>
        </div>

        <!-- components -->
        <el-form-item
          v-else
          style="padding: 0 20px"
          :label="item.label"
          :prop="item.prop"
          :class="{'hide-lable': item.isShowLable}"
          v-show="!(item.props && item.props.hidden)"
          :label-width="item.labelWidth"
        > 
          <template>
            <el-tooltip
              :content="item.tips"
              placement="top"
              v-if="item.tips"
            >
              <i class="el-icon-question"/>
            </el-tooltip>
          </template>

          <slot v-if="item.type === 'slot'" :name="item.prop"></slot>
          <component
            v-else
            :ref="item.prop"
            style="width: 100%"
            :is="pipeComponents(item)"
            v-model="formValues[item.prop]"
            v-bind="item.props"
            v-on="item.events"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
export default {
  name: 'common-form',
  
  // model: {
  //   prop: ''
  // },

  props: {
    // {
    //   type: 'input', elementui 输入框类型，支持自定义custom类型，支持slot插槽
    //   span: 12,
    //   prop: 'a',
    //   label: '输入框',
    //   rules: [{ required: true, message: '请输入', trigger: 'blur' }],
    //   props: {}, // 输入框属性 --> elmentui属性集成
    //   events: {}, // 输入框事件 --> elementui事件集成
    // }
    cols: {
      type: Array,
      required: true
    },
    
    // elementui form组件属性集成
    formProps: {
      type: Object,
      default: () => { return {} }
    },

    gutter: {
      type: Number,
      default: 0
    },

    model: Object
  },

  data() {
    return {
      formCols: []
    }
  },

  provide() {
    return {
      watchFile: this.watchFile,
      getFileValue: this.getFileValue,
      updateFile: this.updateFile
    }
  },

  methods: {
    pipeComponents (item) {
      if (item.type === 'custom') {
        let component = null
        try {
          component = require(`./${item.prop}.vue`)
        } catch (e) {
          console.error(e)
        }
        return component.default
      } else {
        return `el-${item.type}`
      }
    },

    validate() {
      this.clearValidate()
      return new Promise((res, rej) => {
        this.$refs.CommonForm.validate(vaild => {
          if (vaild) return res(vaild)
          return rej(false)
        })
      })
    },

    validateField(params) {
      return new Promise((res, rej) => {
        this.$refs.CommonForm.validateField(params, vaild => {
          if (!vaild) return res(vaild)
          return rej(false)
        })
      })
    },

    clearValidate(params) {
      this.$refs.CommonForm.clearValidate(params)
    },

    resetFields() {
      this.$refs.CommonForm.resetFields()
    },

    watchFile(file, cb, obj = {}) {
      return this.$watch(`model.${file}`, cb, obj)
    },

    getFileValue(file) {
      return this.$refs[file] && this.$refs[file][0].value
    },

    updateFile(file, obj = {}) {
      const i = this.formCols.findIndex(i => i.prop === file)
      const defaultProps = this.formCols[i].props || {}
      this.$set(this.formCols[i], 'props', { ...defaultProps, ...obj })
      this.$forceUpdate()
    }
  },

  computed: {
    formValues: {
      get () {
        return this.model || {}
      },

      set (val) {
        this.$emit('updata:model', val)
      }
    },

    rules() {
      const { formProps: { rules = {} }, formCols } = this
      const files = ['input', 'input-number']
      let defaultRules = {}
      formCols.map(i => {
        if (i.props && i.props.required) defaultRules[i.prop] = [{ 
          required: true, 
          message: `请${files.includes(i.type) ? '输入' : '选择'}${i.label}`, 
          trigger: 'blur'
        }]
        return i
      })
      return Object.assign({}, defaultRules, rules)
    }
  },

  created() {
    this.formCols = JSON.parse(JSON.stringify(this.cols))
  }
}
</script>

<style scoped>
.common-form /deep/ .el-form-item {
  margin: 0 0 15px 0;
}

.common-form  .hide-lable /deep/ .el-form-item__label {
  visibility: hidden;
}
.common-form .label-title {
  margin: 15px 0;
}
</style>
