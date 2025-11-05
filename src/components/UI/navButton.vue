<script setup lang="ts">
import { computed } from "vue";

type NavButtonType = 'normal' | 'login' | 'logout';

interface Props {
  type?: NavButtonType;
  url: string;
  text: string;
}

const props = defineProps<Props>();

const typeClass = computed(() => {
  switch(props.type) {
    case 'login':
      return 'nav-button--login';
    case 'logout':
      return 'nav-button--logout';
    default:
      return '';
  }
});

const buttonType = computed(() => {
  if (props.type === 'login') return 'succes';
  if (props.type === 'logout') return 'danger';
  return 'primary'
});



</script>

<template>
  <router-link
      :to="url"
      custom
      v-slot="{ navigate, href, isActive }"
  >
    <a-button
      :href="href"
      :type="buttonType"
      @click="navigate"
      :class="[{ 'nav-button--active': isActive }, typeClass ]"
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