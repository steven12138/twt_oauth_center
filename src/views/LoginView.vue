<script setup>

import { onMounted, reactive, ref } from 'vue'
import AccountColumn from '@/components/AccountColumn.vue'
import * as account from '@/apis/account.js'
import { MessagePlugin } from 'tdesign-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { useTokenManager } from '@/stores/token_manager.js'
import SwitchAccountColumn from '@/components/SwitchAccountColumn.vue'

const route = useRoute()
const router = useRouter()

const client_id = route.query.client_id
const redirect_uri = route.query.redirect_uri
const response_type = route.query.response_type
const state = route.query.state
const switch_account = route.query.switch_account || false

let app_info = reactive({
  app_id: client_id,  // default value
  name: '天外天',
  description: ''
})

const isOAuth = redirect_uri !== void 0 && response_type !== void 0 && client_id !== void 0

async function restoreInfo() {
  await account.restoreInfo()
    .then((info) => {
      account_info = info
    })
    .catch((error) => {
      console.log(error)
    })
}

const tokenManager = useTokenManager()
const controller = new AbortController()


function updateAppInfo() {

  account.getAppInfo(client_id, controller).then((info) => {
    app_info = info
  }).catch((error) => {
    console.log(error)
  })
}

onMounted(async () => {

  loading.value = true
      if (tokenManager.getToken() != null) {
    await restoreInfo()
    if (isOAuth) {
      updateAppInfo()
      if (!switch_account) {
        await tryAuthorize()
      } else {
        currentPhase.value = AuthPhase.SWITCH_ACCOUNT
      }
    } else {
      MessagePlugin.success('已经登录,前往个人中心')
      await router.push({
        name: 'home'
      })
    }
  }
  loading.value = false
})


const login_data = reactive({
  username: '',
  password: ''
})

const LOGIN_RULE = {
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' }
  ]
}
const login_form = ref(null)

const showPasswordInputBox = ref(false)

const AuthPhase = {
  USERNAME: 0,
  PASSWORD: 1,
  AUTHENTICATE: 2,
  SWITCH_ACCOUNT: 4,
  next: function(value) {
    const values = Object.values(this).filter(v => typeof v === 'number')
    const currentIndex = values.indexOf(value)
    const nextIndex = (currentIndex + 1) % values.length
    return values[nextIndex]
  },
  previous: function(value) {
    const values = Object.values(this).filter(v => typeof v === 'number')
    const currentIndex = values.indexOf(value)
    const nextIndex = (currentIndex - 1) % values.length
    return values[nextIndex]
  }
}

let currentPhase = ref(AuthPhase.USERNAME)

let account_info = reactive({})
let privileges = reactive([])

const redirectURL = (url) => {
  controller.abort('redirect')
  window.location.href = url
}

const tryAuthorize = async () => {
  await account.getAuthorizeCode(client_id, redirect_uri, state, response_type)
    .then((auth_result) => {
      console.log(auth_result)
      if (auth_result.action === 1) {
        redirectURL(auth_result.data)
      } else if (auth_result.action === 0) {
        privileges = auth_result.data
        currentPhase.value = AuthPhase.AUTHENTICATE
      } else if (auth_result.code === 0) {
        redirectURL(redirect_uri + `?token=${tokenManager.getToken()}`)
      } else {
        MessagePlugin.error('未定义的授权行为')
      }
    })
    .catch((error) => {
      console.log(error)
    })
  loading.value = false
}

const tryLogin = async ({ validateResult }) => {
  if (currentPhase.value === AuthPhase.USERNAME) {
    if (!validateResult) return
    nextStep()
    return
  }

  if (!validateResult) return
  loading.value = true

  await account.login(login_data.username, login_data.password)
    .then((info) => {
      account_info = info
      console.log(isOAuth)
      if (isOAuth)
        tryAuthorize()
      else {
        router.replace('/')

      }
    })
    .catch((error) => {
      console.log(error)
    })
  loading.value = false
}

const nextStep = () => {
  console.log(currentPhase.value)
  if (currentPhase.value === AuthPhase.USERNAME) {
    // validate username
    if (login_data.username === '') {
      console.log(login_form.value.setValidateMessage)
      login_form.value.setValidateMessage(
        {
          username: [{
            type: 'error',
            message: '用户名不能为空'
          }]
        }
      )
      return
    }

    showPasswordInputBox.value = true
  } else if (currentPhase.value === AuthPhase.PASSWORD) {
    login_form.value.validate()
    return
  }
  console.log('get')
  currentPhase.value = AuthPhase.next(currentPhase.value)
}

const previousStep = () => {
  currentPhase.value = AuthPhase.previous(currentPhase.value)
}


const authorizeScope = async () => {
  loading.value = true
  await account.authorizeNewApp(client_id).then(() => {
    console.log('get here')
    tryAuthorize()
  }).catch((error) => {
    console.log(error)
    loading.value = false
  })
}

const loading = ref(false)

const logout = () => {
  currentPhase.value = AuthPhase.USERNAME
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

          <div class="step" v-if="currentPhase===AuthPhase.USERNAME || currentPhase === AuthPhase.PASSWORD">
            <span class="action-name">登录</span>
            <t-form :rules="LOGIN_RULE" ref="login_form" :data="login_data" @validate="tryLogin">
              <t-form-item name="username" label-width="0px" :required-mark="false">
                <t-input v-model="login_data.username" placeholder="用户名" size="large" />
              </t-form-item>
              <transition name="fade">
                <t-form-item v-if="showPasswordInputBox" name="password" label-width="0px" :required-mark="false">
                  <t-input @enter="nextStep" v-model="login_data.password" type="password" placeholder="密码"
                           size="large" />
                </t-form-item>
              </transition>
            </t-form>
            <div class="spacer"></div>
            <div class="action-button">
              <t-button variant="text" theme="primary" size="large" @click="router.replace('/register')">
                还没有账号，去创建
              </t-button>
              <t-button variant="base" shape="round" theme="primary" size="large" :disabled="loading" @click="nextStep">
                下一步
              </t-button>
            </div>
          </div>


          <div class="step" v-else-if="currentPhase=== AuthPhase.AUTHENTICATE">
            <div class="action-content">
              <span class="action-name">使用天外天账号登录{{ app_info.name }}</span>
              <AccountColumn avatar="https://picsum.photos/200/300" :username="account_info.nickname"
                             :sid="account_info.userNumber" />
              <div class="privileges">
                <span>我们需要您的授权才能继续, 点击同意代表对方能够：</span>
                <ul style="margin:10px;padding-left:20px;">
                  <li v-for="item in privileges" :key="item.id">{{ item.description }}</li>
                </ul>
                <span>您可以随时在天外天个人中心取消授权。</span>
              </div>
            </div>
            <div class="action-button">
              <t-button variant="text" shape="round" theme="primary" size="large"
                        @click="previousStep">返回
              </t-button>
              <t-button variant="base" shape="round" theme="primary" size="large" :disabled="loading"
                        @click="authorizeScope">确认授权
              </t-button>
            </div>
          </div>
          <div class="step" v-else-if="currentPhase=== AuthPhase.SWITCH_ACCOUNT">
            <div class="action-content">
              <span class="action-name">请选择账号在{{ platform }}上继续</span>
              <div class="account-groups">
                <t-divider class="thin" />
                <AccountColumn @click="tryAuthorize" avatar="https://picsum.photos/200/300"
                               :username="account_info.nickname"
                               :sid="account_info.userNumber" />
                <t-divider class="thin" />
                <SwitchAccountColumn @click="logout" />
                <t-divider class="thin" />
              </div>
            </div>
            <div class="action-button">
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