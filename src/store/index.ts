/*--------------------------------------------------------------
################################################################
>>> GUIDE: Add your module's 'MODULE' types
################################################################
---------------------------------------------------------------*/

import { createStore, createLogger } from "vuex";

// Plug in logger when in development environment
//@ts-ignore
const debug = false; // process.env.NODE_ENV !== "production" && process.env.VUE_APP_DEBUG;

const plugins = debug ? [createLogger({})] : [];
import hotels from "./hotels";

export const store = createStore({
  plugins,
  state(): object {
    return {
      hotels: hotels,
      dataGF: {
        position: { lat: 30.2246577, lng: -97.6138393 },
        googlePlaceId: "ChIJn241wLm3RIYRfeE6lvGaNs0",
      },
    };
  },
  mutations: {},
});

export function useStore() {
  return store;
}

// @ts-ignore
window.state = store.state;
