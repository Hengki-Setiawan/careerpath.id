// Midtrans Integration Helper
// Docs: https://docs.midtrans.com/reference/api-reference

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || ''
const MIDTRANS_CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY || ''
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true'

const BASE_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/v1'
    : 'https://app.sandbox.midtrans.com/snap/v1'

export const MIDTRANS_SNAP_URL = IS_PRODUCTION
    ? 'https://app.midtrans.com/snap/snap.js'
    : 'https://app.sandbox.midtrans.com/snap/snap.js'

export { MIDTRANS_CLIENT_KEY }

export interface MidtransTransactionParams {
    orderId: string
    grossAmount: number
    customerName: string
    customerEmail: string
    itemName: string
    itemId: string
    itemPrice: number
    itemQuantity: number
}

export async function createTransaction(params: MidtransTransactionParams) {
    const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')

    const payload = {
        transaction_details: {
            order_id: params.orderId,
            gross_amount: params.grossAmount
        },
        item_details: [{
            id: params.itemId,
            price: params.itemPrice,
            quantity: params.itemQuantity,
            name: params.itemName
        }],
        customer_details: {
            first_name: params.customerName,
            email: params.customerEmail
        },
        callbacks: {
            finish: `${process.env.NEXT_PUBLIC_APP_URL || 'https://careerpath.id'}/dashboard/settings?payment=success`
        }
    }

    const response = await fetch(`${BASE_URL}/transactions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Midtrans error: ${response.status} - ${errorText}`)
    }

    return response.json()
}

export async function getTransactionStatus(orderId: string) {
    const auth = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64')
    const apiUrl = IS_PRODUCTION
        ? 'https://api.midtrans.com/v2'
        : 'https://api.sandbox.midtrans.com/v2'

    const response = await fetch(`${apiUrl}/${orderId}/status`, {
        headers: {
            'Authorization': `Basic ${auth}`,
            'Accept': 'application/json'
        }
    })

    return response.json()
}

// Verify Midtrans notification webhook signature
export function verifySignature(orderId: string, statusCode: string, grossAmount: string, serverKey: string): string {
    // SHA512(order_id + status_code + gross_amount + server_key)
    const crypto = require('crypto')
    return crypto.createHash('sha512')
        .update(orderId + statusCode + grossAmount + serverKey)
        .digest('hex')
}
