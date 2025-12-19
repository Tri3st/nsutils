<script setup lang="ts">
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import NavButton from "@/components/UI/NavButton.vue";

const router = useRouter();
const authStore = useAuthStore();
</script>

<template>
  <a-layout-header class="bg-neutral-950/80 border-b border-neutral-800 backdrop-blur sticky top-0 z-50 h-16">

    <!-- LEFT: Logo -->
    <div
        class="text-lg font-semibold tracking-wide cursor-pointer text-indigo-400 hover:text-indigo-300 transition"
        @click="router.push('/')"
    >
        Martin.dev
    </div>

    <!-- CENTER -->
    <div class="flex items-center gap-3">
      <!-- Public nav -->
      <NavButton url="/" text="Home" type="normal"/>
      <NavButton url="/aboutme" text="About Me" type="normal"/>
      <!-- If authenticated -->
      <template v-if="authStore.user">
         <NavButton url="/myhealth" text="My Health" type="normal" />
      </template>
     
      <NavButton url="/links" text="Links" type="normal"/>

      <!-- If authenticated -->
      <template v-if="authStore.user">
        <!-- Replace DropDownComponent with simple NavButton -->
        <NavButton url="/nsutilities" text="NSUtilities" type="normal" />
      </template>

      <!-- RIGHT | User info -->
      <div class="flex items-center gap-3">
        <!-- Crown if admin -->
        <span class="text-yellow-400 text-lg leading-none" v-if="authStore.isAdmin">👑</span>

      <!-- User AVATAR if authenticated -->
      <NavButton
          url=""
          :text="authStore.user.username.charAt(0).toUpperCase()"
          type="circle"
          v-if="authStore.user"/>

      <!-- Logout -->
      <NavButton
          v-if="authStore.user"
          url="/logout"
          text="Logout"
          type="logout"/>

      <!-- If NOT authenticated -->
      <NavButton
          v-else
          url="/login"
          text="Login"
          type="login"/>
      </div>
    </div>
  </a-layout-header>
</template>