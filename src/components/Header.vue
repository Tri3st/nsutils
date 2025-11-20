<script setup lang="ts">
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import NavButton from "@/components/UI/NavButton.vue";

const router = useRouter();
const authStore = useAuthStore();

const dropDownItems = [
  {
    text: 'UploadXML',
    url: '/upload-xml'
  },
  {
    text: 'View Uploads',
    url: '/view-uploads'
  },
  {
    text: 'Convert RAW',
    url: '/convert-raw'
  },
]
</script>

<template>
  <a-layout-header class="flex items-center bg-black/40 px-6 backdrop-blur sticky top-0">

    <!-- LEFT: Logo -->
    <div class="flex-1 flex items-center bg-black/40 px-6 backdrop-blur sticky top-0">
      <div
          class="text-xl font-bold text-purple-700 cursor-pointer mr-4"
          @click="router.push('/')"
      >
        Martin's Home
      </div>
    </div>

    <!-- CENTER -->
    <div class="flex-1 flex justify-center items-center space-x-6">

      <!-- Public nav -->
      <NavButton url="/" text="Home" type="normal"/>
      <NavButton url="/aboutme" text="About Me" type="normal"/>
      <!-- If authenticated -->
      <template>
         <NavButton url="/myhealth" text="My Health" type="normal" v-if="authStore.user"/>
      </template>
     
      <NavButton url="/links" text="Links" type="normal"/>

      <!-- If authenticated -->
      <template v-if="authStore.user">
        <!-- Replace DropDownComponent with simple NavButton -->
        <NavButton url="/nsutilities" text="NSUtilities" type="normal" />
      </template>

      <!-- RIGHT | User info -->
      <div class="flex-1 flex items-center justify-end space-x-4">
        <!-- Crown if admin -->
        <div
            v-if="authStore.isAdmin"
            class="w-8 h-8 bg-yellow-300 mr-2"
            style="mask: url('/crown.svg') no-repeat center; mask-size: contain;"></div>

      </div>

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
  </a-layout-header>
</template>