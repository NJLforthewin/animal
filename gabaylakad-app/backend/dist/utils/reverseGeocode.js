"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reverseGeocodeNominatim = exports.findNearestPOI = void 0;
/**
 * Find the nearest POI (any type) within a radius using Nominatim search API.
 * @param lat Latitude
 * @param lon Longitude
 * @param radiusMeters Search radius in meters (default: 2000)
 */
function findNearestPOI(lat, lon, radiusMeters = 2000) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // LocationIQ Nearby API
            const token = 'pk.2f06bb4cec6052909ab17237f045e6a2';
            const url = `https://us1.locationiq.com/v1/nearby.php?key=${token}&lat=${lat}&lon=${lon}&radius=${radiusMeters}&limit=10&format=json`;
            console.log('[findNearestPOI] LocationIQ Request URL:', url);
            const response = yield axios_1.default.get(url);
            const results = response.data;
            if (!results || !results.length) {
                console.log('[findNearestPOI] No POI found. Raw response:', results);
                return null;
            }
            const sortedPOIs = results.map((poi) => {
                const poiLat = parseFloat(poi.lat);
                const poiLon = parseFloat(poi.lon);
                const poi_distance_km = haversineDistance(lat, lon, poiLat, poiLon);
                return Object.assign(Object.assign({}, poi), { poiLat,
                    poiLon,
                    poi_distance_km, poi_distance_m: Math.round(poi_distance_km * 1000) });
            }).sort((a, b) => a.poi_distance_km - b.poi_distance_km);
            // Optionally prioritize certain POI types (e.g., establishments)
            let bestPOI = sortedPOIs[0];
            // Example: prioritize 'establishment', 'university', 'school', etc.
            const priorityTypes = ['establishment', 'university', 'school', 'hospital', 'mall', 'restaurant', 'bus_stop', 'train_station'];
            for (const type of priorityTypes) {
                const found = sortedPOIs.find((poi) => poi.osm_key === type || poi.type === type);
                if (found) {
                    bestPOI = found;
                    break;
                }
            }
            return {
                poi_name: bestPOI.name || bestPOI.display_name || bestPOI.osm_value || null,
                poi_type: bestPOI.osm_key || bestPOI.type || null,
                poi_lat: bestPOI.poiLat,
                poi_lon: bestPOI.poiLon,
                poi_distance_km: bestPOI.poi_distance_km,
                poi_distance_m: bestPOI.poi_distance_m,
                extratags: {},
                namedetails: {},
                osm_id: bestPOI.osm_id || null,
                osm_type: bestPOI.osm_type || null
            };
        }
        catch (error) {
            console.error('[findNearestPOI Error]', error);
            return null;
        }
    });
}
exports.findNearestPOI = findNearestPOI;
const axios_1 = __importDefault(require("axios"));
/**
 * Reverse geocode latitude/longitude to contextual fields using Nominatim.
 * @param lat Latitude
 * @param lon Longitude
 */
