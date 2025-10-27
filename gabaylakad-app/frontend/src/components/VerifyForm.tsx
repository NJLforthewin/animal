import React from 'react';
import {
    Container,
    Paper,
    Box,
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
    Alert
} from '@mui/material';

// Define the props this component will accept
export interface VerifyFormProps {
    code: string;
    message: string;
    isVerifying: boolean;
    isVerified: boolean;
    errorMsg: string; // Separate error message for clarity
    
    handleVerify: (e: React.FormEvent) => void;
    setCode: (value: string) => void;
}

const VerifyForm: React.FC<VerifyFormProps> = (props) => {
    const {
        code,
        message,
        isVerifying,
        isVerified,
        errorMsg,
        handleVerify,
        setCode
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
                    
                    <Typography component="h1" variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
                        Account Verification
                    </Typography>

                    {!isVerified && (
                        <Typography variant="h6" component="p" sx={{ mb: 3, color: 'text.secondary' }}>
                            {message}
                        </Typography>
                    )}

                    {isVerified && (
                         <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
                            {message}
                        </Alert>
                    )}

                    {errorMsg && (
                        <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
                            {errorMsg}
                        </Alert>
                    )}

                    {!isVerified && (
                        <Box component="form" onSubmit={handleVerify} noValidate sx={{ mt: 1 }}>
                            <Stack spacing={2.5} alignItems="center">
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Verification Code"
                                    name="code"
                                    autoFocus
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    disabled={isVerifying}
                                    inputProps={{
                                        maxLength: 6,
                                        style: { textAlign: 'center', fontSize: '1.25rem', letterSpacing: '0.5rem' }
                                    }}
                                    placeholder="------"
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isVerifying}
                                    sx={{ py: 1.5, textTransform: 'none', fontSize: '1rem', fontWeight: 600 }}
                                    startIcon={isVerifying ? <CircularProgress size={24} color="inherit" /> : null}
                                >
                                    {isVerifying ? 'Verifying...' : 'Verify'}
                                </Button>
                            </Stack>
                        </Box>
                    )}

                </Paper>
            </Container>
        </Box>
    );
};

export default VerifyForm;
