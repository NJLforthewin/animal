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
    InputAdornment,
    IconButton,
    Alert,
    Link,
    CircularProgress,
    Avatar,
    Divider,
    List, // <-- Added for feature list
    ListItem, // <-- Added for feature list
    ListItemIcon, // <-- Added for feature list
    ListItemText // <-- Added for feature list
} from '@mui/material';

// Import MUI Icons
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// Use public path for logo image

import EmailIcon from '@mui/icons-material/Email';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // <-- Added for list
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'; // <-- Added for security box

// Define the "contract" of props this component expects
export interface LoginFormProps {
    // State Values
    email: string;
    password: string;
    showPassword: boolean;
    rememberMe: boolean;
    successMsg: string;
    errorMsg: string;
    loading: boolean;

    // Event Handlers
    handleSubmit: (e: React.FormEvent) => void;
    handleGoogleSignIn: () => void;
    handleGoToRegister: () => void;
    handleGoToForgotPassword: () => void;
    handleClickShowPassword: () => void;
    handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;

    // State Setters
    setEmail: (val: string) => void;
    setPassword: (val: string) => void;
    setRememberMe: (val: boolean) => void;
}
const logo = process.env.PUBLIC_URL + '/logo192.png';
const LoginForm: React.FC<LoginFormProps> = (props) => {
    // Destructure all props for easy use
    const {
        email, password, showPassword, rememberMe,
        successMsg, errorMsg, loading,
        handleSubmit, handleGoogleSignIn, handleGoToRegister,
        handleClickShowPassword, handleMouseDownPassword,
        setEmail, setPassword, setRememberMe
    } = props;

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            py: 4,
            background: 'linear-gradient(to bottom right, #e3f2fd 0%, #e8eaf6 100%)',
        }}>
            {/* Changed to 'md' to accommodate two columns */}
            <Container maxWidth="md">
                {/* This Paper is now the main card that holds the grid */}
                <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden' /* Keeps corners rounded */ }}>
                    <Stack direction="row" alignItems="center">

                        {/* === Left Column: Features === */}
                        <Box sx={{
                            width: '50%',
                            display: { xs: 'none', md: 'block' }, // Hidden on mobile
                            p: { xs: 3, sm: 5 },
                            // A subtle gradient to match the original's "white" bg
                            background: 'linear-gradient(to bottom, #ffffff, #f4f6f8)',
                            borderRight: '1px solid',
                            borderColor: 'divider'
                        }}>
                            <Typography component="h1" variant="h5" sx={{ mb: 1, fontWeight: 700, color: 'primary.dark' }}>
                                Welcome to GabayLakad
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Secure access to monitor and support your loved one.
                            </Typography>
                            
                            <List dense>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutlineIcon color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Real-time GPS tracking" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutlineIcon color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Emergency alerts with location sharing" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutlineIcon color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="24/7 monitoring dashboard" />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon sx={{minWidth: 32}}><CheckCircleOutlineIcon color="success" fontSize="small" /></ListItemIcon>
                                    <ListItemText primary="Automatic location logging" />
                                </ListItem>
                            </List>

                            {/* Security Box from original */}
                            <Box sx={{ mt: 4, p: 2, bgcolor: 'primary.lighter', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <ShieldOutlinedIcon color="primary" />
                                <Box>
                                    <Typography variant="subtitle2" sx={{fontWeight: 600, color: 'primary.dark'}}>Security First</Typography>
                                    <Typography variant="caption" color="text.secondary">Your data is protected with secure authentication.</Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* === Right Column: Login Form === */}
                        <Box sx={{
                            width: { xs: '100%', md: '50%' },
                            p: { xs: 3, sm: 5 }, 
                            textAlign: 'center' 
                        }}>
                                <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'transparent', width: 120, height: 120 }}>
                                    <img src={logo} alt="Logo" style={{ width: 120, height: 120 }} />
                                </Avatar>
                                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                    <Stack spacing={2.5}>
                                        {errorMsg && (
                                            <Alert severity="error" icon={<ErrorIcon fontSize="inherit" />}>
                                                {errorMsg}
                                            </Alert>
                                        )}
                                        {successMsg && (
                                            <Alert severity="success" icon={<CheckCircleIcon fontSize="inherit" />}>
                                                {successMsg}
                                            </Alert>
                                        )}

                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            label="Email Address"
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={loading}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon color="action" />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        value="remember"
                                                        color="primary"
                                                        checked={rememberMe}
                                                        onChange={(e) => setRememberMe(e.target.checked)}
                                                        disabled={loading}
                                                    />
                                                }
                                                label="Remember me"
                                            />
                                            <Link href="/forgot-password" variant="body2">
                                                Forgot password?
                                            </Link>
                                        </Stack>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            disabled={loading}
                                            sx={{ mt: 2, mb: 1, py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                                            startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                                        >
                                            {loading ? 'Signing In...' : 'Sign In'}
                                        </Button>

                                        <Divider sx={{ my: 2 }}>OR</Divider>

                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={handleGoogleSignIn}
                                            sx={{ textTransform: 'none' }}
                                            startIcon={<GoogleIcon />}
                                            disabled={loading}
                                        >
                                            Sign in with Google
                                        </Button>

                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
                                            Don't have an account?{' '}
                                            <Link component="button" type="button" variant="body2" onClick={handleGoToRegister}>
                                                Register now
                                            </Link>
                                        </Typography>
                                    </Stack>
                                </Box>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default LoginForm;

