<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="1">
        <!-- <i class="el-icon-d-arrow-left"></i> -->
        <el-button icon="el-icon-d-arrow-left" @click="stepBack()" circle></el-button>
      </el-col>
      <el-col :span="15">
        <el-slider v-model="slider" :step="opsStep" :max="total" @change="onChangeSlider">
        </el-slider>
      </el-col>
      <el-col :span="1">
        <!-- <i class="el-icon-d-arrow-right"></i> -->
        <el-button icon="el-icon-d-arrow-right" @click="stepForward()" circle></el-button>
      </el-col>
    </el-row>
    <el-row :gutter="24">
      <el-col :span="17">
        <div id="toolbar-container">
          <!-- <span class="ql-formats">
            <button msg="undo" @click="editorUndo">
              <i class="el-icon-d-arrow-left"></i>
            </button>
            <button msg="redo" @click="editorRedo">
              <i class="el-icon-d-arrow-right"></i>
            </button>
          </span> -->
          <span class="ql-formats">
            <select class="ql-font"></select>
            <select class="ql-size"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-bold"></button>
            <button class="ql-italic"></button>
            <button class="ql-underline"></button>
            <button class="ql-strike"></button>
          </span>
          <span class="ql-formats">
            <select class="ql-color"></select>
            <select class="ql-background"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-script" value="sub"></button>
            <button class="ql-script" value="super"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-header" value="1"></button>
            <button class="ql-header" value="2"></button>
            <button class="ql-blockquote"></button>
            <button class="ql-code-block"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-list" value="ordered"></button>
            <button class="ql-list" value="bullet"></button>
            <button class="ql-indent" value="-1"></button>
            <button class="ql-indent" value="+1"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-direction" value="rtl"></button>
            <select class="ql-align"></select>
          </span>
          <span class="ql-formats">
            <button class="ql-link"></button>
            <button class="ql-image"></button>
            <button class="ql-video"></button>
            <button class="ql-formula"></button>
          </span>
          <span class="ql-formats">
            <button class="ql-clean"></button>
          </span>
        </div>
        <div>
          <!-- bidirectional data binding（双向数据绑定） -->
          <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
            @ready="onEditorReady($event)" @change="onEditorChange($event)">
          </quill-editor>
        </div>
      </el-col>
      <el-col :span="6">
        here is the list
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import {
    getDocOps
  } from '../api/doc';
  import {
    mapGetters
  } from 'vuex';
  export default {
    name: 'TimeSlider',
    data() {
      return {
        ops: {},
        total: 100,
        count: 30,
        opsStep: 1,
        slider: 0,
        content: '',
        editorOption: {
          // some quill options
          modules: {
            // syntax: true,
            toolbar: '#toolbar-container',
            history: {
              delay: 10000,
              maxStack: 500,
              userOnly: false,
              // userOnly: true
            }
          },
          placeholder: '',
          theme: 'snow'
        }
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill
      },
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'userInfo',
        // ...
      ])
    },
    created() {
      this.getDocOps();
    },
    watch: {
      '$route': function () {
        this.getDocOps();
      }
    },
    mounted() {
      console.log('this is current quill instance object', this.editor);
      this.editor.disable();
      this.editor.on('text-change', this.onTextChange);
    },
    methods: {
      onTextChange(delta, oldDelta, source) {
        if (source !== 'user') return;
        let d = new Date();
        // let len = delta.ops.length;
        // let color = colors[this.userInfo.id - 1];
        // // 一般有多个操作，暂时在insert上加一个attributes
        // for (let i = 0; i < delta.ops.length; i++) {
        //   let op = delta.ops[i];
        //   if (op.insert) {
        //     op.attributes = {
        //       // color: color,
        //       user: this.userInfo.name
        //     }
        //     // 可以上色
        //     // vm.$set(op, 'attributes', 'red')
        //   } else {

        //   }
        // }
        console.log(d.getSeconds() + JSON.stringify(delta));
      },
      getDocOps(from, to) {
        let queryString = {
          documentId: this.$route.query.documentId,
          collection: this.$route.query.collection,
          from: from || 1,
          to: to || 30
        };
        getDocOps(queryString)
          .then(result => {
            // let ops = result.ops;
            // console.log(result);
            this.ops = result.ops.map(record => {
              return record.op ? record.op : [];
            });
            this.total = result.total;
            this.count = this.ops.length;
            this.slider = 0;
            this.opsStep = Math.floor(this.count / 10) || 1;
            // for (let o of result.ops) {
            //   // console.log(o);
            //   if (o.op) {
            //     // console.log(o.op);
            //     this.editor.updateContents(o.op);
            //   } else if (o.create) {
            //     console.log('o is the create operation');
            //     console.log('the o has no op');
            //   }
            // }
          })
          .catch(err => {
            console.log(err);
          });
      },
      onChangeSlider(val) {
        this.editor.setContents([]);
        for (let i = 0; i < val; i++) {
          this.editor.updateContents(this.ops[i].ops, 'api');
        }
      },
      stepBack() {
        let num = this.slider - this.opsStep;
        this.slider = num < 0 ? 0 : num;
        this.onChangeSlider(this.slider);
      },
      stepForward() {
        let num = this.slider + this.opsStep;
        this.slider = num > this.count ? this.count : num;
        this.onChangeSlider(this.slider);
      },
      editorRedo() {
        console.log('redo')
        this.editor.history.redo()
      },
      editorUndo() {
        console.log('undo')
        this.editor.history.undo()
      },
      onEditorBlur(quill) {
        // console.log('editor blur!', quill)
      },
      onEditorFocus(quill) {
        // console.log('editor focus!', quill)
      },
      onEditorReady(quill) {
        // console.log('editor ready!', quill)
      },
      onEditorChange({
        quill,
        html,
        text
      }) {
        // console.log('editor change!', quill, html, text)
        this.content = html
      }
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .slider {
    margin: 1em;
  }

</style>
