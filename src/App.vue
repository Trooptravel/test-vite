<template>
  <div id="ttWindow" class="absolute top-0 bottom-0 left-0 right-0 z-10">
    <!-- MAP-CONTAINER -->
    <gmap-map
      class="fixed h-full w-full"
      ref="gmapmap"
      :options="mapOptions"
      :center="optData.mapCenter"
    >
      <GmapHtmlMarker :lat="30.2316673" :lng="-97.6168439">
        <template #default>
          <div
            class="h-px30 w-px30 rounded-full border-mainHeader border-2 bg-teslaRed flex items-center justify-center text-white tt-text-hotel-names"
          >
            GF
          </div>
        </template>
      </GmapHtmlMarker>
      <GmapMarker ref="myMarker" :position="{ lat: 10, lng: 10 }" />
    </gmap-map>

    <!-- ROUTER-VIEW -->
    <router-view v-slot="{ Component }">
      <transition
        enter-active-class="transition-all duration-200 delay-100"
        enter-from-class="opacity-0 scale-100"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition-all duration-100"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-100"
        appear
      >
        <component :is="Component" class="z-40" />
      </transition>
    </router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import ttMapOptions from "./map.config";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const optData = reactive({
      mapCenter: { lat: 0, lng: 0 },
    });
    const mapOptions = ttMapOptions;
    return { mapOptions, optData };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
