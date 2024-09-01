<script setup lang="jsx">
import { userInfo } from '@/stores/userInfo.js'
import { computed, ref } from 'vue'
import { QuestionnaireIcon, UserIcon } from 'tdesign-icons-vue-next'
import { current_page } from '@/stores/dashboard_state.js'

const excluded_keys = [
  'token',
  'area',
  'building',
  'floor',
  'room',
  'bed',
  'upgradeNeed',
  'avatar'
]

const greetings = {
  morning: { range: [5, 8], message: '早上好，新的一天开始啦！' },   // 5点到8点
  forenoon: { range: [8, 12], message: '上午好，祝你有美好的一天？' }, // 8点到12点
  noon: { range: [12, 14], message: '中午好，别忘了休息一下再继续哦！' }, // 12点到14点
  afternoon: { range: [14, 18], message: '下午好，继续加油！' }, // 14点到18点
  evening: { range: [18, 23], message: '晚上好，适当放松一下吧！' },  // 18点到23点
  midnight: { range: [23, 2], message: '夜深了，早点休息！' }, // 23点到2点
  earlyMorning: { range: [2, 5], message: '凌晨了，注意休息哦！' } // 2点到5点
}


function getGreeting() {
  const now = new Date() // 获取当前日期和时间
  const hour = now.getHours() // 获取当前小时

  // 遍历对象来找到合适的时间段
  for (const key in greetings) {
    const { range, message } = greetings[key]
    const [start, end] = range

    // 处理跨天的时间段（例如: 23点到2点）
    if ((start <= end && hour >= start && hour < end) ||
      (start > end && (hour >= start || hour < end))) {
      return message // 返回对应的问候语
    }
  }
}


const info_key_map = {
  userNumber: '学号',
  nickname: '昵称',
  telephone: '手机号码',
  email: '邮箱',
  role: '权限',
  realname: '真实姓名',
  gender: '性别',
  department: '部门',
  major: '专业',
  stuType: '学生类型',
  campus: '校区',
  idNumber: '身份证号'
}

const order = [
  'nickname', 'userNumber', 'telephone', 'email',
  'realname', 'gender', 'role', 'department',
  'major', 'stuType', 'campus', 'idNumber'
]

const user_info_keys = computed(() => {
  return Object.entries(userInfo.value)
    .filter(([key]) => !excluded_keys.includes(key))
    .filter(([key]) => key in info_key_map)
    .sort((a, b) => {
      return order.indexOf(a[0]) - order.indexOf(b[0])
    })
    .map(([key, value]) => ({ key: info_key_map[key], value }))
})


const shortcut_list = [
  {
    name: '党建系统',
    icon: 'https://www.twt.edu.cn/assets/frame1.77f77f48.svg'
  },
  {
    name: '理论答题',
    icon: 'https://tdesign.gtimg.com'
  },
  {
    name: '方寸流年',
    icon: 'https://tdesign.gtimg.com'
  },
  {
    name: '新闻网',
    icon: 'https://tdesign.gtimg.com'
  }
]

const icon = computed(() => () => < UserIcon />)

const date = ref(new Date().toLocaleString())

setInterval(() => {
  date.value = new Date().toLocaleString()
}, 1000)


</script>

