const optData = {
    mapCenter: { lat: 0, lng: 0 },
};

const mapOptions = {
    center: optData.mapCenter,
    mapTypeId: "roadmap",
    zoom: 2,
    minZoom: 2,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    scaleControl: true,
    rotateControl: false,
    zoomControl: true,
    mapTypeControlOptions: {
        style: 2, // google.maps.MapTypeControlStyle.DROPDOWN_MENU,
        position: 7, //google.maps.ControlPosition.RIGHT_TOP,
        mapTypeIds: ["roadmap", "terrain", "hybrid", "satellite"],
    },
    styles: [
        {
            featureType: "all",
            elementType: "all",
            stylers: [
                {
                    hue: "#e7ecf0",
                },
            ],
        },
        {
            featureType: "administrative.country",
            elementType: "geometry.fill",
            stylers: [
                {
                    lightness: "100",
                },
            ],
        },
        {
            featureType: "landscape.natural.landcover",
            elementType: "geometry.fill",
            stylers: [
                {
                    gamma: "5.61",
                },
                {
                    lightness: "74",
                },
                {
                    color: "#f2f2f2",
                },
            ],
        },
        {
            featureType: "poi",
            elementType: "all",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "road",
            elementType: "all",
            stylers: [
                {
                    saturation: -70,
                },
            ],
        },
        {
            featureType: "transit",
            elementType: "all",
            stylers: [
                {
                    visibility: "off",
                },
            ],
        },
        {
            featureType: "water",
            elementType: "all",
            stylers: [
                {
                    visibility: "simplified",
                },
                {
                    saturation: -60,
                },
            ],
        },
        {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [
                {
                    color: "#c4deea",
                },
            ],
        },
    ],
};

export default mapOptions;
