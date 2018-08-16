<template>
    <div class="login-page">
        <div class="logAs">
            <el-button type="info" plain @click="logAs('Reader')">Log in as Reader</el-button>
            <el-button type="success"
                       plain
                       @click="logAs('Librarian')">Log in as Librarian</el-button>
            <el-button type="danger" plain @click="logAs('Senior')">Log in as Senior</el-button>
        </div>

        <el-form :model="form"
                 ref="form"
                 label-width="75px"
                 class="form">

            <el-form-item label="E-mail"
                          prop="email"
                          :rules="[
                            {
                                required: true,
                                message: 'Please input email address',
                                trigger: 'blur'
                            },
                            {
                                type: 'email',
                                message: 'Please input correct email address',
                                trigger: 'blur'
                             }
                          ]">
                <el-input type="text" @input="validationReset" v-model="form.email" />
            </el-form-item>

            <el-form-item label="Password"
                          prop="password"
                          :rules="{
                            required: true,
                            message: 'Please input password',
                            trigger: 'blur',
                            }">
                <el-input type="password"
                          v-model="form.password"
                          @input="validationReset"
                          auto-complete="off" />
            </el-form-item>
            <span class="el-form-item__error" v-if="userErrorText" v-text="userErrorText"></span>
            <el-form-item>
                <el-button type="primary" @click="submitForm()">Log in</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: 'LoginForm',
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                },
                userErrorText: null,
            };
        },
        methods: {
            logAs(role) {
                switch (role) {
                    case 'Reader':
                        this.form.email = 'Arnoldo.Jerde@yahoo.com';
                        this.form.password = 'RP92F';
                        break;
                    case 'Librarian':
                        this.form.email = 'Lemuel53@yahoo.com';
                        this.form.password = 'MXIo5';
                        break;
                    default:
                        this.form.email = 'Adonis_Cruickshank@hotmail.com';
                        this.form.password = 'ogjEG';
                }

                this.submitForm();
            },

            validationReset() {
                this.userErrorText = null;
            },

            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (!valid) return;

                    this.$store.dispatch('login', {
                        email: this.form.email,
                        password: this.form.password,
                    }).then((result) => {
                        if (result.success) {
                            this.$router.push({ path: 'categories/all' });
                        } else this.userErrorText = result.message;
                    });
                });
            },
        },
    };
</script>

<style lang="scss" scoped>
    .logAs {
        position: absolute;
        bottom: -150px;
        display: flex;
        justify-content: center;
        width: 100%;

        & > * {
            margin: 0 20px;
        }
    }

    .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(100%);
    }

    .el-form-item__error {
        width: 100%;
        text-align: center;
    }

    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(1.4);
    }
</style>