<template>
  <div class="outer-row">
    <div class="info-first-col">
      <t-card class="greeting" :bordered="false">
        <template #title>
          <span style="font: var(--td-font-body-large); font-size: 1.3em;padding: 20px 0;">
            Hi, {{ userInfo.nickname ?? '天外天用户' }}, {{ getGreeting() }}
          </span>
        </template>
        <template #actions>
          <h1>{{ date }}</h1>
        </template>
      </t-card>
      <t-card :bordered="false">
        <template #title>
          <span style="font: var(--td-font-body-large); font-size: 1.3em;">个人信息</span>
        </template>
        <t-descriptions :column="4" item-layout="vertical">
          <template v-if="Object.keys(userInfo).length===0">
            <t-descriptions-item v-for="(item, index) in info_key_map" :key="index"
                                 :label="item">
              <t-skeleton animation="gradient" :row-col="[1]" />
            </t-descriptions-item>
          </template>
          <template v-else>
            <t-descriptions-item v-for="(item, index) in user_info_keys" :key="index" :label="item.key">
            <span style="display:block;width: 100%; text-overflow: ellipsis; overflow: hidden;"
                  :title="item.value">{{ item.value }}</span>
            </t-descriptions-item>
          </template>
        </t-descriptions>
      </t-card>
      <div class="privacy-row">
        <t-card style="flex:1; overflow: hidden" :bordered="false">
          <template #title>
            <span style="font: var(--td-font-body-large); font-size: 1.3em;">隐私与第三方应用</span>
          </template>
          <div class="cover-half-card">
            <span
              class="desc-half-card">查看您 TWT 账号中的数据，并选择授权的第三方应用，管理授权与撤回第三方隐私协议</span>
            <div class="cover-half-card-image cover-privacy"></div>
          </div>
          <template #footer>
            <t-link theme="primary" size="medium" variant="text" @click="current_page='third_party'">
              管理第三方应用授权
            </t-link>
          </template>
        </t-card>
        <t-card style="flex:1; overflow: hidden" :bordered="false">
          <template #title>
            <span style="font: var(--td-font-body-large); font-size: 1.3em;">升学与账号升级</span>
          </template>
          <div class="cover-half-card">
            <span
              class="desc-half-card">当您在本校进行升学之后，可通过此功能继续使用原有 TWT 账号，并保留其中数据</span>
            <div class="cover-half-card-image cover-upgrade"></div>
          </div>
          <template #footer>
            <t-link theme="primary" size="medium" variant="text" @click="current_page='upgrade'">前往账号升级</t-link>
          </template>
        </t-card>
      </div>
    </div>
    <div class="info-sec-col">
      <t-card theme="poster2" :bordered="false" style="overflow: hidden">
        <template #cover>
          <div class="cover"></div>
        </template>
        <template #footer>
          <t-comment avatar="https://tdesign.gtimg.com/site/avatar-boy.jpg" :author="userInfo.nickname"
                     content="微北洋个人简介" />
        </template>
      </t-card>
      <t-card :bordered="false">
        <template #title>
          <span style="font: var(--td-font-body-large); font-size: 1.3em;">快捷应用</span>
        </template>
        <div class="shortcuts">
          <div v-for="(item, ind) in shortcut_list" :key="ind" class="shortcut-item">
            <t-avatar size="42px" shape="circle" :icon="icon" :hide-on-load-failed="true" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </t-card>
    </div>
  </div>
</template>

<style scoped>

.cover-half-card {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.desc-half-card {
  width: 50%;
}

.cover-privacy {
  background-image: url("@/assets/authenticate.png");
}

.cover-upgrade {
  background-image: url("@/assets/upgrade.png");
}

.cover-half-card-image {
  height: 100%;
  min-height: 70px;
  width: 40%;
  transform: scale(2) translateX(5%);

  background-position: bottom;
  background-size: contain;
  background-repeat: no-repeat;
}

.privacy-row {
  display: flex;
  flex-direction: row;
  gap: 24px;
}

.shortcut-item > span {
  font: var(--td-font-body-large);
}

.shortcut-item:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px rgba(0, 0, 0, .1);
  background-color: #f5f5f5;
}

.shortcut-item {
  transition: all .25s ease-in-out;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  align-items: center;
  margin-bottom: 8px;
}

.shortcuts {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.cover {
  background-image: url("@/assets/decorated.png");
  height: 200px;
  background-position: bottom;
  background-size: cover;
  background-repeat: no-repeat;
}

.info-sec-col {
  flex: 1 1 400px;
  gap: 24px;
  display: flex;
  flex-direction: column;
}

.info-first-col {
  flex: 3 3 900px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.outer-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

</style>