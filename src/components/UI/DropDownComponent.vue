<script setup lang="ts">
import NavButton from "@/components/UI/NavButton.vue";
import { DropDownProps } from "@/types/buttons.ts";
import { defineProps } from "vue";

const props = defineProps<DropDownProps>();
</script>

<template>
  <a-dropdown placement="bottomRight">

    <button class="text-white px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-all">
      {{ props.label }} ▾
    </button>

    <template #overlay>
      <a-menu
        class="min-w-[180px] py-2  bg-none"
      >
        <a-menu-item
            v-for="(item, index) in props.items"
            :key="index"
            class="!h-auto !p-0"
        >
          <div class="px-3 py-2 bg-black rounded hover:bg-gray-800">
            <NavButton
                :url="item.url"
                :text="item.text"
                :type="item.type || 'normal'"
            />
          </div>

        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>
