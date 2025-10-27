import React from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    Alert,
    Link,
    CircularProgress,
    Avatar,
    InputAdornment,
    IconButton
} from '@mui/material';

// Import MUI Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// Define the "contract" of props this component expects
export interface ResetPasswordFormProps {
    // State Values
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
    successMsg: string;
    errorMsg: string;
    loading: boolean;

    // Event Handlers
    handleSubmit: (e: React.FormEvent) => void;
    handleGoToLogin: () => void;
    handleClickShowPassword: () => void;
    handleClickShowConfirmPassword: () => void;
    handleMouseDownPassword: (e: React.MouseEvent<HTMLButtonElement>) => void;

    // State Setters
    setPassword: (val: string) => void;
    setConfirmPassword: (val: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = (props) => {
    // Destructure all props for easy use
    const {
        password, confirmPassword, showPassword, showConfirmPassword,
        successMsg, errorMsg, loading,
        handleSubmit, handleGoToLogin,
        handleClickShowPassword, handleClickShowConfirmPassword, handleMouseDownPassword,
        setPassword, setConfirmPassword
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
            <Container maxWidth="sm">
                <Paper elevation={6} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 3, textAlign: 'center' }}>
                    
                    <Avatar sx={{ mx: 'auto', mb: 2, bgcolor: 'primary.main', width: 56, height: 56 }}>
                        <LockOutlinedIcon />
                    </Avatar>

                    <Typography component="h1" variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        Set a New Password
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Stack spacing={2.5} alignItems="center">
                            
                            {/* Show success or error messages */}
                            {successMsg && (
                                <Alert severity="success" sx={{ width: '100%', textAlign: 'left' }}>
                                    {successMsg}
                                </Alert>
                            )}
                            {errorMsg && (
                                <Alert severity="error" sx={{ width: '100%', textAlign: 'left' }}>
                                    {errorMsg}
                                </Alert>
                            )}

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="New Password"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                                helperText="Minimum 8 characters"
                                InputProps={{
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
                             <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirm New Password"
                                type={showConfirmPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                disabled={loading}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle confirm password visibility"
                                                onClick={handleClickShowConfirmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading || !!successMsg} // Disable if already successful
                                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                            >
                                {loading ? 'Resetting...' : 'Set New Password'}
                            </Button>

                            <Link
                                component="button"
                                type="button"
                                variant="body2"
                                onClick={handleGoToLogin}
                                sx={{ mt: 2, fontWeight: 500 }}
                            >
                                &larr; Back to Login
                            </Link>

                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default ResetPasswordForm;

