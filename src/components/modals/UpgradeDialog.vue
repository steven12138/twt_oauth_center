<script setup>
import { ref } from 'vue'
import { useUserInfoStore } from '@/stores/userInfo.js'
import { MessagePlugin } from 'tdesign-vue-next'

const userInfoStore = useUserInfoStore()

defineProps({
  visible: Boolean,
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'confirm'])

const selectedOption = ref(null)

const handleClose = () => {
  emit('update:visible', false)
}

const handleConfirm = () => {
  if (selectedOption.value) {
    console.log(selectedOption.value)
    emit('update:visible', false)
  }
}

const confirmUpgrade = async () => {
  console.log(selectedOption.value)
  // await upgrade({ typeId: selectedUpgradeOption.value });
  MessagePlugin.success('更新成功')
  useUserInfoStore().fetchUserInfo()
  handleConfirm()
}
</script>

<template>
  <t-dialog :visible="visible" header="更新身份" @close="handleClose">
    <div>
      <p>
        当前账号身份: <strong>{{ userInfoStore.userInfo.stuType }}</strong>
      </p>

      <p>请选择新的身份:</p>
      <t-select v-model="selectedOption" placeholder="请选择身份">
        <t-option
          v-for="option in options"
          :key="option.typeId"
          :value="option.typeId"
          :label="option.label"
        >
          {{ option.label }}
        </t-option>
      </t-select>
    </div>
    <template #footer>
      <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px">
        <t-button theme="default" @click="handleClose">取消</t-button>
        <t-button theme="primary" @click="confirmUpgrade" :disabled="!selectedOption">
          确认
        </t-button>
      </div>
    </template>
  </t-dialog>
</template>
