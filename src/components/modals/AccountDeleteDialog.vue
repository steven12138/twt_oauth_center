<script setup lang="jsx">
  import { ref } from 'vue';
  
  const props = defineProps({
    visible: Boolean,
  });
  
  const emit = defineEmits(['update:visible', 'confirm']);
  
  const confirmationString = "我确认进行账号注销";
  const inputValue = ref('');
  
  const onCancel = () => {
    emit('update:visible', false);
    inputValue.value = ''
  };
  
  const onConfirm = () => {
    emit('confirm');
    emit('update:visible', false);
  };
  </script>
  

<template>
  <t-dialog :visible="visible" header="确认注销账号" :footer="null" @close="onCancel">
    <div>
      <p style="color: red">警告: 注销账号后数据将清空且无法找回</p>
      <p>请输入以下文字以确认您需要注销账号：</p>
      <p>
        <strong>{{ confirmationString }}</strong>
      </p>
      <t-input v-model="inputValue" placeholder="请输入确认字符串" />
    </div>

    <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px">
      <t-button theme="default" @click="onCancel">取消</t-button>
      <t-button theme="danger" @click="onConfirm" :disabled="inputValue !== confirmationString">确认</t-button>
    </div>
  </t-dialog>
</template>
  
  