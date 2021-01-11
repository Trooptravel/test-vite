<template>
  <div class="google-map-overlay">
    <div class="custom-marker" ref="custom_marker" :style="z_index">
      <slot name="default" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import MapElementMixin from '../mixins/map-element.js';

export default defineComponent({
  name: 'HTMLMarker',
  mixins: [MapElementMixin],
  props: {
    group_active: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    hovering: { type: Boolean, default: false },
    record_id: { type: String, default: 'none' },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    delayRepaint: {
      type: Number,
      default: undefined,
    },
    marker: {
      type: Object,
      default: undefined,
    },
    offsetX: {
      type: Number,
      default: 0,
    },
    offsetY: {
      type: Number,
      default: 0,
    },
    alignment: {
      type: String,
      default: 'top',
    },
  },
  data() {
    return {
      opacity: 1,
    };
  },
  updated() {},
  watch: {
    hovering() {
      this.$overlay.repaint();
    },
    marker(val) {
      this.$mapPromise.then((map) => this.$overlay.setPosition());
    },
  },
  provide() {
    console.log('Provide');
    const self = this;
    console.log('self');
    console.log(this);
    this.$mapPromise.then((map) => {
      console.log('mapPromise');
      class Overlay extends google.maps.OverlayView {
        constructor(map) {
          super();
          this.setMap(map);
          this.draw = () => this.repaint();
          this.setPosition = () => this.repaint();
          this.div = null;
        }
        repaint() {
          console.log('repaint');
          this.div = self.$refs.custom_marker;
          const projection = this.getProjection();
          if (projection && this.div) {
            const posPixel = projection.fromLatLngToDivPixel(self.position);
            let x, y;
            x = posPixel.x;
            y = posPixel.y;
            this.div.style['z-index'] = self.z_index;
            // this.div.style.left = `${x - 50}px`;
            // this.div.style.top = `${y - 100}px`;
            this.div.style.left = `${x - 0}px`;
            this.div.style.top = `${y - 0}px`;
          }
        }
        onAdd() {
          console.log('onAdd');

          this.div = self.$refs.custom_marker;
          const panes = this.getPanes();
          let pos = {
            lat() {
              return self.lat;
            },
            lng() {
              return self.lng;
            },
          };
          this.pos = pos;
          this.div.style.position = 'absolute';
          this.div.style.zIndex = 50;
          panes.overlayLayer.appendChild(this.div);
          panes.overlayMouseTarget.appendChild(this.div);
        }
        onRemove() {
          // self.$slots?.default?.[0]?.elm?.remove?.();
          self.$refs.custom_marker?.remove?.();
        }
      }
      this.$overlay = new Overlay(map);
      this.opacity = 1;
    });
    console.log('Done');
  },
  methods: {},
  computed: {
    latitude() {
      console.log('latitude');

      return parseFloat(this.marker.lat || this.marker.latitude);
    },
    longitude() {
      console.log('longitude');
      return parseFloat(this.marker.lng || this.marker.longitude);
    },
    z_index() {
      console.log('z_index');
      let group_index = this.group_active ? 100 : 1;
      let item_index = this.active ? 200 : 2;
      let hover_index = this.hovering ? 300 : 3;
      return group_index + item_index + hover_index;
    },
    position() {
      console.log('position');
      const self = this;
      return {
        lat() {
          return self.lat;
        },
        lng() {
          return self.lng;
        },
      };
    },
  },
  beforeUnmount() {
    console.log('beforeUnmount');
    if (this.$overlay) {
      this.$overlay.setMap(null);
      this.$overlay = undefined;
    }
  },
  unmounted() {
    console.log('unmounted');
    if (this.$overlay) {
      this.$overlay.setMap(null);
      this.$overlay = undefined;
    }
  },
});
</script>

<style>
div.custom-marker {
  /* pointer-events: none; */
  /* min-width: 100px;
  max-width: 100px;
  min-height: 100px;
  max-height: 100px; */
  min-width: 1px;
  max-width: 1px;
  min-height: 1px;
  max-height: 1px;
  z-index: 0;
  position: relative;
  display: grid;
  align-items: end;
  justify-content: center;
}
</style>
