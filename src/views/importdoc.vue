<template>
  <div>
    <el-row>
      <el-button type="primary" @click="getEditorHtml()">get html</el-button>
      <el-button type="primary" @click="getDeltaSendServer()">submit</el-button>      
    </el-row>
    <el-row>
        <el-upload
            ref="upload"
            action=""
            accept=".docx"
            :on-change="handleChangeFile"
            :auto-upload="false">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>     
    </el-row>
    <div>
      <!-- bidirectional data binding（双向数据绑定） -->
      <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
        @ready="onEditorReady($event)" @change="onEditorChange($event)">
      </quill-editor>
    </div>
  </div>
</template>
<script>

  // var mammoth =  require('mammoth-colors');
  var mammoth =  require('mammoth');
  import {upload64} from '../api/upload';
  import {importDoc} from '../api/doc';
  var options = {
    convertImage: mammoth.images.imgElement(function(image) {
        return image.read("base64").then(function(imageBuffer) {
          let str = "data:" + image.contentType + ";base64," + imageBuffer;
          return upload64({str: str, name: image.altText})
                  .then(res => {
                    // console.log('try to upload64 success');
                    // console.log(res.url);
                    return {src: res.url};
                  })
                  .catch(err=>{
                    // console.log('try to upload64 error');
                    // console.log(err);
                    return {src: str};
                  });
        });
    })
  };
  export default {
    name: 'ImportDoc',
    data() {
      return {
        content: '',
        fileName: '',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ]
          }
        }
      }
    },
    methods: {
      onEditorBlur(editor) {
        // console.log('editor blur!', editor);
      },
      onEditorFocus(editor) {
        // console.log('editor focus!', editor);
      },
      onEditorReady(editor) {
        // console.log('editor ready!', editor);
      },
      onEditorChange(editor) {
        // console.log('editor ready!', editor);
      },
      handleChangeFile(file, fileList) {
          console.log(`change file`);
          console.log(file);
          this.getFileBuffer(file.raw)
            .then(buffer => {
              console.log(buffer.toString());
              console.log(buffer);
              mammoth.convertToHtml({arrayBuffer: buffer}, options)
                .then(result => {
                    let html = result.value; // The generated HTML
                    let messages = result.messages; // Any messages, such as warnings during conversion
                    // console.log(html);
                    console.log(messages);
                    this.content = html;
                    this.fileName = file.name;
                })
                .done();
            })
            .catch(err => {
              console.log('get file buffer error');
              console.log(err);
            });     
      },
      getFileBuffer(file) {
        let blobData = new Blob([file]);
        return new Promise(function(resolve, reject){
          let reader = new FileReader();
          reader.readAsArrayBuffer(blobData);
          reader.onload = function(loadEvent) {
            // reader.result is a array buffer
            resolve(loadEvent.target.result);
            // resolve(reader.result);
            // let bytes = new Uint8Array(reader.result);
            // resolve(bytes);
          }
        });
      },
      getEditorHtml() {
        console.log('delta is');
        console.log(this.content);
        console.log(this.editor.getContents());
      },
      getDeltaSendServer() {
          let delta = this.editor.getContents();
          console.log(JSON.stringify(delta));
          importDoc({
            fileName: this.fileName,
            delta: delta
          })
          .then(res => {
            this.$message({
              message: 'success',
              type: 'success'
            });
          })
          .catch(err => {
            this.$message({
              message: err,
              type: 'error'
            });
          });
      },
      getFileByListener() {
      }
    },
    computed: {
      editor() {
        return this.$refs.myQuillEditor.quill;
      }
    },
    mounted() {
      console.log('this is my editor', this.editor);
      this.editor.disable();
    }
  }
</script>

<style scoped>

</style>