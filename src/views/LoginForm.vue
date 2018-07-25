<template>
    <div class="login-page">
        <el-form :model="form"
                 :rules="myRules"
                 ref="form"
                 label-width="75px"
                 class="form">

            <el-form-item label="Логин" prop="login">
                <el-input type="text"
                          v-model="form.login"
                          auto-complete="off">
                </el-input>
            </el-form-item>
            <el-form-item label="Пароль" prop="password">
                <el-input type="password"
                          v-model="form.password"
                          auto-complete="off">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm">Вход</el-button>
                <el-button @click="resetForm">Сброс</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "LoginForm",
        data() {
            const validateLogin = (rule, value, callback) => {
                if (value.length < 5) {
                    callback(new Error('Минимум 5 символов'));
                } else callback();
            };

            const validatePassword = (rule, value, callback) => {
                if (value.length < 6) {
                    callback(new Error('Минимум 6 символов'));
                } else callback();
            };

            return {
                form: {
                    login: '',
                    password: '',
                },
                myRules: {
                    login: [{ validator: validateLogin, trigger: 'blur' }],
                    password: [{ validator: validatePassword, trigger: 'blur' }],
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else return false;

                });
            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(50%);
    }

    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
</style>