// Utility function to convert technical errors to user-friendly messages
export const getFriendlyErrorMessage = (error) => {
    // Handle different error types
    const errorMessage = error?.data?.message || error?.message || error?.reason || String(error);

    // Common error patterns and their user-friendly versions
    const errorPatterns = {
        // Connection errors
        'user rejected': 'Transaction was cancelled. Please try again when ready.',
        'user denied': 'Transaction was cancelled. Please try again when ready.',
        'rejected': 'Transaction was rejected. Please try again.',

        // Network errors
        'network': 'Network connection issue. Please check your internet and try again.',
        'timeout': 'Transaction timed out. Please try again.',
        'nonce': 'Transaction conflict detected. Please refresh and try again.',

        // Insufficient funds
        'insufficient funds': 'Insufficient funds in your wallet. Please add more tokens.',
        'insufficient balance': 'Insufficient balance. Please check your wallet.',
        'exceeds balance': 'Amount exceeds your available balance.',

        // Gas errors
        'gas required exceeds': 'Transaction requires too much gas. Try reducing the amount.',
        'out of gas': 'Insufficient gas. Please increase gas limit.',
        'gas too low': 'Gas price too low. Please increase and try again.',

        // Contract/Pool errors
        'zero liquidity': 'The liquidity pool is empty. Please add liquidity first.',
        'insufficient liquidity': 'Not enough liquidity in the pool for this swap.',
        'insufficient output amount': 'Slippage too high. Try increasing slippage tolerance or reducing amount.',
        'insufficient input amount': 'Amount too small for this swap. Please increase the amount.',
        'expired': 'Transaction expired. Please try again.',
        'deadline': 'Transaction deadline passed. Please try again.',

        // Token approval errors
        'allowance': 'Token approval failed. Please approve the token and try again.',
        'approve': 'Failed to approve tokens. Please try again.',

        // Slippage errors
        'excessive slippage': 'Price changed too much. Increase slippage tolerance or try again.',
        'price impact': 'Price impact too high. Consider reducing your swap amount.',

        // Smart contract errors
        'execution reverted': 'Transaction failed. Please check your inputs and try again.',
        'revert': 'Transaction was reverted. Please verify all details and try again.',
        'invalid': 'Invalid transaction. Please check your inputs.',

        // Wallet errors
        'not connected': 'Wallet not connected. Please connect your wallet first.',
        'wrong network': 'Wrong network. Please switch to the correct network.',
        'unsupported chain': 'This network is not supported. Please switch networks.',

        // General errors
        'failed': 'Transaction failed. Please try again.',
        'error': 'An error occurred. Please try again.',
    };

    // Check for pattern matches
    const lowerErrorMessage = errorMessage.toLowerCase();

    for (const [pattern, friendlyMessage] of Object.entries(errorPatterns)) {
        if (lowerErrorMessage.includes(pattern)) {
            return friendlyMessage;
        }
    }

    // If no pattern matches, return a generic friendly message
    if (errorMessage.length > 100) {
        return 'Transaction failed. Please check your inputs and try again.';
    }

    return errorMessage;
};

// Success messages
export const successMessages = {
    swap: 'Swap successful! Your tokens have been exchanged.',
    provide: 'Liquidity added successfully! You can now earn fees.',
    withdraw: 'Withdrawal successful! Tokens returned to your wallet.',
    approve: 'Token approved successfully!',
};

// Warning messages
export const warningMessages = {
    connectWallet: 'Please connect your wallet to continue.',
    invalidAmount: 'Please enter a valid amount.',
    insufficientBalance: 'Insufficient balance for this transaction.',
    emptyPool: 'The pool is empty. Be the first to add liquidity!',
};
