<script setup lang="jsx">

import { onMounted, ref } from 'vue'
import { AppIcon, HomeIcon, InternetIcon, SettingIcon, UserIcon, ViewListIcon } from 'tdesign-icons-vue-next'
import AccountColumn from '@/components/AccountColumn.vue'
import HomePage from '@/components/HomePage.vue'
import InfoPage from '@/components/WelcomeItem.vue'
import { getUserInfo, userInfo } from '@/stores/userInfo.js'

const pages = {
  home: {
    name: '首页',
    icon: HomeIcon,
    view: HomePage
  },
  dashboard: {
    name: '个人信息',
    icon: UserIcon,
    view: InfoPage
  },
  upgrade: {
    name: '账号升级',
    icon: InternetIcon
  },
  third_party: {
    name: '授权管理 ',
    icon: AppIcon
  },
  setting: {
    name: '更多设置',
    icon: SettingIcon
  }
}

const page_list = Object.entries(pages).map(([key, value]) => ({ key, ...value }))

const options = [
  { content: '修改密码', value: 1 },
  { content: '退出登录', value: 2, theme: 'error' }
]

console.log(page_list.value)

const current_page = ref('home')
const change_page = (value) => {
  current_page.value = value
  console.log(value)
}

const collapsed = ref(false)



</script>

<template>
  <t-layout style="height: 100vh">
    <t-header>
      <t-head-menu value="item1" height="120px">
        <template #logo>
          <img height="40px" class="logo" src="@/assets/logo.png" alt="logo" />
          <span style="font: var(--td-font-title-large); margin-left: 10px;">TWT Studio</span>
        </template>
        <template #operations>
          <t-dropdown :options="options" trigger="hover">
            <t-space>
              <t-button variant="text">
                账户设置
              </t-button>
            </t-space>
          </t-dropdown>
        </template>
      </t-head-menu>
    </t-header>
    <t-layout>
      <t-aside style="border-top: 1px solid var(--component-border);width:auto;">
        <t-menu :collapsed="collapsed" theme="light" :value="current_page" height="550px"
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
      <t-layout>
        <transition name="fade" mode="out-in">
          <component :is="pages[current_page].view||'div'" class="view" style="flex:1;" />
        </transition>
        <t-footer style="text-align: center">Copyright @ 2000-{{ new Date().getFullYear() }} TWT Studio. All Rights
          Reserved
        </t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

