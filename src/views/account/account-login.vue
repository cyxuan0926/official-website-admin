<template>
  <div class="route account-login">
    <el-form
      ref="accountForm"
      :model="accountForm"
      :rules="rules"
      @keyup.enter.native="onSubmit"
    >
      <h2>欢迎登陆</h2>
      <el-form-item prop="username" class="account-form-item">
        <i class="el-icon-user icon" />
        <el-input v-model="accountForm.username" placeholder="用户名" />
      </el-form-item>
      <el-form-item prop="password" class="account-form-item">
        <i class="el-icon-lock icon" />
        <el-input
          v-model="accountForm.password"
          type="password"
          placeholder="密码"
        />
      </el-form-item>
      <el-checkbox v-model="keepAccount">记住密码</el-checkbox>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import { mapActions } from "vuex";

const ACCOUNT_KEY = Base64.encode("account");

export default {
  data() {
    return {
      keepAccount: false,
      accountForm: {
        username: "",
        password: ""
      },
      // TODO: 表单验证
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "change" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "change" }]
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["user/login"]),
    // 填充账号数据
    init() {
      const account = localStorage.getItem(ACCOUNT_KEY);
      this.keepAccount = Boolean(account);

      if (this.keepAccount) {
        this.accountForm = JSON.parse(Base64.decode(account));
      }
    },
    async onSubmit() {
      let { username, password } = this.accountForm;
      password = Base64.encode(password);

      await this.$store.dispatch("user/login", { username, password });
      this.keepAccount ? this.storeAccount() : this.removeAccount();
      this.$router.push({
        name: this.$store.state.routesNameMap.ARTICLE_ALL
      });
    },
    storeAccount() {
      const account = Base64.encode(JSON.stringify(this.accountForm));
      localStorage.setItem(ACCOUNT_KEY, account);
    },
    removeAccount() {
      localStorage.removeItem(ACCOUNT_KEY);
    }
  }
};
</script>

<style lang="scss" scoped>
.account-login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #e5e5e5;

  .el-form {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 260px;
    padding: 40px 110px 21px 110px;
    border-radius: 5px;
    background: #fff;

    h2 {
      margin-bottom: 26px;
      text-align: center;
      font-size: 20px;
    }

    .el-button {
      width: 100%;
    }

    .el-checkbox {
      display: block;
      margin-bottom: 20px;
      margin-top: -10px;
    }

    ::v-deep .el-checkbox__label {
      padding-left: 8px;
      font-size: 13px;
    }

    ::v-deep .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #606266;
    }

    .icon {
      font-size: 16px;
      color: #ccc;
    }
  }
}

.account-form-item {
  position: relative;

  .icon {
    position: absolute;
    top: 50%;
    left: 12px;
    z-index: 1;
    transform: translateY(-50%);
  }

  ::v-deep input {
    padding-left: 40px;
  }
}
</style>
