<template>
  <div
    @click="goDefine()"
    class="absolute z-10 top-10 left-10 h-96 w-10/12 bg-blue-400"
  >
    <!-- THE PICKER -->
    <!-- <Datepicker
      @update:period="onSave('period', $event)"
      v-model:period="period"
      @update:open="closeCalendar"
      :open="open"
      :focus="focus"
      v-model:leave="leave"
    /> -->
  </div>
</template>

<script lang="ts">
import { ref, reactive, computed, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import Datepicker from "../components/datepicker/Datepicker.vue";
import router from "../router";

export default {
  name: "Results",
  components: { Datepicker },
  setup() {
    function goDefine() {
      router.push("/");
    }
    /*--------------------------------------------------------------
    ################################################################
    >>> CALENDAR SETTINGS
    ################################################################
    ---------------------------------------------------------------*/
    const open = ref(false);
    const focus = ref(0);
    const leave = ref(true);
    const period = ref("");

    const openCalendar = (val: number) => {
      focus.value = val + 1;
      open.value = true;
    };

    const closeCalendar = () => {
      open.value = false;
    };

    return {
      goDefine,
      // CALENDAR
      closeCalendar,
      openCalendar,
      open,
      leave,
      focus,
      period,
    };
  },
};
</script>
