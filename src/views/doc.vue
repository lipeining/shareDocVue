<template>
  <div>
    <el-row>
      <el-button :icon="getTagIcon()" >
      </el-button>
      <el-button type="primary" @click="joinRoom()">join room</el-button>
      <el-button type="primary" @click="getEditorHtml()">get html</el-button>
    </el-row>
    <el-row>
        <el-col :span="18">
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
            <div v-loading="editorLock">
            <!-- bidirectional data binding（双向数据绑定） -->
            <quill-editor v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)" @change="onEditorChange($event)">
            </quill-editor>
            </div>
        </el-col>
         <el-col :span="5">
             <el-button icon="el-icon-service" @click="handleClickShow()" v-show="!showChat" circle></el-button>
             <div  v-show="showChat" @click="handleClickShow()">
                 <span >drop down<i class="el-icon-caret-bottom el-icon--right"></i></span>
             </div>
             <div v-show="showChat" class="chatMain">
                <el-scrollbar class="list">
                    <ul v-if="chatList.length">
                        <li v-for="chat of chatList" :key="chat.id" class="chatP">
                            <span>{{chat.user.name}}:</span>
                            <span>{{chat.content}}</span>
                        </li>
                    </ul>
                </el-scrollbar>
                <div class="chatInput">
                    <!-- <textarea  @keydown="keydownEnter($event)"
                    v-model="chatInput" placeholder="请输入内容"
                        :rows="2" ></textarea> -->
                    <el-input  @keydown.native="keydownEnter($event)"
                    v-model="chatInput" placeholder="请输入内容"
                        type="textarea" :rows="2" ></el-input>
                </div>
             </div>
         </el-col>
    </el-row>
  </div>
</template>