// Helper: Haversine formula for distance in km
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
function reverseGeocodeNominatim(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1&extratags=1`;
            const response = yield axios_1.default.get(url, {
                headers: {
                    'User-Agent': 'gabaylakad-app/1.0 (your@email.com)'
                }
            });
            const address = response.data.address || {};
            const extratags = response.data.extratags || {};
            const namedetails = response.data.namedetails || {};
            // Log the full address object for debugging
            console.log('[ReverseGeocodeNominatim] address:', JSON.stringify(address, null, 2));
            console.log('[ReverseGeocodeNominatim] namedetails:', JSON.stringify(namedetails, null, 2));
            console.log('[ReverseGeocodeNominatim] extratags:', JSON.stringify(extratags, null, 2));
            // POI extraction: amenity, police, hospital, tourism, shop, public_transport, etc.
            let poi_type = null;
            let poi_name = null;
            let poi_lat = null;
            let poi_lon = null;
            let poi_distance_km = null;
            let poi_distance_m = null;
            // Try to extract POI type and name from address fields
            const poiFields = [
                'police', 'hospital', 'fire_station', 'school', 'hotel', 'tourism', 'shop', 'public_transport', 'amenity', 'place_of_worship', 'bank', 'post_office', 'pharmacy', 'supermarket', 'restaurant', 'cafe', 'bar', 'pub', 'library', 'cinema', 'theatre', 'parking', 'sports_centre', 'university', 'college', 'bus_station', 'train_station', 'airport', 'embassy', 'government_office', 'courthouse', 'community_centre', 'marketplace', 'museum', 'park', 'playground', 'zoo', 'aquarium', 'stadium', 'swimming_pool', 'taxi', 'car_rental', 'car_wash', 'charging_station', 'fuel', 'atm', 'doctor', 'dentist', 'clinic', 'veterinary', 'childcare', 'kindergarten', 'school', 'college', 'university', 'research_institute', 'hostel', 'guest_house', 'motel', 'camp_site', 'alpine_hut', 'chalet', 'apartment', 'dormitory', 'resort', 'spa', 'casino', 'nightclub', 'stripclub', 'brothel', 'sauna', 'massage', 'beauty', 'hairdresser', 'tailor', 'dry_cleaning', 'laundry', 'optician', 'hearing_aids', 'funeral_directors', 'crematorium', 'cemetery', 'memorial', 'monument', 'statue', 'artwork', 'gallery', 'arts_centre', 'exhibition_centre', 'conference_centre', 'event_venue', 'concert_hall', 'music_school', 'dance_school', 'language_school', 'driving_school', 'flight_school', 'sports_school', 'martial_arts_school', 'yoga', 'pilates', 'fitness_centre', 'gym', 'sports_hall', 'sports_club', 'stadium', 'track', 'field', 'court', 'pitch', 'rink', 'pool', 'golf_course', 'miniature_golf', 'bowling_alley', 'skatepark', 'climbing', 'shooting', 'horse_riding', 'dog_park', 'dog_training', 'animal_shelter', 'pet_shop', 'veterinary', 'animal_boarding', 'animal_breeding', 'animal_training', 'animal_grooming', 'animal_health', 'animal_welfare', 'animal_control', 'animal_rescue', 'animal_adoption', 'animal_cemetery', 'animal_memorial', 'animal_monument', 'animal_statue', 'animal_artwork', 'animal_gallery', 'animal_arts_centre', 'animal_exhibition_centre', 'animal_conference_centre', 'animal_event_venue', 'animal_concert_hall', 'animal_music_school', 'animal_dance_school', 'animal_language_school', 'animal_driving_school', 'animal_flight_school', 'animal_sports_school', 'animal_martial_arts_school', 'animal_yoga', 'animal_pilates', 'animal_fitness_centre', 'animal_gym', 'animal_sports_hall', 'animal_sports_club', 'animal_stadium', 'animal_track', 'animal_field', 'animal_court', 'animal_pitch', 'animal_rink', 'animal_pool', 'animal_golf_course', 'animal_miniature_golf', 'animal_bowling_alley', 'animal_skatepark', 'animal_climbing', 'animal_shooting', 'animal_horse_riding', 'animal_dog_park', 'animal_dog_training', 'animal_animal_shelter', 'animal_pet_shop', 'animal_veterinary', 'animal_animal_boarding', 'animal_animal_breeding', 'animal_animal_training', 'animal_animal_grooming', 'animal_animal_health', 'animal_animal_welfare', 'animal_animal_control', 'animal_animal_rescue', 'animal_animal_adoption', 'animal_animal_cemetery', 'animal_animal_memorial', 'animal_animal_monument', 'animal_animal_statue', 'animal_animal_artwork', 'animal_animal_gallery', 'animal_animal_arts_centre', 'animal_animal_exhibition_centre', 'animal_animal_conference_centre', 'animal_animal_event_venue', 'animal_animal_concert_hall', 'animal_animal_music_school', 'animal_animal_dance_school', 'animal_animal_language_school', 'animal_animal_driving_school', 'animal_animal_flight_school', 'animal_animal_sports_school', 'animal_animal_martial_arts_school', 'animal_animal_yoga', 'animal_animal_pilates', 'animal_animal_fitness_centre', 'animal_animal_gym', 'animal_animal_sports_hall', 'animal_animal_sports_club', 'animal_animal_stadium', 'animal_animal_track', 'animal_animal_field', 'animal_animal_court', 'animal_animal_pitch', 'animal_animal_rink', 'animal_animal_pool', 'animal_animal_golf_course', 'animal_animal_miniature_golf', 'animal_animal_bowling_alley', 'animal_animal_skatepark', 'animal_animal_climbing', 'animal_animal_shooting', 'animal_animal_horse_riding', 'animal_animal_dog_park', 'animal_animal_dog_training'
            ];
            for (const field of poiFields) {
                if (address[field]) {
                    poi_type = field;
                    poi_name = address[field];
                    break;
                }
            }
            // If amenity is present, use it as fallback
            if (!poi_type && address.amenity) {
                poi_type = 'amenity';
                poi_name = address.amenity;
            }
            // Try to extract POI name from namedetails if not found yet
            if (!poi_name && namedetails.name) {
                poi_name = namedetails.name;
            }
            else if (!poi_name && namedetails.official_name) {
                poi_name = namedetails.official_name;
            }
            else if (!poi_name && namedetails.alt_name) {
                poi_name = namedetails.alt_name;
            }
            // Try to extract POI type from extratags if not found yet
            if (!poi_type && extratags['amenity']) {
                poi_type = extratags['amenity'];
            }
            else if (!poi_type && extratags['tourism']) {
                poi_type = extratags['tourism'];
            }
            // Try to get POI coordinates from response (if available)
            if (poi_type && response.data.extratags && extratags[poi_type + ':lat'] && extratags[poi_type + ':lon']) {
                poi_lat = parseFloat(extratags[poi_type + ':lat']);
                poi_lon = parseFloat(extratags[poi_type + ':lon']);
            }
            // If not, use response.data.lat/lon (center of POI)
            if (!poi_lat && !poi_lon && response.data.lat && response.data.lon) {
                poi_lat = parseFloat(response.data.lat);
                poi_lon = parseFloat(response.data.lon);
            }
            // Calculate distance if POI coordinates are available
            if (poi_lat !== null && poi_lon !== null) {
                poi_distance_km = haversineDistance(lat, lon, poi_lat, poi_lon);
                poi_distance_m = Math.round(poi_distance_km * 1000);
            }
            for (const field of poiFields) {
                if (address[field]) {
                    poi_type = field;
                    poi_name = address[field];
                    break;
                }
            }
            // If amenity is present, use it as fallback
            if (!poi_type && address.amenity) {
                poi_type = 'amenity';
                poi_name = address.amenity;
            }
            // Try to get POI coordinates from response (if available)
            if (poi_type && response.data.extratags && extratags[poi_type + ':lat'] && extratags[poi_type + ':lon']) {
                poi_lat = parseFloat(extratags[poi_type + ':lat']);
                poi_lon = parseFloat(extratags[poi_type + ':lon']);
            }
            // If not, use response.data.lat/lon (center of POI)
            if (!poi_lat && !poi_lon && response.data.lat && response.data.lon) {
                poi_lat = parseFloat(response.data.lat);
                poi_lon = parseFloat(response.data.lon);
            }
            // Calculate distance if POI coordinates are available
            if (poi_lat !== null && poi_lon !== null) {
                poi_distance_km = haversineDistance(lat, lon, poi_lat, poi_lon);
                poi_distance_m = Math.round(poi_distance_km * 1000);
            }
            return {
                street_name: address.road ||
                    address.pedestrian ||
                    address.footway ||
                    address.residential ||
                    address.path ||
                    address.highway ||
                    address.cycleway ||
                    address.service ||
                    address.square ||
                    address.place ||
                    null,
                city_name: address.city || address.town || address.village || address.municipality || null,
                place_name: address.neighbourhood ||
                    address.suburb ||
                    address.quarter ||
                    address.hamlet ||
                    address.residential ||
                    address.postcode ||
                    null,
                context_tag: address.amenity || address.building || address.landuse || null,
                poi_name,
                poi_type,
                poi_lat,
                poi_lon,
                poi_distance_km,
                poi_distance_m
            };
        }
        catch (error) {
            console.error('[ReverseGeocodeNominatim Error]', error);
            return {
                street_name: null,
                city_name: null,
                place_name: null,
                context_tag: null,
                poi_name: null,
                poi_type: null,
                poi_lat: null,
                poi_lon: null,
                poi_distance_km: null,
                poi_distance_m: null
            };
        }
    });
}
exports.reverseGeocodeNominatim = reverseGeocodeNominatim;
