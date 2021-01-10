
function prop_is_set(evt,all_props) {
  let props =  Object.keys(all_props).map(function(e) { return e.toLocaleLowerCase() });
  let evt_name = `on${evt.toLowerCase()}`;
  return (props.indexOf(evt_name) > -1)
}

export default function bindEvents(vueInst, googleMapsInst, events) {
  events.forEach((eventName) => {
    if (  vueInst.$gmapOptions.autobindAllEvents ||  prop_is_set(eventName,vueInst.$attrs)  ) {
      googleMapsInst.addListener(eventName, (ev) => {
        vueInst.$emit(eventName, ev);
      });
    }
  });
}

