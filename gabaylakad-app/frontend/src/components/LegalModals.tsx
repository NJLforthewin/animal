import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    CircularProgress,
    Typography,
    Link // Import Link for styling markdown links
} from '@mui/material';
// Import ReactMarkdown
import ReactMarkdown from 'react-markdown';

interface LegalModalsProps {
    apiUrl?: string;
    openTerms: boolean;
    openPrivacy: boolean;
    onCloseTerms: () => void;
    onClosePrivacy: () => void;
}

// --- Component Styles for Markdown ---
// Define some basic styles for markdown elements using MUI's system
const markdownComponents = {
    h1: (props: any) => <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mt: 3, mb: 1 }} {...props} />,
    h2: (props: any) => <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 2.5, mb: 0.5 }} {...props} />,
    h3: (props: any) => <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mt: 2 }} {...props} />,
    p: (props: any) => <Typography variant="body2" paragraph sx={{ lineHeight: 1.6 }} {...props} />,
    ul: (props: any) => <Box component="ul" sx={{ pl: 3, mb: 2 }} {...props} />,
    ol: (props: any) => <Box component="ol" sx={{ pl: 3, mb: 2 }} {...props} />,
    li: (props: any) => <Typography component="li" variant="body2" sx={{ mb: 0.5 }} {...props} />,
    a: (props: any) => <Link target="_blank" rel="noopener noreferrer" {...props} />, // Style links
    strong: (props: any) => <Typography component="strong" sx={{ fontWeight: 'bold' }} {...props} />, // Style bold text
    em: (props: any) => <Typography component="em" sx={{ fontStyle: 'italic' }} {...props} />, // Style italic text
};
// --- End Component Styles ---


