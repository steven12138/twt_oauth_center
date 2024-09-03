<script setup>
import { defineProps, defineEmits, onMounted, ref } from 'vue'
import * as account from '@/apis/account.js'
import * as setting from '@/apis/setting.js'
import { MessagePlugin } from 'tdesign-vue-next'
import { useUserInfoStore } from '@/stores/userInfo.js'

const props = defineProps({
  visible: Boolean,
  mode: String
})

const emit = defineEmits(['update:visible'])

const verify_cooldown = ref(0)
onMounted(() => {
  const last_send_verify = localStorage.getItem('last_send_verify_for_change')
  if (last_send_verify) {
    const now = new Date().getTime()
    const diff = now - last_send_verify
    if (diff < 60000) {
      verify_cooldown.value = Math.floor((60000 - diff) / 1000)
      const clock = setInterval(() => {
        verify_cooldown.value -= 1
        if (verify_cooldown.value === 0) clearInterval(clock)
      }, 1000)
    }
  }
})

function closeDialog() {
  formRef.value.reset()

  emit('update:visible', false)
}

const passwordValidator = (val) => {
  if (val.length < 8) {
    return {
      result: false,
      message: '密码长度必须大于8',
      type: 'error'
    }
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

const rePasswordValidator = (val, formData) => {
  if (val !== formData.new_pwd) {
    return {
      result: false,
      type: 'error',
      message: '两次输入的密码必须一致'
    }
  }
  return {
    result: true
  }
}

const phoneValidator = (val) => {
  const phoneRegex = /^1[3-9]\d{9}$/
  if (!phoneRegex.test(val)) {
    return {
      result: false,
      message: '请输入有效的手机号',
      type: 'error'
    }
  }
  return {
    result: true
  }
}

const emailValidator = (val) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(val)) {
    return {
      result: false,
      message: '请输入有效的邮箱地址',
      type: 'error'
    }
  }
  return {
    result: true
  }
}

const changeFormRules = (mode) => {
  const rules = {
    new_pwd: [
      { required: true, message: '密码为必填项', type: 'error', trigger: 'blur' },
      { validator: passwordValidator, trigger: 'change' },
      { validator: passwordValidator, trigger: 'blur' }
    ],
    rePwd: [
      { required: true, message: '密码为必填项', type: 'error', trigger: 'blur' },
      { validator: (val) => rePasswordValidator(val, formData.value), trigger: 'change' },
      { validator: (val) => rePasswordValidator(val, formData.value), trigger: 'blur' }
    ],
    new_phone: [
      { required: true, message: '手机号为必填项', type: 'error', trigger: 'blur' },
      { validator: phoneValidator, trigger: 'change' },
      { validator: phoneValidator, trigger: 'blur' }
    ],
    vcode: [{ required: true, message: '验证码为必填项', type: 'error', trigger: 'blur' }],
    new_email: [
      { required: true, message: '邮箱为必填项', type: 'error', trigger: 'blur' },
      { validator: emailValidator, trigger: 'change' },
      { validator: emailValidator, trigger: 'blur' }
    ]
  }

  return mode === 'password'
    ? { new_pwd: rules.new_pwd, rePwd: rules.rePwd }
    : mode === 'phone'
    ? { new_phone: rules.new_phone, vcode: rules.vcode }
    : { new_email: rules.new_email }
}

const formRef = ref(null)
const formData = ref({
  new_pwd: '',
  rePwd: '',
  new_phone: '',
  vcode: '',
  new_email: ''
})

async function submitForm() {
  const res = await formRef.value.validate()
  if (res !== true) return

  if (props.mode === 'password') {
    await account.changePassword(formData.value.new_pwd)
    MessagePlugin.success('密码修改成功')
  } else if (props.mode === 'phone') {
    await setting.changePhone(formData.value.vcode, formData.value.new_phone)
    MessagePlugin.success('手机号更换成功')
  } else if (props.mode === 'email') {
    await setting.updateEmail(formData.value.new_email)
    MessagePlugin.success('邮箱更换成功')
  }

  useUserInfoStore().fetchUserInfo()

  emit('update:visible', false)
}

async function sendVcode() {
  const phoneValidation = phoneValidator(formData.value.new_phone)
  if (!phoneValidation.result) {
    MessagePlugin.error(phoneValidation.message)
    return
  }
  await setting.getVcode(formData.value.new_phone)
  MessagePlugin.success('验证码已发送')
  verify_cooldown.value = 60
  const now = new Date().getTime()
  localStorage.setItem('last_send_verify_for_change', now)
  const clock = setInterval(() => {
    verify_cooldown.value -= 1
    if (verify_cooldown.value === 0) clearInterval(clock)
  }, 1000)
}
</script>

<template>
  <t-dialog :visible="props.visible" @close="closeDialog" @confirm="submitForm">
    <template #header>
      <span>{{
        props.mode === 'password' ? '修改密码' : props.mode === 'phone' ? '更换手机号' : '更换邮箱'
      }}</span>
    </template>
    <t-form
      ref="formRef"
      :data="formData"
      label-align="right"
      :rules="changeFormRules(props.mode)"
      label-width="140px"
    >
      <t-form-item
        v-if="props.mode === 'phone'"
        label="请输入手机号"
        :required-mark="true"
        name="new_phone"
      >
        <t-input type="text" size="large" v-model="formData.new_phone" />
      </t-form-item>
      <t-form-item
        v-if="props.mode === 'phone'"
        label="请输入验证码"
        :required-mark="true"
        name="vcode"
      >
        <div style="display: flex; align-items: center; width: 100%; gap: 10px">
          <t-input
            type="text"
            size="large"
            v-model="formData.vcode"
            style="width: 50%; margin-right: 10px"
          />
          <t-button @click="sendVcode" :disabled="verify_cooldown !== 0" style="width: 40%">{{
            verify_cooldown !== 0 ? `${verify_cooldown}s` : '发送验证码'
          }}</t-button>
        </div>
      </t-form-item>
      <t-form-item
        v-if="props.mode === 'email'"
        label="请输入邮箱"
        :required-mark="true"
        name="new_email"
      >
        <t-input size="large" v-model="formData.new_email" />
      </t-form-item>
    </t-form>
  </t-dialog>
</template>

<style scoped>
</style>