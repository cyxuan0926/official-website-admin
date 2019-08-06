<template>
  <div class="layout-header">
    <div class="fold">
      <h1>国科官网后台管理</h1>
      <!-- <i class="el-icon-s-operation" @click="toggleMenuVisible"></i> -->
    </div>
    <div class="user">
      <h2>
        <el-dropdown @command="handleCommand" trigger="click">
          <span class="el-dropdown-link">
            {{ $store.state.user.userInfo.username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="UPDATE_PASSWORD">
              修改密码
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </h2>
      <i class="el-icon-switch-button" @click="onLogout" />
    </div>
    <el-dialog
      v-if="passwordDialogVisible"
      title="修改密码"
      width="520px"
      :visible.sync="passwordDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordForm"
        label-width="125px"
        :model="passwordForm"
        :rules="rules"
        @keyup.enter.native="onSubmit"
      >
        <el-form-item label="原密码" prop="old_password">
          <el-input
            ref="oldPasswordInput"
            v-model="passwordForm.old_password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input
            v-model="passwordForm.new_password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="再次输入新密码" prop="confirm_password">
          <el-input
            v-model="passwordForm.confirm_password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passwordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Base64 } from "js-base64";
import validator from "@/common/validator";

export default {
  data() {
    return {
      passwordDialogVisible: false,
      passwordForm: {
        old_password: "",
        new_password: "",
        confirm_password: ""
      },
      rules: {
        old_password: [
          { required: true, message: "请输入原密码" },
          { validator: validator.PASSWORD, trigger: "blur" }
        ],
        new_password: { required: true, message: "请输入新密码" },
        confirm_password: { required: true, message: "请再次输入新密码" }
      }
    };
  },
  methods: {
    handleCommand(command) {
      if (command === "UPDATE_PASSWORD") {
        this.passwordDialogVisible = true;
      }
    },
    onSubmit() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          let {
            old_password,
            new_password,
            confirm_password
          } = this.passwordForm;

          try {
            await this.$store.dispatch("user/updatePassword", {
              username: this.$store.state.user.userInfo.username,
              data: {
                old_password: Base64.encode(old_password),
                new_password: Base64.encode(new_password),
                confirm_password: Base64.encode(confirm_password)
              }
            });
            this.$refs.passwordForm.resetFields();
            this.passwordDialogVisible = false;
          } catch (err) {
            if (err.response && err.response.data.error_code === 400002) {
              this.$refs.oldPasswordInput.focus();
            }
          }
        }
      });
    },
    async onLogout() {
      try {
        await this.$confirm("确定退出登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        await this.$store.dispatch("user/logout");
        this.$router.push({
          name: this.$store.state.global.routesNameMap.LOGIN
        });
      } catch (err) {
        console.log("cancel logout", err);
      }
    },
    toggleMenuVisible() {
      this.$store.dispatch("global/toggleMenuVisible");
    }
  }
};
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  color: #fff;
  background-color: #3c8dbc;

  .fold {
    display: flex;
    align-items: center;

    h1 {
      box-sizing: border-box;
      width: 230px;
      height: 100%;
      padding-left: 25px;
      line-height: 50px;
      font-size: 18px;
      background-color: #367fa9;
    }

    i {
      width: 50px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 20px;
      cursor: pointer;

      &:hover {
        background-color: #367fa9;
      }
    }
  }

  .user {
    display: flex;
    height: 100%;
    line-height: 50px;

    h2 {
      height: 100%;
      padding: 0 10px;
      cursor: pointer;

      .el-dropdown {
        color: #fff;
      }

      &:hover {
        background-color: #367fa9;
      }
    }

    i {
      width: 50px;
      height: 100%;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      cursor: pointer;

      &:hover {
        background-color: #367fa9;
      }
    }
  }
}

::v-deep .el-dialog__body {
  padding: 30px 80px 10px 50px;
}

::v-deep .el-dialog__header {
  padding: 14px 20px;
  background: #f5f5f5;

  .el-dialog__title {
    // font-size: 16px;
    font-size: 14px;
    // font-weight: bold;
  }
}
</style>
