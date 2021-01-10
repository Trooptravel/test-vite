<template>
  <transition
    enter-active-class="transition-all duration-200"
    enter-from-class="opacity-0 scale-100"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition-all duration-100"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-100"
    appear
  >
    <div
      v-if="open"
      class="calendar"
      @mouseenter="mouseOver = true"
      @mouseleave="mouseOver = false"
    >
      <div id="getPeriod" class="display-none">{{ getPeriod }}</div>
      <div
        class="w-full h-full absolute flex items-end justify-end pointer-events-none"
      >
        <div
          @click="close"
          class="bg-blue-500 h-8 px-3 m-3 rounded-full flex items-center text-white cursor-pointer pointer-events-auto btn-close"
        >
          Done
        </div>
      </div>
      <div class="controls">
        <div class="btn-container" style="justify-content: flex-end">
          <img
            class="btn-slide"
            :src="getBack ? arrowla : arrowld"
            @click="previous"
          />
        </div>
        <div class="btn-container" style="justify-content: flex-start">
          <img class="btn-slide" :src="arrowra" @click="next" />
        </div>
      </div>

      <transition-group>
        <div v-for="slide in slides" class="slide" :key="slide.id">
          <picker-wrapper
            v-if="slide.show"
            v-on:selected="pick"
            :ref="`picker${slide.id}`"
            :highlighted="highlighted"
            :open-date="setOpendate(slide.date)"
            :inline="open"
            :fullMonthName="true"
            :id="`${slide.id}`"
            :disabledDates="getYesterday"
            @hover-date="hoverDate"
          ></picker-wrapper>
        </div>
      </transition-group>
    </div>
  </transition>
</template>

<script>
import PickerWrapper from "./siblings/PickerWrapper.vue";