const LegalModals: React.FC<LegalModalsProps> = ({
    apiUrl = process.env.REACT_APP_API_URL || '/api',
    openTerms,
    openPrivacy,
    onCloseTerms,
    onClosePrivacy
}) => {
    // State for Terms Modal
    const [termsSummary, setTermsSummary] = useState<string | null>(null);
    const [termsFull, setTermsFull] = useState<string | null>(null);
    const [showFullTerms, setShowFullTerms] = useState(false);
    const [loadingTermsSummary, setLoadingTermsSummary] = useState(false);
    const [loadingTermsFull, setLoadingTermsFull] = useState(false);

    // State for Privacy Modal
    const [privacySummary, setPrivacySummary] = useState<string | null>(null);
    const [privacyFull, setPrivacyFull] = useState<string | null>(null);
    const [showFullPrivacy, setShowFullPrivacy] = useState(false);
    const [loadingPrivacySummary, setLoadingPrivacySummary] = useState(false);
    const [loadingPrivacyFull, setLoadingPrivacyFull] = useState(false);

    // Fetch Terms Summary when modal opens
    useEffect(() => {
        if (openTerms && !termsSummary && !loadingTermsSummary) {
            const fetchSummary = async () => {
                setLoadingTermsSummary(true);
                setShowFullTerms(false);
                setTermsFull(null);
                try {
                    const res = await fetch(`${apiUrl}/api/legal/terms-summary`);
                    if (!res.ok) throw new Error('Failed to fetch terms summary');
                    const text = await res.text();
                    setTermsSummary(text);
                } catch(error) {
                    console.error("Error fetching terms summary:", error);
                    setTermsSummary('# Error\n\nUnable to load summary.');
                } finally {
                    setLoadingTermsSummary(false);
                }
            };
            fetchSummary();
        }
    }, [openTerms, termsSummary, loadingTermsSummary, apiUrl]);

    // Fetch Terms Full when requested
    const handleShowFullTerms = async () => {
        setShowFullTerms(true);
        if (!termsFull && !loadingTermsFull) {
             setLoadingTermsFull(true);
             try {
                const res = await fetch(`${apiUrl}/api/legal/terms`);
                if (!res.ok) throw new Error('Failed to fetch full terms');
                const text = await res.text();
                setTermsFull(text);
            } catch(error) {
                 console.error("Error fetching full terms:", error);
                setTermsFull('# Error\n\nUnable to load full document.');
            } finally {
                 setLoadingTermsFull(false);
            }
        }
    };

     // Fetch Privacy Summary when modal opens
    useEffect(() => {
        if (openPrivacy && !privacySummary && !loadingPrivacySummary) {
            const fetchSummary = async () => {
                setLoadingPrivacySummary(true);
                setShowFullPrivacy(false);
                setPrivacyFull(null);
                try {
                    const res = await fetch(`${apiUrl}/api/legal/privacy-summary`);
                     if (!res.ok) throw new Error('Failed to fetch privacy summary');
                    const text = await res.text();
                    setPrivacySummary(text);
                } catch(error) {
                    console.error("Error fetching privacy summary:", error);
                    setPrivacySummary('# Error\n\nUnable to load summary.');
                } finally {
                    setLoadingPrivacySummary(false);
                }
            };
            fetchSummary();
        }
    }, [openPrivacy, privacySummary, loadingPrivacySummary, apiUrl]);

    // Fetch Privacy Full when requested
    const handleShowFullPrivacy = async () => {
        setShowFullPrivacy(true);
         if (!privacyFull && !loadingPrivacyFull) {
            setLoadingPrivacyFull(true);
             try {
                const res = await fetch(`${apiUrl}/api/legal/privacy`);
                 if (!res.ok) throw new Error('Failed to fetch full privacy policy');
                const text = await res.text();
                setPrivacyFull(text);
            } catch(error) {
                 console.error("Error fetching full privacy policy:", error);
                setPrivacyFull('# Error\n\nUnable to load full document.');
            } finally {
                setLoadingPrivacyFull(false);
            }
        }
    };

    // Helper to render content or loading indicator
    const renderContent = (summary: string | null, full: string | null, showFull: boolean, loadingSummary: boolean, loadingFull: boolean) => {
        const textToRender = showFull ? full : summary;
        const isLoading = showFull ? loadingFull : loadingSummary;

        if (isLoading) {
            return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
        }
        if (!textToRender) {
             return <Typography>Loading...</Typography>; // Initial state before fetch starts
        }
        // Use ReactMarkdown to render the fetched text
        return <ReactMarkdown components={markdownComponents}>{textToRender}</ReactMarkdown>;
    };


    return (
        <>
            {/* Terms Modal */}
            <Dialog open={openTerms} onClose={onCloseTerms} maxWidth="md" fullWidth scroll="paper">
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>Terms and Conditions</DialogTitle>
                <DialogContent dividers sx={{ bgcolor: 'grey.50' }}> {/* Added subtle background */}
                   {renderContent(termsSummary, termsFull, showFullTerms, loadingTermsSummary, loadingTermsFull)}
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: 'divider', px: 3, py: 2 }}> {/* Added padding */}
                    {!showFullTerms ? (
                        <Button onClick={handleShowFullTerms} disabled={loadingTermsSummary || loadingTermsFull || !termsSummary}>
                            View Full Document
                        </Button>
                    ) : (
                         <Button onClick={() => setShowFullTerms(false)} disabled={loadingTermsSummary || loadingTermsFull}>
                            Show Summary
                        </Button>
                    )}
                    <Button onClick={onCloseTerms} variant="outlined">Close</Button> {/* Styled Close button */}
                </DialogActions>
            </Dialog>

            {/* Privacy Modal */}
            <Dialog open={openPrivacy} onClose={onClosePrivacy} maxWidth="md" fullWidth scroll="paper">
                <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>Privacy Policy</DialogTitle>
                 <DialogContent dividers sx={{ bgcolor: 'grey.50' }}> {/* Added subtle background */}
                    {renderContent(privacySummary, privacyFull, showFullPrivacy, loadingPrivacySummary, loadingPrivacyFull)}
                </DialogContent>
                <DialogActions sx={{ borderTop: 1, borderColor: 'divider', px: 3, py: 2 }}> {/* Added padding */}
                     {!showFullPrivacy ? (
                        <Button onClick={handleShowFullPrivacy} disabled={loadingPrivacySummary || loadingPrivacyFull || !privacySummary}>
                            View Full Document
                        </Button>
                    ) : (
                         <Button onClick={() => setShowFullPrivacy(false)} disabled={loadingPrivacySummary || loadingPrivacyFull}>
                            Show Summary
                        </Button>
                    )}
                    <Button onClick={onClosePrivacy} variant="outlined">Close</Button> {/* Styled Close button */}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LegalModals;

