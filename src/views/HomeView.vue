<script setup lang="jsx">

import { computed, reactive, ref } from 'vue'
import { HomeIcon, InternetIcon, SettingIcon, UserIcon } from 'tdesign-icons-vue-next'
import AccountColumn from '@/components/AccountColumn.vue'
import HomePage from '@/components/HomePage.vue'
import InfoPage from '@/components/WelcomeItem.vue'

const pages = reactive({
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
  setting: {
    name: '更多设置',
    icon: SettingIcon
  }
})

const page_list = computed(() => {
  return Object.entries(pages).map(([key, value]) => ({ key, ...value }))
})

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
</script>

<template>
  <t-layout style="height: 100vh">
    <t-header>
      <t-head-menu value="item1" height="120px">
        <template #logo>
          <img height="40" class="logo" src="@/assets/logo.png" alt="logo" />
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
      <t-aside style="border-top: 1px solid var(--component-border)">
        <t-menu theme="light" :value="current_page" style="margin-right: 50px" height="550px"
                @change="change_page">
          <AccountColumn style="margin:10px" avatar="https://picsum.photos/200/300"
                         username="StevenKerman"
                         sid="3022001441" />
          <t-divider style="margin:10px" />
          <t-menu-item v-for="item in page_list" :key="item.key" :value="item.key">
            <template #icon>
              <component :is="item.icon" />
            </template>
            {{ item.name }}
          </t-menu-item>
        </t-menu>
      </t-aside>
      <t-layout>
        <transition name="fade" mode="out-in">
          <component :is="pages[current_page].view||'div'" class="view" style="flex:1;" />
        </transition>
        <t-footer style="text-align: center">Copyright @ 2000-{{ new Date().getFullYear() }} TWT Studio. All Rights Reserved</t-footer>
      </t-layout>
    </t-layout>
  </t-layout>
</template>

