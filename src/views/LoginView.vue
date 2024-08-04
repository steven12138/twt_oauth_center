<script setup>

import { reactive, ref } from 'vue'
import AccountColumn from '@/components/AccountColumn.vue'
import * as account from '@/apis/account.js'
import { MessagePlugin } from 'tdesign-vue-next'


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

  getName: (value) => {
    return Object.keys(this).find(key => this[key] === value)
  },
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

const checkScope = () => {
  account.scope()
    .then((info) => {
      privileges = info
      currentPhase.value = AuthPhase.AUTHENTICATE
    })
    .catch((error) => {
      console.log(error)
    })
}

const tryLogin = ({ validateResult }) => {
  if (!validateResult) return

  account.login(login_data.username, login_data.password)
    .then((info) => {
      account_info = info
      checkScope()
    })
    .catch((error) => {
      console.log(error)
    })
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


const platform = ref('Lorem Ipsum')


const authenticate=()=>{

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
              <t-form-item name="password" label-width="0px" :required-mark="false">
                <transition name="fade">
                  <t-input v-if="showPasswordInputBox" v-model="login_data.password" type="password" placeholder="密码"
                           size="large" />
                </transition>
              </t-form-item>
            </t-form>
            <div class="spacer"></div>
            <div class="action-button">
              <t-button variant="text" theme="primary" size="large">创建账号</t-button>
              <t-button variant="base" shape="round" theme="primary" size="large" @click="nextStep">下一步
              </t-button>
            </div>
          </div>
          <div class="step" v-else-if="currentPhase=== AuthPhase.AUTHENTICATE">
            <div class="action-content">
              <span class="action-name">使用天外天账号登录{{ platform }}</span>
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
              <t-button variant="base" shape="round" theme="primary" size="large" @click="authenticate">确认授权
              </t-button>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>


.action-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.step {
  flex: 1;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
  gap: 30px;
  transition: all .25s ease-in-out;
}

.action-button {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-content: center;
  gap: 20px;
}

.spacer {
  flex: 1;
}

.action-name {
  font-size: 26px;
  font-weight: 500;
  font-family: "Microsoft YaHei UI", serif;
  color: #4c4c4c;
  user-select: none;
}

.welcome {
  font-size: 16px;
  font-weight: 400;
  color: #4c4c4c;
  text-wrap: nowrap;
  transition: opacity .25s ease-in-out;
  font-family: "Microsoft YaHei UI", serif;
}


.logo {
  background-image: url("@/assets/logo.png");
  background-size: cover;
  background-position: center;
  min-height: 60px;
  min-width: 60px;
}

.logo-group {
  flex: 1;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  gap: 30px;
}

.title {
  user-select: none;
  margin-left: -10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
}

.action-area {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 40px 60px;
  width: 35vw;
  transition: all .25s ease-in-out;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F0F4F9;
}

.login-card {
  transition: all .25s ease-in-out;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  border-radius: 10px;
  max-width: 60vw;
  padding: 0;
  background-color: #ffffff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
}


@media screen and (max-width: 600px) {
  .welcome {
    opacity: 0;
  }

  .action-area {
    padding: 25px;
  }
}


@media screen and (max-width: 1024px) {

  .action-area {
    width: 60vw;
  }

  .login-card {
    max-width: 80vw;
  }
}

@media screen and (max-width: 530px) {

  .login-card {
    max-width: none;
    height: 100vh;
  }

  .action-area {
    height: unset;
    min-height: 40vh;
    width: 100vw;
  }

  .step {
    min-height: 40vh;
    flex: none;
  }
}

.decorated-img {
  background-image: url('@/assets/decorated.png');
  background-size: cover;
  background-position: center;
  height: 100%;
  min-height: 500px;
  width: 30vw;
  max-width: 40%;
  transition: all .25s ease-in-out;
}

@media screen and ( max-width: 1330px) {
  .decorated-img {
    width: 0;
  }
}

</style>