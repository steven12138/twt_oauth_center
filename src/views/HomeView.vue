<script setup>

import { reactive, ref } from 'vue'
import { AppIcon, HomeIcon, SettingIcon, ViewListIcon } from 'tdesign-icons-vue-next'
import AccountColumn from '@/components/AccountColumn.vue'
import HomePage from '@/components/DashboardPage/HomePage.vue'
import { usePageState } from '@/stores/dashboard_state.js'
import router from '@/router/index.js'
import * as account from '@/apis/account.js'
import { check_password } from '@/utils/verify.js'
import { MessagePlugin } from 'tdesign-vue-next'
import DetailSettings from '@/components/DashboardPage/DetailSettings.vue'
import AuthorizePage from '@/components/DashboardPage/AuthorizePage.vue'

const pages = {
  home: {
    name: '首页',
    icon: HomeIcon,
    view: HomePage
  },
  // dashboard: {
  //   name: '个人信息',
  //   icon: UserIcon,
  //   view: InfoPage
  // },
  third_party: {
    name: '授权管理',
    icon: AppIcon,
    view: AuthorizePage
  },
  setting: {
    name: '更多设置',
    icon: SettingIcon,
    view: DetailSettings
  }
}

const page_list = Object.entries(pages).map(([key, value]) => ({ key, ...value }))

const options = [
  {
    content: '修改密码',
    value: 1,
    click: showPassword
  },
  {
    content: '退出登录',
    value: 2,
    theme: 'error',
    click: () => {
      account.logout()
      router.push('/login')
    }
  }
]

function showPassword() {
  password_change_form_ref.value.reset()
  show_change_password.value = true
}


const change_page = (value) => {
  pageState.current_page = value
  console.log(value)
}

const collapsed = ref(false)

function trigger_dropdown(e) {
  e.click()
}

const show_change_password = ref(false)
let password_change_form = reactive({
  new_password: '',
  new_password_second: ''
})

const passwordValidator = (val) => {
  if (val.length < 8) return {
    result: false,
    message: '密码长度必须大于8',
    type: 'error'
  }
  if (check_password(val)) {
    return {
      result: true
    }
  }
  return {
    result: false,
    message: '必须包含1位字母，1位数字',
    type: 'error'
  }
}

const rePasswordValidator = (val) => {
  if (val !== password_change_form.new_password)
    return {
      result: false,
      type: 'error',
      message: '两次输入的密码必须一致'
    }
  return {
    result: true
  }
}

const pageState = usePageState()

const change_password_rules = {
  new_password: [
    { required: true, message: '密码为必填项', type: 'error', trigger: 'blur' },
    { validator: passwordValidator, trigger: 'change' },
    { validator: passwordValidator, trigger: 'blur' }
  ],
  new_password_second: [
    { required: true, message: '密码为必填项', type: 'error', trigger: 'blur' },
    { validator: rePasswordValidator, trigger: 'change' },
    { validator: rePasswordValidator, trigger: 'blur' }
  ]
}
const password_change_form_ref = ref(null)

async function submit_form() {
  const res = await password_change_form_ref.value.validate()
  if (res !== true) return
  await account.changePassword(password_change_form.new_password)
  MessagePlugin.success('密码修改成功')
  show_change_password.value = false
}

window.matchMedia('(min-width: 920px)').addEventListener('change', (e) => {
  collapsed.value = !e.matches
})

collapsed.value = !window.matchMedia('(min-width: 920px)').matches

</script>

<template>
  <div>
    <t-layout style="height: 100vh">
      <t-header>
        <t-head-menu value="item1" height="120px">
          <template #logo>
            <img height="40px" class="logo" src="@/assets/logo.png" alt="logo" />
            <span style="font: var(--td-font-title-large); margin-left: 10px;">TWT Studio</span>
          </template>
          <template #operations>
            <t-dropdown :options="options" tr igger="hover" placement="bottom" @click="trigger_dropdown">
              <t-button variant="text" size="large">
                账户设置
              </t-button>
            </t-dropdown>
          </template>
        </t-head-menu>
      </t-header>
      <t-layout>
        <t-aside style="border-top: 1px solid var(--component-border);width:auto;">
          <t-menu :collapsed="collapsed" theme="light" :value="pageState.current_page" height="550px"
                  @change="change_page">
            <AccountColumn :style="{height:collapsed?0:'40px',}"
                           style="margin:10px; transition: height .25s ease-in-out; overflow: hidden;"
                           avatar="https://picsum.photos/200/300" />
            <t-divider v-show="!collapsed" style="margin:10px" />
            <t-menu-item v-for="item in page_list" :key="item.key" :value="item.key">
              <template #icon>
                <component :is="item.icon" />
              </template>
              {{ item.name }}
            </t-menu-item>
            <template #operations>
              <t-button class="t-demo-collapse-btn" variant="text" shape="square" @click="collapsed=!collapsed">
                <template #icon>
                  <ViewListIcon />
                </template>
              </t-button>
            </template>
          </t-menu>
        </t-aside>
        <t-layout class="layout_class">
          <div class="main">
            <transition name="fade" mode="out-in">
              <component @show-change-password="showPassword" :is="pages[pageState.current_page].view??'div'"
                         class="view" />
            </transition>
          </div>
          <t-footer style="text-align: center">Copyright @ 2000-{{ new Date().getFullYear() }} TWT Studio. All Rights
            Reserved
          </t-footer>
        </t-layout>
      </t-layout>
    </t-layout>
    <t-dialog v-model:visible="show_change_password" @confirm="submit_form">
      <template #header>
        <span>修改密码</span>
      </template>
      <t-form
        ref="password_change_form_ref"
        :data="password_change_form"
        label-align="right"
        :rules="change_password_rules"
        label-width="140px">
        <t-form-item label="新密码" :required-mark="true" name="new_password">
          <t-input type="password" size="large" v-model:value="password_change_form.new_password" />
        </t-form-item>
        <t-form-item label="请再次输入新密码" :required-mark="true" name="new_password_second">
          <t-input type="password" size="large" v-model:value="password_change_form.new_password_second" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>


<style scoped>
.main {
  padding: 24px;
  flex: 1;
}

.layout_class {
  height: calc(100vh - 56px);
  overflow-y: auto;
}
</style>
