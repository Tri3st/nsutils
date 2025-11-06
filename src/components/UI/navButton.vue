<script setup lang="ts">
import {computed} from "vue";

type NavButtonType = 'normal' | 'login' | 'logout' | 'circle';

interface Props {
  type?: NavButtonType;
  url: string;
  text: string;
}

const props = defineProps<Props>();

const typeClass = computed(() => {
  switch(props.type) {
    case 'login':
      return '!bg-green-600 hover:!bg-green-700';
    case 'logout':
      return '!bg-red-600 hover:!bg-red-700';
    case 'circle':
      return '!bg-blue-300 hover:!bg-blue-400';
    default:
      return '';
  }
});

</script>

<template>
  <router-link
      :to="url"
      custom
      v-slot="{ navigate, href, isActive }"
  >
    <a-button
      type="primary"
      size="large"
      shape="circle"
      @click="navigate"
      :class="[{ 'nav-button--active': isActive }, typeClass ]"
      v-if="props.type === 'circle'"
  >{{ text }}</a-button>
    <a-button
      :href="href"
      type="primary"
      size="large"
      @click="navigate"
      :class="[{ 'nav-button--active': isActive }, typeClass ]"
      v-else
    >{{ text }}</a-button>
  </router-link
  >
</template>

<style scoped>
.nav-button--login {
  /* optionally add extra styles for login buttons */

}

.nav-button--logout {
  /* optionally add extra styles for logout buttons */
}

.nav-button--active {
  /* optionally add extra styles for active buttons */
}
</style>
