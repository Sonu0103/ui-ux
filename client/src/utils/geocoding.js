const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

export const geocodeAddress = async (address) => {
  try {
    if (!address) {
      console.warn("No address provided for geocoding");
      return null;
    }

    const params = new URLSearchParams({
      q: address,
      format: "json",
      limit: 1,
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}?${params}`);
    const data = await response.json();

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
    console.warn(`Location not found for address: ${address}`);
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};
