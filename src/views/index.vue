<template>
  <el-row>
    <el-row :gutter="24">
      <el-col :span="12">
        <el-table :data="userInfo.docs" @row-click="openDoc" border style="width: 100%">
          <el-table-column prop="item._id" label="id">
          </el-table-column>
          <el-table-column prop="item.creator" label="creator">
          </el-table-column>
          <el-table-column prop="item.collectionName" label="collectionName">
          </el-table-column>
          <el-table-column prop="item.documentId" label="documentId">
          </el-table-column>
          <el-table-column prop="item.date" label="date">
          </el-table-column>
          <el-table-column prop="role" label="role">
          </el-table-column>
          <el-table-column prop="star" label="star">
          </el-table-column>
          <el-table-column prop="status" label="status">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
         <el-button type="primary" @click="sendIndex()">send index</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-form :model="doc" label-width="130px" auto-complete="on" :rules="docRules" ref="docForm">
          <el-form-item label="collectionName" prop="collectionName">
            <el-input v-model="doc.collectionName" type="text"></el-input>
          </el-form-item>
          <el-form-item label="documentId" prop="documentId">
            <el-input v-model="doc.documentId" type="text"></el-input>
          </el-form-item>
          <el-button type="primary" @click="submitDocForm('docForm')">submit</el-button>
        </el-form>
      </el-col>
      <el-col :span="7">
        <el-form :model="docuser" label-width="130px" auto-complete="on" :rules="userRules" ref="docUserForm">
          <el-form-item label="docId" prop="docId">
            <!-- <el-input v-model="docuser.docId" type="text"></el-input> -->
            <el-select v-model="docuser.docId" clearable placeholder="请选择">
              <el-option v-for="item in selectDocs" :key="item._id" 
                :label="`${item.collectionName}-${item.documentId}`" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="userId" prop="userId">
            <!-- <el-input v-model="docuser.userId" type="text"></el-input> -->
            <el-select v-model="docuser.userId" clearable placeholder="请选择">
              <el-option v-for="item in selectUsers" :key="item._id" :label="item.name" :value="item._id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="status" prop="status">
            <el-select v-model="docuser.status" clearable placeholder="请选择">
              <el-option v-for="item in selectStatus" :key="item.value" :label="item.name" :value="item.value">
              </el-option>
            </el-select>             
          </el-form-item>
          <el-button type="primary" @click="submitDocUserForm('docUserForm')">submit</el-button>
        </el-form>
      </el-col>
    </el-row>
  </el-row>

</template>

<script>
    import {
        createDoc,
        getSelectDocs,
        addDocUser
    } from '../api/doc';
    import {
        getSelectUsers
    } from '../api/user';
    import {
        mapGetters
    } from 'vuex';
    export default {
        name: 'Index',
        data() {
            const docRules = {
                collectionName: [{
                        required: true,
                        message: 'please input plan collectionName'
                    },
                    {
                        min: 2,
                        max: 16,
                        message: '长度在 2 到 16 个字符'
                    }
                ],
                documentId: [{
                        required: true,
                        message: 'please input plan documentId'
                    },
                    {
                        min: 2,
                        max: 16,
                        message: '长度在 2 到 16 个字符'
                    }
                ]
            };
            // ObjectId("5b6adc2d5a59ad0010950847")said2
            // ObjectId("5b6e755ba046d70010a33230")office doc4 
            const userRules = {
                docId: [{
                    required: true,
                    message: 'please input plan docId'
                }],
                userId: [{
                    required: true,
                    message: 'please input plan userId'
                }]
            };
            const selectStatus = [{
                name: 'write-read',
                value: 0
            }, {
                name: 'read-only',
                value: 1
            }, {
                name: 'remove-user',
                value: 2
            }];
            return {
                doc: {
                    collectionName: '',
                    documentId: ''
                },
                docuser: {
                    docId: '',
                    userId: '',
                    status: 0
                },
                regIndex: false,
                selectStatus: selectStatus,
                selectUsers: [],
                selectDocs: [],
                docRules: docRules,
                userRules: userRules
            }
        },
        computed: {
            // 使用对象展开运算符将 getter 混入 computed 对象中
            ...mapGetters([
                'userInfo',
                // ...
            ])
        },
        created() {
            this.sendIndex();
            this.getSelectDocs();
            this.getSelectUsers();
        },
        sockets: {
            index: function(data) {
                console.log('this method was fired by the socket server. eg: io.emit("index", data)');
                console.log(JSON.stringify(data));
                if (data.success) {
                    // 如果已经注册到index页面的话
                    this.regIndex = true;
                } else {
                //   this.$router.go(0);
                    // 2秒后重试
                    // setTimeout(() => {
                    //     this.sendIndex();
                    // }, 2000);
                }
            }
        },
        mounted() {},
        methods: {
            sendIndex() {
                this.$socket.emit("index", { msg: "index form client" });
            },
            submitDocForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    } else {
                        console.log(JSON.stringify(this.doc));
                        createDoc(this.doc)
                            .then(result => {})
                            .catch(err => {
                                this.$notify.error({
                                    title: 'create doc error',
                                    message: err
                                });
                                console.log(err);
                            });
                    }
                });
            },
            submitDocUserForm(formName) {
                this.$refs[formName].validate(valid => {
                    if (!valid) {
                        return false;
                    } else {
                        console.log(JSON.stringify(this.docuser));
                        addDocUser(this.docuser)
                            .then(result => {})
                            .catch(err => {
                                this.$notify.error({
                                    title: 'add doc user error',
                                    message: err
                                });
                                console.log(err);
                            });
                    }
                });
            },
            getSelectUsers() {
                getSelectUsers()
                    .then(res => {
                        this.selectUsers = res.users;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            getSelectDocs() {
                getSelectDocs()
                    .then(res => {
                        this.selectDocs = res.docs;
                        console.log(res);
                    })
                    .catch(err => {
                        console.log(err);
                    })
            },
            openDoc(row, event, column) {
                console.log(row);
                console.log(event);
                console.log(column);
                const {
                    href
                } = this.$router.resolve({
                    name: 'doc',
                    query: {
                        collectionName: row.item.collectionName,
                        documentId: row.item.documentId,
                        docId: row.item._id
                    }
                });
                window.open(href, '_blank');
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>