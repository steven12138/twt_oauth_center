<template>
  <div class="settings-advanced">
    <!-- 修改个人信息卡片 -->
    <t-card :bordered="false" class="card-section" title="个人信息">
      <div v-if="!isEditing" class="info-list">
        <div
          v-for="(item, index) in personalInfoItems"
          :key="index"
          class="info-item"
          @click="enterEditMode(index)"
        >
          <span class="info-label">{{ item.label }}</span>
          <span class="info-value">{{ item.value || '未填写' }}</span>
          <t-icon name="chevron-right" />
        </div>
      </div>

      <div v-else class="edit-mode">
        <t-icon name="chevron-left" class="back-icon" @click="exitEditMode" />
        <t-descriptions :column="1" label-align="left">
          <t-descriptions-item :label="currentEditItem.label">
            <t-input v-model="currentEditItem.value" :placeholder="currentEditItem.placeholder" />
          </t-descriptions-item>
          <!-- 验证码输入框 -->
          <t-descriptions-item v-if="currentEditItem?.label === '手机号码'" label="验证码">
            <div style="display: flex; align-items: center">
              <t-input
                v-model="vcode"
                placeholder="请输入验证码"
                style="flex: 1; margin-right: 10px"
              />
              <t-button :disabled="isVcodeSent" @click="sendVcode">
                {{ vcodeButtonText }}
              </t-button>
            </div>
          </t-descriptions-item>
        </t-descriptions>
        <div class="actions">
          <t-button theme="normal" style="margin-right: 10px" @click="exitEditMode">取消</t-button>
          <t-button theme="primary" @click="saveEdit" :disabled="isSaveDisabled">保存</t-button>
        </div>
      </div>
    </t-card>

    <!-- <t-card class="container-base-margin-top" :bordered="false">
      <t-row :gutter="16">
        <t-col :xl="12">
          <div class="settings-block">
            <t-descriptions :title="'偏好设置'" :column="1" label-align="left">
              <t-descriptions-item label="语言">
                <t-radio-group v-model="language">
                  <t-radio-button value="zh">中文</t-radio-button>
                  <t-radio-button value="en">English</t-radio-button>
                </t-radio-group>
              </t-descriptions-item>
            </t-descriptions>
          </div>
        </t-col>
      </t-row>
    </t-card> -->
  </div>
</template>
  
  
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { updateNickname, updateEmail, changePhone, getVcode } from '@/apis/setting.js'
import { userInfo, getUserInfo, setUserInfo } from '../../stores/userInfo.js'
import { AxiosResponse } from 'axios'
import { MessagePlugin } from 'tdesign-vue-next'

interface PersonalInfoItem {
  label: string
  value: string
  placeholder: string
  saveAction: (string) => Promise<AxiosResponse<any>>
  needsVcode?: boolean // 是否需要验证码
}

const isEditing = ref(false)
const currentEditIndex = ref(-1)
const language = ref<'zh' | 'en'>('zh')

const order = ['nickname', 'telephone', 'email']

const info_key_map: Record<string, string> = {
  nickname: '昵称',
  telephone: '手机号码',
  email: '邮箱'
}

const includes_keys = ['nickname', 'telephone', 'email']

const user_info_keys = computed(() => {
  return Object.entries(userInfo.value)
    .filter(([key]) => includes_keys.includes(key))
    .filter(([key]) => key in info_key_map)
    .sort((a, b) => {
      return order.indexOf(a[0]) - order.indexOf(b[0])
    })
    .map(([key, value]) => ({ key: info_key_map[key], value }))
})

const personalInfoItems = computed<PersonalInfoItem[]>(() => {
  return user_info_keys.value.map(({ key, value }) => {
    let saveAction
    let fieldName
    let needsVcode = false
    switch (key) {
      case '昵称':
        saveAction = updateNickname
        break
      case '手机号码':
        saveAction = changePhone
        needsVcode = true // 需要验证码, 以此来判断是不是手机号码
        break
      case '邮箱':
        saveAction = updateEmail
        break
      default:
        saveAction = async () => {}
    }

    return {
      label: key,
      value: (value as string) || '',
      placeholder: `请输入新${key}`,
      saveAction,
      needsVcode
    }
  })
})

const currentEditItem = ref<PersonalInfoItem | null>(null)
const vcode = ref<string>('') 
const isVcodeSent = ref<boolean>(false) 
const vcodeButtonText = ref<string>('获取验证码')

const enterEditMode = (index: number) => {
  currentEditIndex.value = index
  currentEditItem.value = { ...personalInfoItems.value[index] }
  isEditing.value = true
}

const exitEditMode = () => {
  isEditing.value = false
  currentEditIndex.value = -1
  vcode.value = ''
}

// 发送验证码
const sendVcode = async () => {
  if (!currentEditItem.value || currentEditItem.value.label !== '手机号码') return

  try {
    await getVcode(currentEditItem.value.value)
    isVcodeSent.value = true
    vcodeButtonText.value = '验证码已发送'
    MessagePlugin.success('验证码已发送到您的手机，请查收！')
  } catch (error) {
    MessagePlugin.error('发送验证码失败，请稍后再试')
  }
}

// 禁用保存按钮
const isSaveDisabled = computed(() => {
  if (!currentEditItem.value) return true
  const originalValue = personalInfoItems.value[currentEditIndex.value].value
  //   return currentEditItem.value!.value === originalValue
  return false // 用于测试, TODO: 记得要改回来
})

const saveEdit = async () => {
  if (currentEditItem.value) {
    try {
      const item = personalInfoItems.value[currentEditIndex.value]

      // 提示用户输入验证码
      if (item.needsVcode && !vcode.value) {
        MessagePlugin.warning('请输入验证码')
        return
      }

      if (item.needsVcode) {
        await changePhone(vcode.value, currentEditItem.value.value)
      } else {
        await item.saveAction(currentEditItem.value.value)
      }

      // 更新本地存储的用户信息
      const key = Object.keys(info_key_map).find((k) => info_key_map[k] === item.label)
      if (key) {
        setUserInfo({
          ...userInfo.value,
          [key]: currentEditItem.value.value
        })
      }

      MessagePlugin.success('信息修改成功！')
      exitEditMode()
    } catch (error) {
      MessagePlugin.error('信息修改失败 ', error)
    }
  }
}

// 在组件挂载时获取用户信息
onMounted(async () => {
  try {
    await getUserInfo()
  } catch (error) {
    MessagePlugin.error('获取用户信息失败:', error)
  }
})
</script>

  
<style scoped>
.settings-advanced {
  max-width: 900px;
  margin: 40px auto;
}

.card-section {
  margin-bottom: 24px;
}

.info-list {
  display: flex;
  flex-direction: column;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: background-color 0.3s;
}

.info-item:hover {
  background-color: #f5f5f5;
}

.info-label {
  font-size: 12px;
  color: #888;
  width: 10%;
}

.info-value {
  text-align: left;
  flex-grow: 1;
  padding-left: 16px;
  margin-right: auto;
}

.edit-mode {
  padding: 20px;
}

.back-icon {
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 16px;
}

.settings-block {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.actions {
  margin-top: 20px;
  text-align: right;
}
</style>
