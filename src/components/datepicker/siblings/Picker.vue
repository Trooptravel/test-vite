<template>
  <!-- v-show="showDayView"
    :style="calendarStyle"
    @mousedown.prevent -->
  <div class="picker">
    <header>
      <!-- <span class="header-month" @click="showMonthCalendar"
        >{{ isYmd ? currYearName : currMonthName }}
        {{ isYmd ? currMonthName : currYearName }}</span> -->
      <span class="header-month">{{ currMonthName }} {{ currYearName }}</span>
    </header>

    <div id="week-day">
      <div class="week-day-cell" v-for="d in daysOfWeek" :key="d.timestamp">
        {{ weekAbbr ? d[0] : d }}
      </div>
    </div>

    <div id="content">
      <div class="day" :class="dayClasses(day)" v-for="(day, index) in days" :key="index">
        <div class="day-cell" :class="dayClasses(day)" @click="selectDate(day)" v-html="dayCellContent(day)" @mouseover="hoverDate(day)"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import { makeDateUtils } from "../utils/DateUtils";

//
import { makeDateUtils } from "../utils/DateUtils";
//
export default {
  emits: { "hover-disabled": Object, "hover-date": Object, "selected-disabled": Object, "select-date": Object },
  props: {
    showDayView: Boolean,
    selectedDate: Date,
    //
    weekAbbr: {
      type: Boolean,
      default: true,
    },
    //
    pageDate: Date,
    pageTimestamp: Number,
    // fullMonthName: Boolean,
    fullMonthName: {
      type: Boolean,
      default: true,
    },
    allowedToShowView: Function,
    dayCellContent: {
      type: Function,
      default: (day) => day.date,
    },
    disabledDates: Object,
    highlighted: Object,
    calendarClass: [String, Object, Array],
    calendarStyle: Object,
    translation: Object,
    isRtl: Boolean,
    mondayFirst: Boolean,
    useUtc: Boolean,
  },
  data() {
    const constructedDateUtils = makeDateUtils(this.useUtc);
    return {
      utils: constructedDateUtils,
    };
  },
  computed: {
    /**
     * Returns an array of day names
     * @return {String[]}
     */
    daysOfWeek() {
      if (this.mondayFirst) {
        const tempDays = this.translation.days.slice();
        tempDays.push(tempDays.shift());
        return tempDays;
      }
      return this.translation.days;
    },
    /**
     * Returns the day number of the week less one for the first of the current month
     * Used to show amount of empty cells before the first in the day calendar layout
     * @return {Number}
     */

    /**
     * @return {Object[]}
     */
    days() {
      const d = this.pageDate;

      // set up a new date object to the beginning of the current 'page'
      const dObj = this.useUtc ? new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)) : new Date(d.getFullYear(), d.getMonth(), 1, d.getHours(), d.getMinutes());
      const daysInMonth = this.utils.daysInMonth(this.utils.getFullYear(dObj), this.utils.getMonth(dObj));

      const daysBlank = this.utils.getDay(dObj);

      const days = [];
      let i;

      for (i = 0; i < daysBlank; i++) {
        days.push({
          date: "",
          isDisabled: true,
        });
      }

      for (i; i < daysInMonth + daysBlank; i++) {
        days.push({
          date: this.utils.getDate(dObj),
          timestamp: dObj.getTime(),
          isSelected: this.isSelectedDate(dObj),
          isDisabled: this.isDisabledDate(dObj),
          isHighlighted: this.isHighlightedDate(dObj),
          isHighlightStart: this.isHighlightStart(dObj),
          isHighlightEnd: this.isHighlightEnd(dObj),
          isToday: this.utils.compareDates(dObj, new Date()),
          isWeekend: this.utils.getDay(dObj) === 0 || this.utils.getDay(dObj) === 6,
          isSaturday: this.utils.getDay(dObj) === 6,
          isSunday: this.utils.getDay(dObj) === 0,
        });
        this.utils.setDate(dObj, this.utils.getDate(dObj) + 1);
      }

      for (i; i < 42; i++) {
        days.push({
          date: "",
          isDisabled: true,
        });
      }

      return days;
    },

    /**
     * Gets the name of the month the current page is on
     * @return {String}
     */
    currMonthName() {
      const monthName = this.fullMonthName ? this.translation.months : this.translation.monthsAbbr;
      return this.utils.getMonthNameAbbr(this.utils.getMonth(this.pageDate), monthName);
    },
    /**
     * Gets the name of the year that current page is on
     * @return {Number}
     */
    currYearName() {
      const yearSuffix = this.translation.yearSuffix;
      return `${this.utils.getFullYear(this.pageDate)}${yearSuffix}`;
    },
    /**
     * Is this translation using year/month/day format?
     * @return {Boolean}
     */
    isYmd() {
      return this.translation.ymd && this.translation.ymd === true;
    },
  },
  methods: {
    hoverDate(date) {
      if (date.isDisabled) {
        this.$emit("hover-disabled", date);
        return false;
      } else {
        this.$emit("hover-date", date);
      }
    },
    selectDate(date) {
      if (date.isDisabled) {
        this.$emit("selected-disabled", date);
        return false;
      }
      this.$emit("select-date", date);
    },
    /**
     * @return {Number}
     */
    getPageMonth() {
      return this.utils.getMonth(this.pageDate);
    },
    /**
     * Emit an event to show the month picker
     */
    // showMonthCalendar() {
    //     this.$emit('showMonthCalendar')
    // },
    /**
     * Change the page month
     * @param {Number} incrementBy
     */
    // changeMonth(incrementBy) {
    //     let date = this.pageDate
    //     this.utils.setMonth(date, this.utils.getMonth(date) + incrementBy)
    //     this.$emit('changed-month', date)
    // },
    /**

        /**
         * Whether a day is selected
         * @param {Date}
         * @return {Boolean}
         */
    isSelectedDate(dObj) {
      return this.selectedDate && this.utils.compareDates(this.selectedDate, dObj);
    },
    //
    /**
     * Whether a day is disabled
     * @param {Date}
     * @return {Boolean}
     */
    isDisabledDate(date) {
      let disabledDates = false;

      if (typeof this.disabledDates === "undefined") {
        return false;
      }

      if (typeof this.disabledDates.dates !== "undefined") {
        this.disabledDates.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            disabledDates = true;
            return true;
          }
        });
      }
      //
      const currDate = new Date(date.toDateString());

      if (typeof this.disabledDates.to !== "undefined" && this.disabledDates.to && currDate <= this.disabledDates.to) {
        disabledDates = true;
      }
      //
      if (typeof this.disabledDates.from !== "undefined" && this.disabledDates.from && date > this.disabledDates.from) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.ranges !== "undefined") {
        this.disabledDates.ranges.forEach((range) => {
          if (typeof range.from !== "undefined" && range.from && typeof range.to !== "undefined" && range.to) {
            if (date < range.to && date > range.from) {
              disabledDates = true;
              return true;
            }
          }
        });
      }
      if (typeof this.disabledDates.days !== "undefined" && this.disabledDates.days.indexOf(this.utils.getDay(date)) !== -1) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.daysOfMonth !== "undefined" && this.disabledDates.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        disabledDates = true;
      }
      if (typeof this.disabledDates.customPredictor === "function" && this.disabledDates.customPredictor(date)) {
        disabledDates = true;
      }
      return disabledDates;
    },
    /**
     * Whether a day is highlighted (only if it is not disabled already except when highlighted.includeDisabled is true)
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightedDate(date) {
      if (!(this.highlighted && this.highlighted.includeDisabled) && this.isDisabledDate(date)) {
        return false;
      }

      let highlighted = false;

      if (typeof this.highlighted === "undefined") {
        return false;
      }

      if (typeof this.highlighted.dates !== "undefined") {
        this.highlighted.dates.forEach((d) => {
          if (this.utils.compareDates(date, d)) {
            highlighted = true;
            return true;
          }
        });
      }
      //
      const currDate = new Date(date.toDateString());

      if (this.isDefined(this.highlighted.from) && this.isDefined(this.highlighted.to)) {
        // highlighted = date >= this.highlighted.from && date < this.highlighted.to
        highlighted = date >= this.highlighted.from && currDate <= this.highlighted.to;
      }
      //
      if (typeof this.highlighted.days !== "undefined" && this.highlighted.days.indexOf(this.utils.getDay(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.daysOfMonth !== "undefined" && this.highlighted.daysOfMonth.indexOf(this.utils.getDate(date)) !== -1) {
        highlighted = true;
      }

      if (typeof this.highlighted.customPredictor === "function" && this.highlighted.customPredictor(date)) {
        highlighted = true;
      }

      return highlighted;
    },

    dayClasses(day) {
      return {
        selected: day.isSelected,
        disabled: day.isDisabled,
        highlighted: day.isHighlighted,
        today: day.isToday,
        weekend: day.isWeekend,
        sat: day.isSaturday,
        sun: day.isSunday,
        "highlight-start": day.isHighlightStart,
        "highlight-end": day.isHighlightEnd,
      };
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightStart(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.from instanceof Date &&
        this.utils.getFullYear(this.highlighted.from) === this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.from) === this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.from) === this.utils.getDate(date)
      );
    },
    /**
     * Whether a day is highlighted and it is the first date
     * in the highlighted range of dates
     * @param {Date}
     * @return {Boolean}
     */
    isHighlightEnd(date) {
      return (
        this.isHighlightedDate(date) &&
        this.highlighted.to instanceof Date &&
        this.utils.getFullYear(this.highlighted.to) === this.utils.getFullYear(date) &&
        this.utils.getMonth(this.highlighted.to) === this.utils.getMonth(date) &&
        this.utils.getDate(this.highlighted.to) === this.utils.getDate(date)
      );
    },
    /**
     * Helper
     * @param  {mixed}  prop
     * @return {Boolean}
     */
    isDefined(prop) {
      return typeof prop !== "undefined" && prop;
    },
  },
};
// eslint-disable-next-line
</script>

