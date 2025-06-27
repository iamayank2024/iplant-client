export const createCustomMarkerIcon = (
  userAvatar?: string,
  userName?: string
): google.maps.Icon | undefined => {
  // Check if Google Maps is loaded
  if (!window.google?.maps) {
    return undefined;
  }

  if (userAvatar) {
    return {
      url: userAvatar,
      scaledSize: new window.google.maps.Size(40, 40),
      anchor: new window.google.maps.Point(20, 20),
    };
  }

  // Create a data URL for a custom SVG marker with user initial
  const initial = userName?.charAt(0).toUpperCase() || "U";
  const svg = `
    <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="#A5D6A7" stroke="#4CAF50" stroke-width="3"/>
      <text x="20" y="26" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#2E7D32">${initial}</text>
    </svg>
  `;

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new window.google.maps.Size(40, 40),
    anchor: new window.google.maps.Point(20, 20),
  };
};

export const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#A5D6A7" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#81C784" }],
  },
];

export const getMapOptions = () => ({
  styles: mapStyles,
  fullscreenControl: false,
  streetViewControl: false,
  mapTypeControl: false,
  zoomControl: true,
  zoomControlOptions: {
    position: window.google?.maps?.ControlPosition?.RIGHT_CENTER || 7, // 7 is the numeric value for RIGHT_CENTER
  },
});
