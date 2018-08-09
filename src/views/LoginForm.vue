<template>
    <div class="login-page">

        <p style="position: absolute; top: -90px; opacity: .1;">Mekhi26@yahoo.com <br> daqgE</p>

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
                <el-input type="text" v-model="form.email" />
            </el-form-item>

            <el-form-item label="Password"
                          prop="password"
                          :rules="{
                            required: true,
                            message: 'Please input password',
                            trigger: 'blur',
                            }">
                <el-input type="password" v-model="form.password" auto-complete="off" />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm()">Log in</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "LoginForm",
        data() {
            return {
                form: {
                    email: '',
                    password: '',
                },
            };
        },
        methods: {
            submitForm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$store.dispatch({
                            type: 'login',
                            email: this.form.email,
                            password: this.form.password,
                        }).then(result => {
                            if (result) this.$router.push({ path: 'categories/all' })
                        });
                    } else return false;
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .login-page {
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translateY(100%);
    }

    .form {
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: scale(1.4);
    }
</style>