<style scoped>
#week-day {
  display: grid;
  align-content: center;
  justify-content: center;
  cursor: default;
  grid-template-columns: repeat(7, 1fr);
  max-height: 30px;
}

#content {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: 30px;
  row-gap: 9px;
  margin: 0 auto;
}

.picker {
  margin: 0 auto 5px;
}

.header-month {
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  height: 20px;
  margin: 25px 0 20px 0;
  color: #0d152b;
  font-size: 14px;
  font-weight: bolder;
  text-transform: uppercase;
}

.picker .day-cell {
  border: 2px solid transparent;
  border-radius: 15px;
  /* max-width: 30px; */
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
}

.picker .day {
  color: #0d152b;
  display: flex;
  align-content: center;
  justify-content: center;
  width: 40px;
}

.picker .week-day-cell {
  background-color: white;
  font-size: 10px;
  font-weight: bold;
  color: #999999;
  display: flex;
  align-content: center;
  justify-content: center;
  width: 40px;
  margin-bottom: 10px;
}

.picker .day.highlighted:not(.highlight-start):not(.highlight-end) {
  background-color: #405efe;
  color: white;
}

/* .picker .day-cell.highlighted.highlight-start.highlight-end {
     background: #0021C7;
     color: white;
 }*/

.picker .day.highlighted.highlight-start {
  background: linear-gradient(to right, white 50%, #405efe 51%);
}

.picker .day.highlighted.highlight-end {
  background: linear-gradient(to right, #405efe 50%, white 51%);
}

.picker .day.highlighted.highlight-start.highlight-end {
  background: white;
}

.picker .day-cell.highlighted.highlight-end {
  background: #0021c7;
  color: white;
}

.picker .day-cell.highlighted.highlight-start {
  background: #0021c7;
  color: white;
}

.picker .day-cell:not(.disabled):hover {
  border: 2px solid #4285f4;
  background-color: white;
  color: #0d152b;
}

.picker .day-cell.disabled {
  color: #e6e6e6;
  cursor: default;
}
</style>
