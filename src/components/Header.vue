<script setup lang="ts">
import {useRouter} from "vue-router";
import {useAuthStore} from "@/stores/auth";
import DropDownComponent from "@/components/UI/DropDownComponent.vue";
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
  <nav class="bg-yellow-400 flex items-center justify-between px-6 py-2 shadow-md">
    <!-- Left: NS Logo -->
    <img src="/nslogo.svg" alt="NS Logo" class="h-8 w-auto" />

    <!-- Center: Navigation Buttons -->
    <div class="flex space-x-4 text-sm">
      <NavButton url="/" text="Home" type="normal"/>
      <NavButton url="/upload-xml" text="Upload XML Files" type="normal"/>
      <NavButton url="/view-uploads" text="View Uploads" type="normal"/>
      <NavButton url="/convert-raw" text="Convert RAW to Image" type="normal"/>

      <!-- Right: Auth Section -->
      <div class="flex items-center space-x-3">
        <!-- Show when logged in -->
        <template v-if="isAuthenticated">
          <!-- Username + Crown if ADMIN -->
          <div class="flex items-center space-x-1 font-semibold">
            <!-- Avatar circle -->
            <a-tooltip>
              <NavButton url="/" :text="user!.username.charAt(0).toUpperCase()" type="circle"/>
            </a-tooltip>
          <img src="/crown.svg" alt="Admin" class="w-5 h-5" v-if="isAdmin" />
          </div>
          <NavButton url="/logout" text="Logout" type="logout"/>
        </template>

        <!-- Show when logged out -->
        <template v-else>
          <NavButton url="/login" text="Login" type="login"/>
        </template>

        <!-- Banner Image -->
        <img src="/new_banner_small.jpg" alt="Banner" class="h-12 w-auto" />
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
