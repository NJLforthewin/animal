import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  IconButton,
  Box,
  Link, // For the map link
  Divider
} from '@mui/material';

// Import MUI Icons
import CloseIcon from '@mui/icons-material/Close';
import SensorsIcon from '@mui/icons-material/Sensors'; // Smart stick / device icon
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'; // Online/Offline dot
import SignpostIcon from '@mui/icons-material/Signpost'; // Street name
import PlaceIcon from '@mui/icons-material/Place'; // Place name / POI
import LocationSearchingIcon from '@mui/icons-material/LocationSearching'; // Last location
import BatteryStdIcon from '@mui/icons-material/BatteryStd'; // Battery
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt'; // Signal
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // Added missing import for Timestamp

export interface DeviceInfo {
  latitude: number | null;
  longitude: number | null;
  timestamp: string | null;
  battery_level?: number | null;
  signal_strength?: number | null;
  speed?: number | null;
  altitude?: number | null;
  accuracy?: number | null;
  isOnline?: boolean;
  street_name?: string | null;
  city_name?: string | null;
  place_name?: string | null;
  context_tag?: string | null;
  poi_name?: string | null;
  poi_type?: string | null;
  poi_lat?: number | null;
  poi_lon?: number | null;
  poi_distance_km?: number | null;
  poi_distance_m?: number | null;
}

interface DeviceInfoModalProps {
  open: boolean;
  onClose: () => void;
  info: DeviceInfo | null;
}

// Helper to format values or show 'N/A'
const formatValue = (value: string | number | null | undefined, unit: string = ''): string => {
    if (value === null || typeof value === 'undefined' || String(value).trim() === '') {
        return 'N/A';
    }
    // Ensure numbers are formatted nicely if needed (e.g., decimals)
    if (typeof value === 'number') {
        // Example: round distance to 2 decimal places
        if (unit === ' km' && value % 1 !== 0) {
            return `${value.toFixed(2)}${unit}`;
        }
         // Example: round battery level to integer
        if (unit === '%') {
             return `${Math.round(value)}${unit}`;
        }
    }
    return `${value}${unit}`;
};


const DeviceInfoModal: React.FC<DeviceInfoModalProps> = ({ open, onClose, info }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
            <SensorsIcon color="primary" />
            <Typography variant="h6">Device Info</Typography>
        </Stack>
        <IconButton onClick={onClose} aria-label="Close" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 1 }}>
        {info ? (
          <Stack spacing={1.5}>
            {/* Online Status */}
            <Chip
                icon={<FiberManualRecordIcon fontSize="small" />}
                label={info.isOnline ? 'Online' : 'Offline'}
                color={info.isOnline ? 'success' : 'error'}
                size="small"
                variant="outlined"
                sx={{ alignSelf: 'flex-start', fontWeight: 600 }}
            />

            {/* Location Info */}
            <InfoItem icon={<SignpostIcon />} label="Street" value={formatValue(info.street_name)} />
            <InfoItem icon={<PlaceIcon />} label="Place" value={formatValue(info.place_name)} />
            <InfoItem icon={<LocationSearchingIcon />} label="Last Location" value={`${formatValue(info.street_name)}, ${formatValue(info.place_name)}`} />

             {/* POI Info */}
             {(info.poi_name || typeof info.poi_distance_m === 'number' || typeof info.poi_distance_km === 'number') && (
                <Box>
                    <Typography variant="body2" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <PlaceIcon color="action" /> Nearest Point of Interest
                    </Typography>
                    {info.poi_name && (
                         <Typography variant="body2" sx={{ pl: 4 }}>
                            {info.poi_name} {info.poi_type ? `(${info.poi_type})` : ''}
                         </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ pl: 4 }}>
                        Distance: {
                            typeof info.poi_distance_m === 'number' && info.poi_distance_m < 1000
                            ? `${info.poi_distance_m} meters away`
                            : typeof info.poi_distance_km === 'number'
                            ? `${formatValue(info.poi_distance_km, ' km')} away` // Use formatter
                            : 'N/A'
                        }
                    </Typography>
                     {info.poi_lat && info.poi_lon && (
                        <Link
                            href={`https://www.openstreetmap.org/?mlat=${info.poi_lat}&mlon=${info.poi_lon}#map=19/${info.poi_lat}/${info.poi_lon}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="caption"
                            sx={{ display: 'block', pl: 4, mt: 0.5 }}
                        >
                            View on Map
                        </Link>
                     )}
                </Box>
             )}

            <Divider sx={{ my: 1 }} />

            {/* Device Stats */}
            <InfoItem icon={<BatteryStdIcon />} label="Battery Level" value={formatValue(info.battery_level, '%')} />
            <InfoItem icon={<SignalCellularAltIcon />} label="Signal Strength" value={formatValue(info.signal_strength)} />
            {/* Add Speed, Altitude, Accuracy if needed - Uncomment and import icons if used */}
            {/* <InfoItem icon={<SpeedIcon />} label="Speed" value={formatValue(info.speed, ' m/s')} /> */}
            {/* <InfoItem icon={<TerrainIcon />} label="Altitude" value={formatValue(info.altitude, ' m')} /> */}
            {/* <InfoItem icon={<MyLocationIcon />} label="Accuracy" value={formatValue(info.accuracy, ' m')} /> */}

            <Divider sx={{ my: 1 }} />
            <InfoItem icon={<AccessTimeIcon />} label="Last Update" value={info.timestamp ? new Date(info.timestamp).toLocaleString() : 'N/A'} />


          </Stack>
        ) : (
           <Typography color="text.secondary" textAlign="center" sx={{ py: 3 }}>No device information available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

// Helper component for consistent info display
const InfoItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ color: 'action.active', mt: 0.5 }}>{icon}</Box> {/* Align icon better */}
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant="caption" color="text.secondary">{label}</Typography>
             {/* Use body1 for value for better readability */}
            <Typography variant="body1" fontWeight={500} noWrap title={value}>{value}</Typography>
        </Box>
    </Box>
);


export default DeviceInfoModal;

