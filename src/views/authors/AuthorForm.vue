<template>
    <div class="author-form">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">Dashboard</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/authors/all' }">Authors</el-breadcrumb-item>
            <el-breadcrumb-item>{{ editMode ? 'Edit' : 'Add' }}</el-breadcrumb-item>
        </el-breadcrumb>

        <el-form ref="form" :rules="rules" :model="form" label-width="100px">
            <el-form-item label="Name" prop="name">
                <el-input v-model="form.name" placeholder="Jack Johnston"></el-input>
            </el-form-item>

            <el-form-item label="Year of birth" prop="born_at">
                <el-input-number v-model="form.born_at" :min="1" :max="2010"></el-input-number>
            </el-form-item>

            <el-form-item label="Year of death" prop="died_at">
                <el-input-number v-model="form.died_at" :min="1"></el-input-number>
            </el-form-item>

            <el-form-item label="Country" prop="country">
                <el-select v-model="form.country" :placeholder="form.country" filterable>
                    <el-option
                            v-for="(country, index) in countries"
                            :key="index"
                            :label="country"
                            :value="country">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="controls">
                <el-button type="primary"
                           @click="onSubmit">{{ editMode ? 'Edit' : 'Create' }}</el-button>
                <el-button @click="resetForm">{{ editMode ? 'Discard' : 'Reset' }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import { Notification } from 'element-ui';
    import countries from '../../assets/countries';

    export default {
        name: 'AuthorForm',
        data() {
            return {
                form: {
                    name: '',
                    born_at: '',
                    died_at: '',
                    country: '',
                },
                rules: {
                    name: [
                        { required: true, message: 'Please input name', trigger: 'blur' },
                        { min: 3, message: 'Please input name and surname', trigger: 'blur' },
                    ],
                    born_at: [
                        { required: true, message: 'Please input date of birth', trigger: 'blur' },
                    ],
                    died_at: [
                        { required: false },
                    ],
                    country: [
                        { required: true, message: 'Please input country', trigger: 'blur' },
                    ],
                },
                countries,
            };
        },

        computed: {
            editMode() {
                return this.$route.name === 'editAuthor';
            },
        },

        methods: {
            onSubmit() {
                this.$refs.form.validate((valid) => {
                    if (!valid) return;

                    const restMethod = this.editMode ? 'updateAuthor' : 'addAuthor';

                    this.$store.dispatch(restMethod, this.form)
                        .then((result) => {
                            if (result) {
                                Notification.info({ title: `author has been ${this.editMode ? 'updated' : 'added'}` });
                            } else {
                                Notification.error({ title: 'Something went wrong' });
                            }

                            this.$router.push({ path: '/authors' });
                        });
                });
            },

            resetForm() {
                if (this.editMode) {
                    this.$store.dispatch('fetchAuthorById', this.$route.params.id)
                        .then(response => Object.assign(this.form, response.data));
                } else {
                    this.$refs.form.resetFields();
                }
            },
        },

        created() {
            if (this.editMode) {
                this.$store.dispatch('fetchAuthorById', this.$route.params.id)
                    .then(response => Object.assign(this.form, response.data));
            }
        },

    };
</script>

<style scoped>
.author-form {
    padding-top: 100px;
}
</style>
