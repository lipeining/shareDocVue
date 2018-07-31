<template>
  <div>
    <el-row>
      <el-button @click="logout">
        logout
      </el-button>
    </el-row>
    <div id="toolbar-container">
      <span class="ql-formats">
        <button msg="undo" @click="editorUndo">
          <i class="el-icon-d-arrow-left"></i>
        </button>
        <button msg="redo" @click="editorRedo">
          <i class="el-icon-d-arrow-right"></i>
        </button>
      </span>
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
  </div>
</template>

<script>
  import {shareDBConnection} from '../shareDBConnection'
  import chatConnection from '../chatConnection'
  import {
    logout
  } from '../api/user'
  import {
    mapGetters
  } from 'vuex'
  const colors = ['red', 'blue', 'green', 'gold']
  export default {
    name: 'HelloWorld',
    data() {
      return {
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
          theme: 'snow'
        },
        mydoc: ''
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
    mounted() {
      console.log(chatConnection)
      chatConnection.onopen = function open() {
        chatConnection.send('on open client send hello');
      }
      chatConnection.onmessage = function incoming(data) {
        console.log('wsttt recive a message form server');
        console.log(data);
        // chatConnection.send('wow');
      }
      console.log('this is current quill instance object', this.editor)
      // var mydoc = shareDBConnection.get('examples', 'richtext')
      this.mydoc = shareDBConnection.get('examples', 'richtext')
      const update = () => {
        console.log('update')
        // this.idMatch = query.results.map(e => e).reduce((a, t) => ({ ...a, [t.data.uid]: { sid: t.id } }), {})
        // this.results = query.results.map(e => e.data)
      }
      var query = shareDBConnection.createSubscribeQuery('examples')
      query.on('ready', update)
      query.on('changed', update)
      this.mydoc.subscribe((err) => {
        if (err) throw err
        this.editor.setContents(this.mydoc.data);
        this.editor.on('text-change', (delta, oldDelta, source) => {
          if (source !== 'user') return;
          let d = new Date()
          let len = delta.ops.length
          let color = colors[this.userInfo.id-1];
          // 一般有多个操作，暂时在insert上加一个attributes
          for (let i = 0; i < delta.ops.length; i++) {
            let op = delta.ops[i];
            if (op.insert) {
              op.attributes = {
                // color: color,
                user: this.userInfo.name
              }
              // 可以上色
              // vm.$set(op, 'attributes', 'red')
            } else {

            }
          }
          console.log(d.getSeconds() + JSON.stringify(delta))
          this.mydoc.submitOp(delta, {
            source: 'wow'
          })
        })
        this.mydoc.on('op', (op, source) => {
          if (source === 'wow') return;
          this.editor.updateContents(op)
        })
      })
    },
    methods: {
      logout() {
        logout()
          .then(res => {
            this.$store.dispatch('delUserInfo');
            this.$router.push({
              path: '/login'
            })
          })
          .catch(err => {
            // todo
            this.$store.dispatch('delUserInfo');
            this.$router.push({
              path: '/login'
            })
          })
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
  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

</style>
