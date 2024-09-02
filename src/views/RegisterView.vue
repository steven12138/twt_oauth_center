<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { check_email, check_password, check_phone } from '@/utils/verify.js'
import * as account from '@/apis/account.js'
import { MessagePlugin } from 'tdesign-vue-next'

const page = ref(0)

const router = useRouter()


onMounted(() => {
  const last_send_verify = localStorage.getItem('last_send_verify')
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

let register_form = reactive({
  username: '',
  nickname: '',
  password: '',
  password_second: '',
  id: '',
  sid: '',
  phone: '',
  verify_code: '',
  email: '',
  policy: false
})
const base_form = ref(null)
const password_form = ref(null)
const more_info_form = ref(null)
const contact_form = ref(null)

const length_validator = (val, filed_name, length) => {
  if (val.length < length) return {
    result: false,
    message: `${filed_name}需要大于${length}个字符`,
    type: 'error'
  }
  return { result: true }
}

const password_validator = (val) => {
  if (val.length < 6) return {
    result: false,
    message: '密码长度必须大于6个字符',
    type: 'error'
  }
  if (!check_password(val)) return {
    result: false,
    message: '密码至少包含1位字母，1位数字',
    type: 'error'
  }
  return { result: true }
}

const password_same_validator = (val) => {
  if (val !== register_form.password) return {
    result: false,
    message: '两次输入的密码不一致',
    type: 'error'
  }
  return { result: true }

}

const phone_validator = (val) => {
  console.log(check_phone(val))
  if (!check_phone(val)) return {
    result: false,
    message: '请输入正确的手机号',
    type: 'error'
  }
  return { result: true }
}

const email_validator = (val) => {
  if (!check_email(val)) return {
    result: false,
    message: '请输入正确的邮箱',
    type: 'error'
  }
  return { result: true }
}

const register_base_rule = {
  username: [
    { required: true, message: '用户名为必填项', type: 'error', trigger: 'blur' },
    { validator: (val) => length_validator(val, '用户名', 6), trigger: 'blur' },
    { validator: (val) => length_validator(val, '用户名', 6), trigger: 'change' }
  ],
  nickname: [
    { required: true, message: '昵称为必填项', type: 'error', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码为必填项', type: 'error', trigger: 'blur' },
    { validator: password_validator, trigger: 'change' },
    { validator: password_validator, trigger: 'blur' }
  ],
  password_second: [
    { required: true, message: '请再次输入密码', type: 'error', trigger: 'blur' },
    { validator: password_same_validator, trigger: 'change' },
    { validator: password_same_validator, trigger: 'blur' }
  ],
  sid: [
    { required: true, message: '学号为必填项', type: 'error', trigger: 'blur' }
  ],
  id: [
    { required: true, message: '证件号码为必填项', type: 'error', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '手机号为必填项', type: 'error', trigger: 'blur' },
    { validator: phone_validator, trigger: 'change' },
    { validator: phone_validator, trigger: 'blur' }
  ],
  verify: [
    { required: true, message: '验证码为必填项', type: 'error', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '邮箱为必填项', type: 'error', trigger: 'blur' },
    { validator: email_validator, trigger: 'change' },
    { validator: email_validator, trigger: 'blur' }
  ],
  policy: [
    {
      validator: (val) => {
        if (!val) return {
          result: false,
          message: '您必须同意用户协议才能使用天外天账号',
          type: 'error'
        }
        return { result: true }
      },
      trigger: 'change'
    }
  ]
}

async function next_page_with_ref(r) {
  const res = await r.validate()
  console.log(res)
  if (res !== true) return
  page.value += 1
}

const verify_cooldown = ref(0)

async function send_verify_code() {
  // send code
  const res = await contact_form.value.validate({
    fields: ['phone']
  })
  if (res !== true) return

  await account.send_phone_verify(register_form.phone)
  MessagePlugin.success('验证码发送成功')
  verify_cooldown.value = 60
  const now = new Date().getTime()
  localStorage.setItem('last_send_verify', now)
  const clock = setInterval(() => {
    verify_cooldown.value -= 1
    if (verify_cooldown.value === 0) clearInterval(clock)
  }, 1000)
}

async function register() {
  const res = await contact_form.value.validate()
  if (res !== true) return
  await account.register(
    register_form.sid,
    register_form.id,
    register_form.nickname,
    register_form.email,
    register_form.phone,
    register_form.verify_code,
    register_form.password
  )
  MessagePlugin.success('注册成功, 请前往登录')
  router.replace('/login')
}

</script>

<template>
  <div class="container">
    <div class="login-card">
      <div class="decorated-img" />
      <div class="action-area">
        <div class="title">
          <div class="logo"></div>
          <div class="logo-group">
            <img src="@/assets/logo-text.svg" alt="TWT Logo" />
            <div class="welcome">欢迎来到天外天</div>
          </div>
        </div>
        <transition name="slide-fade" mode="out-in">
          <!--          base info-->
          <div class="step" v-if="page===0">
            <span class="action-name">注册一个新账户</span>
            <div class="privileges">
              <span style="color: #575757">我们需要一些您的个人信息以开始：</span>
            </div>
            <t-form ref="base_form" :data="register_form" :rules="register_base_rule">
              <t-form-item name="username" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.username" placeholder="用户名" size="large" />
              </t-form-item>
              <t-form-item name="nickname" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.nickname" placeholder="昵称" size="large" />
              </t-form-item>
            </t-form>
            <div class="spacer"></div>
            <div class="action-button">
              <t-button variant="text" theme="primary" size="large" @click="router.replace('/login')">
                已经有账号，去登录
              </t-button>
              <t-button variant="base" shape="round" theme="primary" size="large"
                        @click="next_page_with_ref(base_form)">
                下一步
              </t-button>
            </div>
          </div>
          <!--          password-->
          <div class="step" v-else-if="page===1">
            <span class="action-name">设置密码</span>
            <div class="privileges">
              <span style="color: #575757">请设置一个好记的密码</span>
            </div>
            <t-form ref="password_form" :data="register_form" :rules="register_base_rule">
              <t-form-item name="password" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.password" placeholder="密码" size="large" type="password" />
              </t-form-item>
              <t-form-item name="password_second" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.password_second" placeholder="请再次输入密码" size="large"
                         type="password" />
              </t-form-item>
            </t-form>
            <div class="spacer"></div>
            <div class="action-button">
              <t-button variant="base" shape="round" theme="primary" size="large"
                        @click="next_page_with_ref(password_form)">
                继续
              </t-button>
            </div>
          </div>


          <!--          个人信息需要-->
          <div class="step" v-else-if="page===2">
            <span class="action-name">我们需要更多信息</span>
            <div class="privileges">
              <span style="color: #575757">我们需要更多信息以继续</span>
            </div>
            <t-form ref="more_info_form" :data="register_form" :rules="register_base_rule">
              <t-form-item name="sid" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.sid" placeholder="学号/工资号" size="large" />
              </t-form-item>
              <t-form-item name="id" label-width="0px" :required-mark="false"
                           help="居民身份证/港澳台来访通行证/护照/港澳身份证">
                <t-input v-model="register_form.id" placeholder="证件号" size="large">
                </t-input>
              </t-form-item>
            </t-form>
            <div class="action-button">
              <!--              <t-button variant="text" shape="round" theme="primary" size="large"-->
              <!--                        @click="page-=1">上一步-->
              <!--              </t-button>-->
              <t-button variant="base" shape="round" theme="primary" size="large"
                        @click="next_page_with_ref(more_info_form)">
                继续
              </t-button>
            </div>
          </div>

          <!--          绑定手机号-->
          <div class="step" style="gap:10px;" v-else-if="page===3">
            <span class="action-name" style="margin-bottom: 10px;">绑定个人信息</span>
            <t-form ref="contact_form" :data="register_form" :rules="register_base_rule">
              <t-form-item name="phone" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.phone" placeholder="手机号" size="medium" />
              </t-form-item>
              <t-form-item name="verify" label-width="0px" :required-mark="false">
                <div style="display: flex;align-items: center;width: 100%;gap: 10px;">
                  <t-input v-model="register_form.verify_code" placeholder="请输入短信验证码" />
                  <t-button @click="send_verify_code" style="min-width: 100px;" variant="outline"
                            :disabled="verify_cooldown!==0">
                    {{ verify_cooldown !== 0 ? `${verify_cooldown}s` : '发送验证码' }}
                  </t-button>
                </div>
              </t-form-item>
              <t-form-item name="email" label-width="0px" :required-mark="false">
                <t-input v-model="register_form.email" placeholder="邮箱" />
              </t-form-item>
              <t-form-item name="policy" label-width="0px" :required-mark="false">
                <t-checkbox v-model="register_form.policy">
                  我已阅读并同意
                  <t-link theme="primary" target="_blank" href="https://www.twt.edu.cn">《天外天用户协议》</t-link>
                </t-checkbox>
              </t-form-item>
            </t-form>
            <div class="spacer"></div>
            <div class="action-button">
              <t-button variant="base" shape="round" theme="primary" size="large"
                        @click="register">
                完成注册
              </t-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/login_view.css";
</style>