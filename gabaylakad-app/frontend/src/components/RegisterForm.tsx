import React from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Checkbox,
    FormControlLabel,
    Stack,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    SelectChangeEvent,
    InputAdornment,
    IconButton,
    Alert,
    Link,
    CircularProgress,
    FormHelperText
} from '@mui/material';

// Import MUI Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// These are needed by the form, so we pass them in
const impairmentOptions = [
    'Totally Blind',
    'Partially Sighted',
    'Low Vision',
];

const relationshipOptions = [
    'Parent',
    'Child',
    'Sibling',
    'Guardian',
    'Caregiver',
    'Other',
];

// Reusable Card Section Component
const CardSection: React.FC<{ title: string; children: React.ReactNode }>
    = ({ title, children }) => (
    <Box sx={{ height: '100%' }}>
        <Typography variant="h6" component="h3" color="primary.dark" sx={{ mb: 2.5, fontWeight: 600, borderBottom: 1, borderColor: 'divider', pb: 1 }}>
            {title}
        </Typography>
        {children}
    </Box>
);

// Define the 'props' interface for this component
export interface RegisterFormProps {
    // State Values
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    relationship: string;
    otherRelationship: string;
    serialNumber: string;
    password: string;
    confirmPassword: string;
    userFullName: string;
    userAge: string;
    userPhoneNumber: string;
    impairmentLevel: string;
    terms: boolean;
    showPassword: boolean;
    showConfirmPassword: boolean;
    loading: boolean;
    errorMsg: string;
    successMsg: string;
    errors: { [key: string]: string };

    // Event Handlers
    handleSubmit: (e: React.FormEvent) => void;
    handleGoToLogin: () => void;
    handleGoToTerms: () => void;
    handleGoToPrivacy: () => void;
    handleClickShowPassword: () => void;
    handleClickShowConfirmPassword: () => void;
    handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;

