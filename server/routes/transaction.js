const express = require('express');
const router = express.Router();
const { TonClient } = require('@ton/ton');
const { Address } = require('@ton/core');
const User = require('../models/User');

// Move these to environment variables
const REQUIRED_AMOUNT = '100000000'; // 0.1 TON in nanotons
const WALLET_ADDRESS = process.env.TON_WALLET_ADDRESS;
const BONUS_AMOUNT = 10000;

const client = new TonClient({
    endpoint: process.env.TON_ENDPOINT || 'https://toncenter.com/api/v2/jsonRPC',
    apiKey: process.env.TON_API_KEY
});

// New endpoint to get transaction details
router.get('/get-transaction-details', async (req, res) => {
    try {
        const { telegramId } = req.query;

        // Verify user exists and hasn't completed task
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.tonTasks) {
            return res.status(400).json({
                success: false,
                message: 'Task already completed'
            });
        }

        // Generate transaction details
        const transactionDetails = {
            validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
            messages: [
                {
                    address: WALLET_ADDRESS,
                    amount: REQUIRED_AMOUNT,
                }
            ]
        };

        return res.status(200).json({
            success: true,
            data: transactionDetails
        });
    } catch (error) {
        console.error('Error generating transaction details:', error);
        return res.status(500).json({
            success: false,
            message: 'Error generating transaction details'
        });
    }
});

const verifyTransaction = async (transactionHash) => {
    try {
        const transaction = await client.getTransaction({
            hash: transactionHash
        });

        if (!transaction) {
            throw new Error('Transaction not found');
        }

        const recipient = transaction.in_msg.destination;
        if (recipient.toString() !== WALLET_ADDRESS) {
            throw new Error('Invalid recipient address');
        }

        const amount = transaction.in_msg.value.toString();
        if (amount < REQUIRED_AMOUNT) {
            throw new Error('Insufficient transaction amount');
        }

        return true;
    } catch (error) {
        console.error('Transaction verification error:', error);
        throw error;
    }
};

router.post('/verify-ton-transaction', async (req, res) => {
    try {
        const { telegramId, transactionHash } = req.body;

        if (!telegramId || !transactionHash) {
            return res.status(400).json({
                success: false,
                message: 'Missing required parameters'
            });
        }

        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.tonTasks) {
            return res.status(400).json({
                success: false,
                message: 'Task already completed'
            });
        }

        await verifyTransaction(transactionHash);

        const updatedUser = await User.findOneAndUpdate(
            { telegramId },
            {
                $set: { tonTasks: true },
                $inc: {
                    balance: BONUS_AMOUNT,
                    taskPoints: 1,
                    tonTransactions: 1
                }
            },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: 'Transaction verified and rewards credited',
            data: {
                balance: updatedUser.balance,
                taskPoints: updatedUser.taskPoints,
                tonTasks: updatedUser.tonTasks,
                tonTransactions: updatedUser.tonTransactions
            }
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error during transaction verification'
        });
    }
});

module.exports = router;