export default {
  emits: {
    "update:start": String,
    "update:end": String,
    "update:period": String,
    "update:leave": String,
    "update:open": Boolean,
  },
  components: {
    PickerWrapper,
  },
  props: {
    open: { type: Boolean, default: false },
    focus: { type: Number, default: 0 },
    inputFocus: { type: Boolean, default: false },

    // language: {
    //   type: Object,
    //   default: () => en,
    // },
    pickerType: {
      type: null,
    },
    typeable: {
      type: Boolean,
      default: true,
    },
    useUtc: Boolean,
    // inline: {
    //   type: Boolean,
    //   default: true,
    // },
    double: {
      type: Boolean,
      default: true,
    },
    weekAbbr: Boolean,
    // format: {
    //   type: [String, Function],
    //   default: "dd MMM yyyy",
    // },
  },
  watch: {
    focus: function (newVal) {
      this.dates.focus = newVal;
    },
    mouseOver: function (newVal) {
      this.$emit("update:leave", !newVal);
    },
    getPeriod: function (newVal) {
      this.$emit("update:period", {
        start_date: this.formattedDate(this.dates.depart),
        end_date: this.formattedDate(this.dates.arrive),
        start_local: this.formattedDate(this.dates.depart),
        end_local: this.formattedDate(this.dates.arrive),
        start_time: "00:00",
        end_time: "00:00",
      });
      this.$emit("update:start", this.formattedDate(this.dates.depart));
      this.$emit("update:end", this.formattedDate(this.dates.arrive));
    },
  },
  data() {
    return {
      format: "d MMMM yyyy",
      disabledDates: {},
      openDate: null,
      disabledFn: {
        customPredictor(date) {
          if (date.getDate() % 3 === 0) {
            return true;
          }
        },
      },
      highlightedFn: {
        customPredictor(date) {
          if (date.getDate() % 4 === 0) {
            return true;
          }
        },
      },
      highlighted: {},

      current: 3,

      slides: [
        {
          id: 0,
          date: 0,
          show: false,
        },
        {
          id: 1,
          date: 1,
          show: true,
        },
        {
          id: 2,
          date: 2,
          show: true,
        },
        {
          id: 3,
          date: 3,
          show: false,
        },
      ],

      hoverDay: null,
      mouseOver: false,

      arrowra: () => import("./assets/calendar_arrow_right_active.svg"),
      arrowrd: () => import("./assets/calendar_arrow_right_inactive.svg"),
      arrowla: () => import("./assets/calendar_arrow_left_active.svg"),
      arrowld: () => import("./assets/calendar_arrow_left_inactive.svg"),

      dates: {
        depart: null,
        arrive: null,
        focus: 1,
      },

      oneDay: 24 * 60 * 60 * 1000,

      inline: true,

      // inputFocus: false,
    };
  },
  computed: {
    getPeriod() {
      let period = 0;

      if (this.dates.depart && this.dates.arrive) {
        period =
          Math.round(
            Math.abs((this.dates.depart - this.dates.arrive) / this.oneDay)
          ) + 1;
        this.highlightFrom(this.dates.depart);
        this.highlightTo(this.dates.arrive);
      }
      if (
        period === 1 &&
        this.dates.depart <= this.hoverDay &&
        this.mouseOver
      ) {
        this.highlightFrom(this.dates.depart);
        this.highlightTo(this.hoverDay);
      }

      return period;
    },

    getBack() {
      let back;
      if (this.slides[1].date <= 1) {
        back = false;
      } else {
        back = true;
      }
      return back;
    },

    getYesterday() {
      let dObj = new Date();
      dObj = new Date(dObj.setDate(dObj.getDate() - 1));
      const yesterday = {
        to: dObj,
      };

      return yesterday;
    },

    // showCalendar() {
    //   let show = false;
    //   if (this.inline) {
    //     // if (this.inputFocus || this.mouseOver) show = true;
    //     if (this.open || this.mouseOver) show = true;
    //   }
    //   return show;
    // },
  },

  methods: {
    // setFocus(val) {
    //   this.dates.focus = val;
    // },

    // onFocus() {
    //   this.inputFocus = true;
    // },

    // onBlur() {
    //   this.inputFocus = false;
    // },

    dateFormat(date, fstr, utc) {
      utc = utc ? "getUTC" : "get";
      return fstr.replace(/%[YmdHMS]/g, function (m) {
        switch (m) {
          case "%Y":
            return date[utc + "FullYear"](); // no leading zeros required
          case "%m":
            m = 1 + date[utc + "Month"]();
            break;
          case "%d":
            m = date[utc + "Date"]();
            break;
          case "%H":
            m = date[utc + "Hours"]();
            break;
          case "%M":
            m = date[utc + "Minutes"]();
            break;
          case "%S":
            m = date[utc + "Seconds"]();
            break;
          default:
            return m.slice(1); // unknown code, remove %
        }
        // add leading zero if required
        return ("0" + m).slice(-2);
      });
    },

    formattedDate(val) {
      if (val != null) {
        val = this.dateFormat(val, "%d-%m-%Y", this.useUtc);
      }
      return val;
    },

    pick(val) {
      if (this.dates.depart === null && this.dates.arrive === null) {
        this.dates.depart = val;
        this.dates.arrive = val;
        if (this.dates.focus === 1) {
          this.dates.focus = 2;
          // this.$refs.inputArrival.focus();
        } else {
          this.dates.focus = 1;
          // this.$refs.inputDeparture.focus();
        }
      } else if (this.dates.depart !== null && this.dates.arrive !== null) {
        if (this.dates.focus === 1) {
          if (val > this.dates.arrive) {
            this.dates.depart = val;
            this.dates.arrive = val;
            this.dates.focus = 2;
            // this.$refs.inputArrival.focus();
          } else if (val < this.dates.depart) {
            this.dates.depart = val;
            this.dates.focus = 2;
            // this.$refs.inputArrival.focus();
          } else if (val < this.dates.arrive && val > this.dates.depart) {
            this.dates.depart = val;
            this.dates.focus = 2;
            // this.$refs.inputArrival.focus();
          }
        } else if (this.dates.focus === 2) {
          if (val < this.dates.depart) {
            this.dates.depart = val;
            this.dates.arrive = val;
            this.dates.focus = 2;
            // this.$refs.inputArrival.focus();
          } else if (val > this.dates.depart) {
            this.dates.arrive = val;
            this.dates.focus = 1;
            // this.$refs.inputDeparture.focus();
          } else if (val < this.dates.arrive && val > this.dates.depart) {
            this.dates.arrive = val;
            this.dates.focus = 1;
            // this.$refs.inputDeparture.focus();
          }
        }
      }
    },

    setOpendate(val) {
      let calDate = new Date();
      calDate = new Date(calDate.setMonth(calDate.getMonth() + val - 1));
      return calDate;
    },

    next() {
      this.slides[3].show = true;
      const first = this.slides.shift();
      first.date = this.slides[2].date + 1;
      this.slides = this.slides.concat(first);
      this.slides[3].show = false;
    },

    previous() {
      if (this.getBack) {
        this.slides[0].show = true;
        const last = this.slides.pop();
        last.date = this.slides[0].date - 1;
        this.slides = [last].concat(this.slides);
        this.slides[0].show = false;
      } else {
        this.back = false;
      }
    },

    hoverDate(date) {
      this.hoverDay = this.useUtc
        ? new Date(Date.UTC(date.timestamp))
        : new Date(date.timestamp);
    },

    highlightTo(val) {
      if (typeof this.highlighted.to === "undefined") {
        this.highlighted = {
          to: null,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: this.highlighted.from,
        };
      }
      this.highlighted.to = val;
    },
    highlightFrom(val) {
      if (typeof this.highlighted.from === "undefined") {
        this.highlighted = {
          to: this.highlighted.to,
          daysOfMonth: this.highlighted.daysOfMonth,
          from: null,
        };
      }
      this.highlighted.from = val;
    },

    setHighlightedDays(elem) {
      if (elem.target.value === "undefined") {
        return;
      }
      const highlightedDays = elem.target.value
        .split(",")
        .map((day) => parseInt(day));
      this.highlighted = {
        from: this.highlighted.from,
        to: this.highlighted.to,
        daysOfMonth: highlightedDays,
      };
    },
    setDisabledDays(elem) {
      if (elem.target.value === "undefined") {
        return;
      }
      const disabledDays = elem.target.value
        .split(",")
        .map((day) => parseInt(day));
      this.disabledDates = {
        from: this.disabledDates.from,
        to: this.disabledDates.to,
        daysOfMonth: disabledDays,
      };
    },
    disableTo(val) {
      if (typeof this.disabledDates.to === "undefined") {
        this.disabledDates = {
          to: null,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: this.disabledDates.from,
        };
      }
      this.disabledDates.to = val;
    },
    disableFrom(val) {
      if (typeof this.disabledDates.from === "undefined") {
        this.disabledDates = {
          to: this.disabledDates.to,
          daysOfMonth: this.disabledDates.daysOfMonth,
          from: null,
        };
      }
      this.disabledDates.from = val;
    },
    close() {
      this.$emit("update:open", false);
    },
  },
};
</script>

