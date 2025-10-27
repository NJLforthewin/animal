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
    InputAdornment
} from '@mui/material';

// Import MUI Icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';

// Define the "contract" of props this component expects
export interface ForgotPasswordFormProps {
    // State Values
    email: string;
    successMsg: string;
    errorMsg: string;
    previewUrl: string;
    loading: boolean;

    // Event Handlers
    handleSubmit: (e: React.FormEvent) => void;
    handleGoToLogin: () => void;

    // State Setters
    setEmail: (val: string) => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = (props) => {
    // Destructure all props for easy use
    const {
        email,
        successMsg,
        errorMsg,
        previewUrl,
        loading,
        handleSubmit,
        handleGoToLogin,
        setEmail
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
                        Forgot Your Password?
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        No problem. Enter your email below and we'll send you a link to reset it.
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

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                                startIcon={loading ? <CircularProgress size={24} color="inherit" /> : null}
                            >
                                {loading ? 'Sending Link...' : 'Send Reset Link'}
                            </Button>

                            {/* Link for Ethereal email preview (dev only) */}
                            {previewUrl && (
                                <Link href={previewUrl} target="_blank" rel="noopener noreferrer" variant="body2">
                                    View Ethereal test email (Dev)
                                </Link>
                            )}

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

export default ForgotPasswordForm;
