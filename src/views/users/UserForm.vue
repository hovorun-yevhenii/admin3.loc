<template>
    <div class="user-form">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/users/all' }">Users</el-breadcrumb-item>
            <el-breadcrumb-item>{{ editMode ? 'Edit' : 'Add' }}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form ref="form" :rules="rules" :model="form" label-width="80px">

            <el-form-item label="Name" prop="name">
                <el-input v-model="form.name" placeholder="John"></el-input>
            </el-form-item>

            <el-form-item label="Surname" prop="surname">
                <el-input v-model="form.surname" placeholder="Smith"></el-input>
            </el-form-item>

            <el-form-item label="Role" prop="role">
                <el-select v-model="form.role"
                           :disabled="!senior"
                           placeholder="please select user's role"
                           value="Reader">
                    <el-option label="Reader" value="Reader"></el-option>
                    <el-option label="Librarian" value="Librarian"></el-option>
                    <el-option label="Senior Librarian" value="Senior Librarian"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="E-mail" prop="email">
                <el-input v-model="form.email"
                          :disabled="!senior"
                          placeholder="example@mail.com"></el-input>
            </el-form-item>

            <el-form-item label="Password" prop="password">
                <el-input type="password"
                          v-model="form.password"
                          :disabled="!senior"
                          placeholder="five or more symbols"></el-input>
            </el-form-item>

            <el-form-item label="Phone" prop="phone">
                <el-input v-model="form.phone"
                          v-mask="'+# (###) ###-####'"
                          placeholder="+1 (111) 111-1111"></el-input>
            </el-form-item>

            <el-upload action="" class="upload" :before-upload="beforeAvatarUpload">
                <img v-if="form.avatar" :src="form.avatar" class="upload-image">
                <i v-else class="el-icon-plus upload-icon"></i>
            </el-upload>

            <el-form-item class="controls">
                <el-button type="primary"
                           @click="onSubmit">{{ editMode ? 'Edit' : 'Create' }}</el-button>
                <el-button @click="resetForm">{{ editMode ? 'Discard' : 'Reset' }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { mask } from 'vue-the-mask';
    import moment from 'moment';
    import { Notification } from 'element-ui';
    import loaderValidator from '../../mixins/imageLoaderValidator';
    import { mapGetters } from 'vuex';

    export default {
        name: 'UserForm',
        directives: { mask },
        mixins: [loaderValidator],
        data() {
            return {
                form: {
                    name: '',
                    surname: '',
                    role: '',
                    email: '',
                    phone: '',
                    password: '',
                    avatar: null,
                },
                rules: {
                    name: [
                        { required: true, message: 'Please input name', trigger: 'blur' },
                        {
                            min: 2, max: 10, message: 'Length should be 2 to 10', trigger: 'blur',
                        },
                    ],
                    surname: [
                        { required: true, message: 'Please input surname', trigger: 'blur' },
                        {
                            min: 2, max: 10, message: 'Length should be 2 to 10', trigger: 'blur',
                        },
                    ],
                    role: [
                        { required: true, message: 'Please input role', trigger: 'blur' },
                    ],
                    email: [
                        {
                            type: 'email', required: true, message: 'Please input valid email', trigger: 'blur',
                        },
                    ],
                    phone: [
                        { required: true, message: 'Please input phone', trigger: 'blur' },
                    ],
                    password: [
                        { required: true, message: 'Please input password', trigger: 'blur' },
                        { min: 5, message: 'Length should be 5 or more', trigger: 'blur' },
                    ],
                },
            };
        },

        computed: {
            editMode() {
                return this.$route.name === 'editUser';
            },
            ...mapGetters([
                'stateQuery',
                'getCurrentUser',
            ]),
            senior() {
                return this.getCurrentUser.role === 'Senior Librarian';
            },
        },

        watch: {
            stateQuery() {
                this.fetchUser();
            },
        },

        methods: {
            onSubmit() {
                this.form.avatar = this.form.avatar || 'https://image.flaticon.com/icons/svg/149/149452.svg';

                this.$refs.form.validate((valid) => {
                    if (!valid) return;

                    const restMethod = this.editMode ? 'updateUser' : 'addUser';
                    const user = this.editMode ? this.form :
                            Object.assign(
                                this.form,
                                { created_at: moment().toISOString() },
                                { blacklisted: false },
                            );

                    this.$store.dispatch(restMethod, user)
                        .then((result) => {
                            if (result) {
                                Notification.info({ title: `User has been ${this.editMode ? 'updated' : 'added'}` });
                            } else {
                                Notification.error({ title: 'Something went wrong' });
                            }

                            this.$router.push({ path: '/users' });
                        });
                });
            },

            resetForm() {
                if (this.editMode) {
                    this.$store.dispatch('fetchUserById', this.$route.params.id)
                        .then(response => Object.assign(this.form, response.data));
                } else {
                    this.$refs.form.resetFields();
                    this.form.avatar = null;
                }
            },

            beforeAvatarUpload(file) {
                this.validateLoadingImage(file)
                    .then(
                        (image) => {
                            this.form.avatar = image;
                         },
                        () => {
                            Notification.error({ title: 'You may upload png or jpeg file 2MB max' });
                        },
                    );

                return false;
            },
            fetchUser() {
                this.$store.dispatch('fetchUserById', this.$route.params.id)
                    .then(response => Object.assign(this.form, response.data));
            },
        },

        created() {
            if (this.editMode) this.fetchUser();
        },
    };
</script>

<style lang="scss" scoped>
    @import "../../assets/css/uploader";

    .create-user,
    .user-form {
        padding-top: 60px;
    }

    .controls {
        display: flex;
        margin-right: 80px;
        padding-top: 50px;
    }
</style>
