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
        A: [],
        X: [],
        Y: [],
        IMETyping: false,
        toSend: false,
        ac: false,
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
      // this.io.on('new_changes', this.syncServer);
      // this.io.on('accept_commit', this.syncACK);
      // this.io.on('error', this.disable());
    },
    methods: {
      syncSocket() {
        // 这里在发送，处理socket
        if (this.toSend) {
          if (this.IMETyping) {
            // 中文输入时，不发送，等待输入完毕，再同步
          } else {
            if (this.ac) {
              // 确保服务器已经接受上一个请求了
              // send y ,update x
              this.X = this.Y;
              this.Y = [];
              this.editor.disable();
              // send.then(this.editor.enable());
              this.toSend = false;
            } else {

            }
          }
        } else {

        }
      },
      // syncIME(){

      // },
      syncServer(data) {
        // 解析data中的changeset
        // 插入到文档中
        // b=data.changeset;
        // a'=ab
        // x'=follow(b,x);
        // xb=follow(x,b);
        // y'=follow(xb,y);
        // d=follow(y,xb);

        // 更新数据
        // a=a';
        // x=x';
        // y=y';

        // this.editor.updateContent(d);
      },
      syncACK(data) {
        // 将A,X,Y更新
        // a=a.compose(x)
        // x=[];
      },
      onIMETypeStart() {
        this.IMETyping = true;
      },
      onIMETypeEnd() {
        // 这里同步IME输入
        // x=y
        // send x
        // y = []
        this.IMETyping = false;
        // this.syncIME();
      },
      setInterTimer() {
        setInterval(() => {
          this.toSend = true;
        }, 500);
      },
      onTextChange(delta, oldDelta, source) {
        if (source == 'api') {
          console.log("An API call triggered this change.");
        } else if (source == 'user') {
          console.log("A user action triggered this change.");
          // if (source !== 'user') return;
          let d = new Date();
          console.log(d.getSeconds() + JSON.stringify(delta));
          // text-change主要是收集Y
          // 在syncSocket中将编辑器disable()
          // while (this.toSend) {;
          // }
          this.Y.push(delta);
          this.syncSocket();
        }
      },
      getDocOps(from, to) {
        let queryString = {
          documentId: this.$route.query.documentId,
          collectionName: this.$route.query.collectionName,
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