<script>
    import {
        shareDBConnection
    } from '../shareDBConnection';
    // import chatConnection from '../chatConnection';
    import {
        logout
    } from '../api/user';
    import {
        getChats
    } from '../api/chat';
    import {
        mapGetters
    } from 'vuex'
    import Quill from 'quill'
    import Parchment from 'parchment'
    const colors = ['red', 'blue', 'green', 'gold']
    // var userAttributor = new Parchment.Attributor.Attribute('user', 'class', {
    //   scope: Parchment.Scope.INLINE
    // })
    // Quill.register(userAttributor)
    export default {
        name: 'Doc',
        data() {
            return {
                pending: { ops: [] },
                lastSend: 0,
                content: '',
                chatInput: '',
                showChat: false,
                chatList: [],
                editorLock: true,
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
        sockets: {
            connect: () => {
                console.log('doc.vue socket connected');
            },
            newUser: function(data) {
                console.log('this method was fired by the socket server. eg: io.emit("newUser", data)');
                console.log(JSON.stringify(data));
            },
            chat: function(data) {
                let chat = data.chat;
                this.chatList.push(chat);
            }
        },
        watch: {},
        mounted() {
            // console.log(chatConnection);
            // chatConnection.onopen = function open() {
            //   chatConnection.send('on open client send hello');
            // }
            // chatConnection.onmessage = function incoming(data) {
            //   console.log('wsttt recive a message form server');
            //   console.log(data);
            //   // chatConnection.send('wow');
            // }
            console.log('this is current quill instance object', this.editor);
            this.init();
        },
        created() {
            this.joinRoom();
            this.getChats();
        },
        methods: {
            joinRoom() {
                let data = {
                    documentId: this.$route.query.documentId,
                    collectionName: this.$route.query.collectionName,
                    docId: this.$route.query.docId
                };
                this.$socket.emit('docroom', data);
            },
            keydownEnter(e) {
                // console.log(e);
                // element-ui需要加native
                if (!e.shiftKey && e.key === 'Enter') {
                    // 发送
                    e.preventDefault();
                    this.submitChat();
                } else if (e.shiftKey && e.key === 'Enter') {
                    this.chatInput += '\n';
                }
            },
            submitChat() {
                let data = {
                    content: this.chatInput,
                    ref: ''
                };
                this.$socket.emit('chat', data);
                this.chatInput = '';
            },
            getChats() {
                getChats({ docId: this.$route.query.docId })
                    .then(res => {
                        this.chatList = res.data.reverse();
                    })
                    .catch(err => {
                        this.$message.error('get chats error');
                    });
            },
            scrollChatList(e) {
                console.log(e);
            },
            getTagIcon() {
                return this.editorLock ? 'el-icon-loading' : 'el-icon-success';
            },
            handleClickShow() {
                this.showChat = !this.showChat;
            },
            enableEditor() {
                this.editor.enable();
                this.editorLock = false;
            },
            disableEditor() {
                this.editor.disable();
                this.editorLock = true;
            },
            init() {
                this.disableEditor();
                let collectionName = this.$route.query.collectionName;
                let documentId = this.$route.query.documentId;
                console.log(collectionName, documentId);
                // 
                // shareDBConnection.on("message", function shareIncoming(data){
                //   console.log('sharedb message');
                //   console.log(data);
                // });
                // shareDBConnection.onerror = function shareDBOnError(err){
                //   console.log(JSON.stringify(err));
                // }
                try {
                    this.mydoc = shareDBConnection.get(collectionName, documentId);
                    this.mydoc.subscribe((err) => {
                        if (err) throw err;

                        if (!this.mydoc.type)
                            this.mydoc.create([], 'rich-text');
                        this.editor.setContents(this.mydoc.data);
                        this.enableEditor();
                        this.editor.on('text-change', (delta, oldDelta, source) => {
                            if (source !== 'user') return;
                            let d = new Date()
                            let len = delta.ops.length
                            let color = colors[this.userInfo.id - 1];
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
                            console.log(d.getSeconds() + JSON.stringify(delta));
                            this.mydoc.submitOp(delta, {
                                source: 'wow'
                            });
                        })
                    });
                    this.mydoc.on('op', (op, source) => {
                        if (source === 'wow') return;
                        console.log(op);
                        this.editor.updateContents(op)
                    });
                    this.mydoc.on('error', (err) => {
                        // console.log(err);
                        console.log(JSON.stringify(err));
                        console.log(err.message);
                        this.disableEditor();
                    });
                } catch (err) {
                    console.log(JSON.stringify(err));
                }
            },
            editorRedo() {
                console.log('redo')
                this.editor.history.redo();
            },
            editorUndo() {
                console.log('undo')
                this.editor.history.undo();
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
            getEditorHtml() {
                console.log(this.content);
                // console.log(this.editor.root.innerHtml);
            },
            onEditorChange({
                quill,
                html,
                text
            }) {
                // console.log('editor change!', quill, html, text);
                this.content = html;
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .chatMain {
        border: 2px solid transparent;
        border-color: azure;
        border-radius: 1rem;
        display: block;
        height: 300px;
    }

    .chatP {
        margin: 2px;
        padding: 2px;
        border: aliceblue solid;
        border-radius: 2px;
        display: block;
    }

    .list {
        height: 100%;
    }

    .wrap {
        overflow-x: hidden;
    }

    .chatInput {
        flex-direction: column;
        display: flex;
        flex-grow: 1;
    }

    /* button[class*='ql-'] {
    position: relative;
    transition: background-color 0.4s ease;
}

button[class*='ql-']::hover{
    background-color: rgba(255, 150, 0, 0.1) !important;
}

button[class*='ql-']::before,
button[class*='ql-']::after {
    z-index: 1;
    display: inline-block;
}
button[class*='ql-']:hover::before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, 0);
    border: 5px solid transparent;
    border-bottom: 5px solid #444;
}

button[class*='ql-']:hover::after {
    content: attr(msg);
    position: absolute;
    top: 100%;
    left: 50%;
    font-size: 10px;
    transform: translate(-50%, 10px);
    padding: 10px;
    color: white;
    background-color: #444;
    border-radius: 4px;
    word-break: keep-all;
    line-height: 16px;
} */
</style>