<style scoped>
/* @import url("https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"); */

.container-view {
  margin: 10px 100px;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  display: flex;
  align-items: stretch;
  justify-content: center;
  position: relative;
  width: fit-content;
}

.controls {
  z-index: 99;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-row: span;
  top: 20px;
  left: 0px;
  right: 0px;
}

.btn-container {
  background-color: white;
  width: 50px;
  height: 30px;
  display: flex;
  align-items: center;
  cursor: default;
}

.btn-slide {
  cursor: pointer;
  pointer-events: all;
}

.btn-slide:focus {
  outline: 0;
}

.btn-close {
  /* z-index: 10000; */
}

/* .carousel {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  width: 660px;
  height: 294px;
  border-radius: 25px;
} */

.slide {
  flex: 0 0 330px;
  display: flex;
  justify-content: center;
  /* align-items: center; */
  transition: transform 0.3s ease-in-out;
}

/* .carousel-container {
  background-color: white;
  max-width: 660px;
  height: 294px;
  flex: 1;
  position: relative;
  border-radius: 25px;
} */

.calendar {
  width: 660px;
  height: 364px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  position: absolute;
  overflow: hidden;
  background-color: white;
  border-radius: 25px;
  margin-left: -7px;
  margin-top: 10px;
  z-index: 10;
  box-shadow: 0px 0px 10px 6px rgb(235, 235, 235);
}

.display-none {
  display: none;
}

/* .date-input-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 660px;
  row-gap: 9px;
  margin: 0 auto;
  justify-items: center;
  margin-left: 100px;
  margin-top: 30px;
} */

/* .date-input {
  width: 140px;
  height: 30px;
  border: none;
  border-radius: 15px;
} */

/* .date-input:focus {
  box-shadow: 0px 0px 10px 6px rgb(235, 235, 235);
  outline: none; */
/* border-radius: 10px solid transparent; */
/* } */
</style>