    // State Setters
    setFirstName: (val: string) => void;
    setLastName: (val: string) => void;
    setPhoneNumber: (val: string) => void;
    setEmail: (val: string) => void;
    setRelationship: (val: string) => void;
    setOtherRelationship: (val: string) => void;
    setSerialNumber: (val: string) => void;
    setPassword: (val: string) => void;
    setConfirmPassword: (val: string) => void;
    setUserFullName: (val: string) => void;
    setUserAge: (val: string) => void;
    setUserPhoneNumber: (val: string) => void;
    setImpairmentLevel: (val: string) => void;
    setTerms: (val: boolean) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = (props) => {
    // Destructure all props for easy use in the JSX
    const {
        firstName, lastName, phoneNumber, email, relationship, otherRelationship,
        serialNumber, password, confirmPassword, userFullName, userAge,
        userPhoneNumber, impairmentLevel, terms, showPassword,
        showConfirmPassword, loading, errorMsg, successMsg, errors,
        handleSubmit, handleGoToLogin, handleGoToTerms, handleGoToPrivacy,
        handleClickShowPassword, handleClickShowConfirmPassword, handleMouseDownPassword,
        setFirstName, setLastName, setPhoneNumber, setEmail, setRelationship,
        setOtherRelationship, setSerialNumber, setPassword, setConfirmPassword,
        setUserFullName, setUserAge, setUserPhoneNumber, setImpairmentLevel, setTerms
    } = props;

    return (
        // Adjusted Box: removed minHeight, alignItems, justifyContent
        <Box sx={{ display: 'flex', py: 1, background: 'linear-gradient(to bottom right, #e3f2fd, #e8eaf6)' }}>
            <Container maxWidth="lg"> {/* Changed from lg to md */}
                <Paper elevation={6} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 700, mb: 4, color: 'primary.main' }}>
                        Create Your Account
                    </Typography>
                    
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Stack spacing={4}>
                            {/* Row 1: Caregiver & Person */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <CardSection title="Your Information (Caregiver)">
                                        <Stack spacing={2.5}>
                                            <TextField id="fName" label="First Name" variant="outlined" required fullWidth value={firstName} onChange={(e) => setFirstName(e.target.value)} error={!!errors.firstName} helperText={errors.firstName} />
                                            <TextField id="lName" label="Last Name" variant="outlined" required fullWidth value={lastName} onChange={(e) => setLastName(e.target.value)} error={!!errors.lastName} helperText={errors.lastName} />
                                            <TextField id="pNumber" label="Phone Number" variant="outlined" required fullWidth type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="11 digits (e.g., 09xxxxxxxxx)" inputProps={{ maxLength: 11 }} error={!!errors.phoneNumber} helperText={errors.phoneNumber || "Required"} />
                                            <TextField id="email" label="Email" variant="outlined" required fullWidth type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || "Required"} />
                                        </Stack>
                                    </CardSection>
                                </Box>
                                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <CardSection title="Person You'll Monitor">
                                        <Stack spacing={2.5}>
                                            <TextField id="userFullName" label="Full Name" variant="outlined" required fullWidth value={userFullName} onChange={(e) => setUserFullName(e.target.value)} error={!!errors.userFullName} helperText={errors.userFullName} />
                                            <TextField id="userPhoneNumber" label="Phone Number (Optional)" variant="outlined" fullWidth type="tel" value={userPhoneNumber} onChange={(e) => setUserPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="11 digits (if applicable)" inputProps={{ maxLength: 11 }} helperText={errors.userPhoneNumber || "Leave blank if none"} error={!!errors.userPhoneNumber} />
                                            <TextField id="userAge" label="Age" variant="outlined" required fullWidth type="number" value={userAge} onChange={(e) => setUserAge(e.target.value)} placeholder="e.g., 65" inputProps={{ min: 1, max: 120 }} error={!!errors.userAge} helperText={errors.userAge || "Age 1-120"} />
                                            <FormControl fullWidth required variant="outlined" error={!!errors.impairmentLevel}>
                                                <InputLabel id="impairmentLevel-label">Impairment Level</InputLabel>
                                                <Select labelId="impairmentLevel-label" id="impairmentLevel" value={impairmentLevel} onChange={(e: SelectChangeEvent) => setImpairmentLevel(e.target.value)} label="Impairment Level">
                                                    <MenuItem value="" disabled><em>Select impairment level</em></MenuItem>
                                                    {impairmentOptions.map(opt => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                                                </Select>
                                                {errors.impairmentLevel && <FormHelperText>{errors.impairmentLevel}</FormHelperText>}
                                            </FormControl>
                                        </Stack>
                                    </CardSection>
                                </Box>
                            </Stack>

                            {/* Row 2: Relationship & Security */}
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
                                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <CardSection title="Relationship & Device">
                                        <Stack spacing={2.5}>
                                            <FormControl fullWidth required variant="outlined" error={!!errors.relationship}>
                                                <InputLabel id="relationship-label">Relationship to Person</InputLabel>
                                                <Select labelId="relationship-label" id="relationship" value={relationship} onChange={(e: SelectChangeEvent) => setRelationship(e.target.value)} label="Relationship to Person">
                                                    <MenuItem value="" disabled><em>Select relationship</em></MenuItem>
                                                    {relationshipOptions.map(opt => (<MenuItem key={opt} value={opt}>{opt}</MenuItem>))}
                                                </Select>
                                                {errors.relationship && <FormHelperText>{errors.relationship}</FormHelperText>}
                                            </FormControl>
                                            {relationship === 'Other' && (
                                                <TextField id="otherRelationship" label="Specify Relationship" variant="outlined" fullWidth value={otherRelationship} onChange={(e) => setOtherRelationship(e.target.value)} placeholder="Please specify" required error={!!errors.otherRelationship} helperText={errors.otherRelationship} />
                                            )}
                                            <TextField id="serialNumber" label="Device Serial Number" variant="outlined" required fullWidth value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)} placeholder="Found on the tracking device" helperText={errors.serialNumber || "Unique serial number on the device"} error={!!errors.serialNumber} />
                                        </Stack>
                                    </CardSection>
                                </Box>
                                <Box sx={{ width: { xs: '100%', md: '50%' } }}>
                                    <CardSection title="Security">
                                        <Stack spacing={2.5}>
                                            <TextField id="password" label="Create Password" variant="outlined" required fullWidth type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimum 8 characters" error={!!errors.password} helperText={errors.password || "Min. 8 characters with letters & numbers"} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} />
                                            <TextField id="confirmPassword" label="Confirm Password" variant="outlined" required fullWidth type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" error={!!errors.confirmPassword} helperText={errors.confirmPassword || ""} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle confirm password visibility" onClick={handleClickShowConfirmPassword} onMouseDown={handleMouseDownPassword} edge="end">{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>), }} />
                                        </Stack>
                                    </CardSection>
                                </Box>
                            </Stack>
                        </Stack>

                        {/* Actions */}
                        <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
                            <FormControl error={!!errors.terms}>
                                <FormControlLabel
                                    control={<Checkbox id="terms" checked={terms} onChange={(e) => setTerms(e.target.checked)} required color="primary" />}
                                    label={<Typography variant="body2"> I agree to the{' '} <Link component="button" type="button" variant="body2" onClick={handleGoToTerms}> Terms and Conditions </Link>{' '} and{' '} <Link component="button" type="button" variant="body2" onClick={handleGoToPrivacy}> Privacy Policy </Link> </Typography>}
                                    sx={{ alignItems: 'center' }}
                                />
                                {errors.terms && <FormHelperText sx={{ textAlign: 'center' }}>{errors.terms}</FormHelperText>}
                            </FormControl>

                            {errorMsg && ( <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />} sx={{ width: '100%', maxWidth: 'sm' }}> {errorMsg} </Alert> )}
                            {successMsg && ( <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />} sx={{ width: '100%', maxWidth: 'sm' }}> {successMsg} </Alert> )}

                            <Button type="submit" variant="contained" color="primary" disabled={loading || !terms} size="large" sx={{ width: '100%', maxWidth: 'sm', py: 1.5, textTransform: 'none', fontSize: '1.1rem', fontWeight: 600 }} startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}>
                                {loading ? 'Creating Account...' : 'Create Caregiver Account'}
                            </Button>

                            <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
                                Already have an account?{' '}
                                <Link component="button" type="button" variant="body2" onClick={handleGoToLogin}>
                                    Sign in
                                </Link>
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default RegisterForm;

