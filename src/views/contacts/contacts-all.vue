<template>
  <div class="page-contacts">
    <el-button type="primary" @click="onCreateContact">新增联系人</el-button>
    <el-table
      tooltip-effect="dark"
      align="center"
      border
      :data="$store.state.contact.contacts"
    >
      <el-table-column type="index" :index="getRowIndex" />
      <el-table-column prop="contact_region" label="区域" />
      <el-table-column prop="contact_name" label="负责人" />
      <el-table-column prop="contact_tel" label="联系方式" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="onUpdateContact(scope.row)"
          />
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="onDeleteContact(scope.row.contact_id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="total, sizes, prev, pager, next, jumper"
      background
      @size-change="onPageSizeChange"
      @current-change="onPageCurrentChange"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="pagination.page_size"
      :total="pagination.total_rows"
    />
    <el-dialog
      title="新增区域负责人"
      :visible.sync="contactDialogVisible"
      :close-on-click-modal="false"
      width="520px"
    >
      <el-form
        ref="contactForm"
        label-width="80px"
        :model="contactForm"
        :rules="rules"
        @keyup.enter.native="onSubmit"
      >
        <el-form-item label="区域" prop="contact_region">
          <el-input v-model="contactForm.contact_region" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系人" prop="contact_name">
          <el-input v-model="contactForm.contact_name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="联系方式" prop="contact_tel">
          <el-input v-model="contactForm.contact_tel" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contactDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepCopy } from "@/common/helper";
import { createContact, deleteContact } from "@/services/api/contacts";

export default {
  data() {
    return {
      contactDialogVisible: false,
      operate: "CREATE",
      contactForm: {
        contact_name: "",
        contact_tel: "",
        contact_region: ""
      },
      rules: {
        contact_region: { required: true, message: "请输入区域" },
        contact_name: { required: true, message: "请输入姓名" },
        contact_tel: { required: true, message: "请输入联系方式" }
      },
      pagination: {
        has_next: false,
        has_previous: false,
        page_num: 1,
        page_size: 10,
        total_pages: 0,
        total_rows: 0
      }
    };
  },
  created() {
    this.getContacts();
  },
  methods: {
    onCreateContact() {
      this.operate = "CREATE";
      this.contactForm = {
        contact_name: "",
        contact_tel: "",
        contact_region: ""
      };
      this.$refs.contactForm.resetFields();
      this.contactDialogVisible = true;
    },
    onUpdateContact(contact) {
      this.operate = "UPDATE";
      this.contactForm = contact;
      this.contactDialogVisible = true;
    },
    async onDeleteContact(contact_id) {
      try {
        await this.$confirm("确认删除该联系人吗", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });
        await deleteContact(contact_id);
        this.getContacts();
      } catch (err) {
        console.log(err);
      }
    },
    onSubmit() {
      this.$refs.contactForm.validate(async valid => {
        if (valid) {
          if (this.operate === "CREATE") {
            await createContact(this.contactForm);
          } else {
            const contact = deepCopy(this.contactForm);
            const contact_id = contact.contact_id;
            delete contact.contact_id;

            await this.$store.dispatch("contact/updateContact", {
              contact_id,
              data: contact
            });
          }

          await this.getContacts();
          this.contactDialogVisible = false;
          this.$refs.contactForm.resetFields();
        }
      });
    },
    onPageSizeChange(page_size) {
      this.getContacts({ page_num: 1, page_size });
    },
    onPageCurrentChange(page_num) {
      this.getContacts({ page_num, page_size: this.pagination.page_size });
    },
    async getContacts(query) {
      const res = await this.$store.dispatch("contact/getContacts", query);
      this.pagination = res.meta.pagination;
    },
    getRowIndex(index) {
      return index + 1;
    }
  }
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}

.el-pagination {
  margin-top: 20px;
  text-align: right;
}

::v-deep .el-dialog__body {
  padding: 30px 80px 10px 70px;
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
