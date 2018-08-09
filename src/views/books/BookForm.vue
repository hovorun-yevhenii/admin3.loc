<template>
    <div class="book-form">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/books/all' }">Books</el-breadcrumb-item>
            <el-breadcrumb-item>{{ editMode ? 'Edit' : 'Add' }}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form ref="form" :rules="rules" :model="form" label-width="100px">

            <el-form-item label="Title" prop="name">
                <el-input v-model="form.name" placeholder="Gorgeous Fresh Pants"></el-input>
            </el-form-item>

            <el-form-item label="Author" prop="author">
                <el-input v-model="form.author" placeholder="ID or name?"></el-input>
            </el-form-item>

            <el-form-item label="Category" prop="category">
                <el-select v-model="form.category" placeholder="please select category" value="Health">
                    <el-option label="Music" value="Music"></el-option>
                    <el-option label="Health" value="Health"></el-option>
                    <el-option label="Computers" value="Computers"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="Pages" prop="pages">
                <el-input-number v-model="form.pages" :min="1"></el-input-number>
            </el-form-item>

            <el-form-item label="Written at" prop="created_at">
                <el-input-number v-model="form.created_at" :min="1200" :max="2018"></el-input-number>
            </el-form-item>

            <el-form-item label="Owner" prop="owner">
                <el-select v-model="form.owner" placeholder="please select owner" value="Library">
                    <el-option label="Library" value="Library"></el-option>
                    <el-option label="Reader" value="Reader"></el-option>
                </el-select>
            </el-form-item>

            <el-input type="textarea"
                      :rows="2"
                      placeholder="Ut qui aliquid doloribus aliquam eos..."
                      v-model="form.description">
            </el-input>

            <el-upload action="" class="upload" :before-upload="beforeCoverUpload">
                <img v-if="form.cover" :src="form.cover" class="upload-image">
                <i v-else class="el-icon-plus upload-icon"></i>
            </el-upload>

            <el-form-item class="controls">
                <el-button type="primary" @click="onSubmit">{{ editMode ? 'Edit' : 'Create' }}</el-button>
                <el-button @click="resetForm">{{ editMode ? 'Discard' : 'Reset' }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import moment from 'moment/src/moment';
    import {Notification} from 'element-ui';
    import loaderValidator from '../../mixins/imageLoaderValidator';

    export default {
        name: "BookForm",
        mixins: [loaderValidator],
        data() {
            return {
                form: {
                    name: '',
                    author: '',
                    category: '',
                    pages: '',
                    owner: '',
                    description: '',
                    created_at: '',
                    cover: ''
                },
                rules: {
                    name: [
                        { required: true, message: 'Please input name', trigger: 'blur' },
                        { min: 3, message: 'More then 3 symbols', trigger: 'blur' }
                    ],
                    author: [
                        { required: true, message: 'Please input author', trigger: 'blur' },
                        { min: 1, message: 'More then 1 symbol', trigger: 'blur' }
                    ],
                    category: [
                        { required: true, message: 'Please input category', trigger: 'blur' }
                    ],
                    pages: [
                        { type: 'number', required: true, message: 'Please input valid number', trigger: 'blur' }
                    ],
                    created_at: [
                        { type: 'number', required: true, message: 'Please input valid number', trigger: 'blur' }
                    ],
                    owner: [
                        { required: true, message: 'Please input owner', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: 'Please input description', trigger: 'blur' },
                        { min: 10, message: 'More then 10 symbols', trigger: 'blur' }
                    ]
                }
            }
        },

        computed: {
            editMode() {
                return this.$route.name === 'editBook';
            },
        },

        methods: {
            onSubmit() {
                this.form.cover = this.form.cover || 'https://image.flaticon.com/icons/svg/167/167754.svg';

                this.$refs['form'].validate((valid) => {
                    if (!valid) return;

                    const restMethod = this.editMode ? 'updateBook' : 'addBook';

                    this.$store.dispatch(restMethod, this.form)
                        .then(result => {
                            if (result) {
                                Notification.info({ title: `Book has been ${this.editMode ? 'updated' : 'added'}` })
                            } else {
                                Notification.error({ title: 'Something went wrong' })
                            }

                            this.$router.push({path: '/books'})
                        })
                });
            },

            resetForm() {
                if (this.editMode) {
                    this.$store.dispatch('fetchBookById', this.$route.params.id)
                        .then(response => Object.assign(this.form, response.data))
                } else {
                    this.$refs['form'].resetFields();
                    this.form.avatar = null;
                }
            },

            beforeCoverUpload(cover) {
                this.validateLoadingImage(cover)
                    .then(
                        image => this.form.cover = image,
                        error =>  Notification.error({ title: `You may upload png or jpeg file 2MB max`})
                    );

                return false;
            },
        },

        created() {
            if (this.editMode) {
                this.$store.dispatch('fetchBookById', this.$route.params.id)
                    .then(response => Object.assign(this.form, response.data))
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../assets/css/uploader";

    .create-book {
        padding-top: 60px;
    }

    .cover {
        width: 178px;
        height: 178px;
        display: block;
        margin: 0 auto;
    }

    .controls {
        display: flex;
        margin-right: 80px;
        padding-top: 50px;
    }
</style>