import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifySid = process.env.TWILIO_SERVICE_SID

const client = twilio(accountSid, authToken)

/**
 * MOCK OTP: 123456
 * Set this to true to force testing mode even if credentials exist.
 */
const FORCE_MOCK = true

// Numbers that are allowed to bypass real SMS (handy for trial accounts or testing)
const BYPASS_NUMBERS = [
    '+15199036561', // Canada number from screenshot
]

export async function sendOTPCode(mobile: string) {
    if (FORCE_MOCK || !accountSid || !authToken || !verifySid) {
        console.log('--- TEST MODE ---')
        console.log(`OTP for ${mobile} is 123456`)
        console.log('-----------------')
        return { success: true, mock: true }
    }

    // Proactive bypass for specific numbers
    if (BYPASS_NUMBERS.includes(mobile)) {
        console.log(`--- BYPASS MODE for ${mobile} ---`)
        return { success: true, mock: true }
    }

    try {
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: mobile, channel: 'sms' })

        return { success: verification.status === 'pending' }
    } catch (error: any) {
        console.error('Error sending OTP:', error.message)

        // Handle Twilio Trial account restriction (error code 21608)
        // This allows the user to still log in using the mock code even if the SMS fails due to trial limits
        if (error.code === 21608 || error.message?.includes('unverified')) {
            console.log(`--- TRIAL BYPASS triggered for ${mobile} ---`)
            return { success: true, mock: true }
        }

        return { success: false, error: error.message }
    }
}

export async function verifyOTPCode(mobile: string, code: string) {
    // 1. Check for missing credentials or force mock
    if (FORCE_MOCK || !accountSid || !authToken || !verifySid) {
        if (code === '123456') return { success: true, mock: true }
        return { success: false, error: 'Twilio disabled or credentials missing. Use 123456.' }
    }

    // 2. Proactive bypass for specific numbers
    if (BYPASS_NUMBERS.includes(mobile) && code === '123456') {
        return { success: true, mock: true }
    }

    try {
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: mobile, code: code })

        return { success: verificationCheck.status === 'approved' }
    } catch (error: any) {
        console.error('Error verifying OTP:', error.message)

        // Secondary fallback for bypass numbers if Twilio API fails
        if (BYPASS_NUMBERS.includes(mobile) && code === '123456') {
            return { success: true, mock: true }
        }

        return { success: false, error: error.message }
    }
}
