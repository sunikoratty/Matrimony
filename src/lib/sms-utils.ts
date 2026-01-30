// import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifySid = process.env.TWILIO_SERVICE_SID

// const client = twilio(accountSid, authToken)

/**
 * MOCK OTP: 123456
 * Set this to true to force testing mode even if credentials exist.
 */
const FORCE_MOCK = true

export async function sendOTPCode(mobile: string) {
    if (FORCE_MOCK || !accountSid || !authToken || !verifySid) {
        console.log('--- TEST MODE ---')
        console.log(`OTP for ${mobile} is 123456`)
        console.log('-----------------')
        return { success: true, mock: true }
    }

    /* Commented out for testing
    try {
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: mobile, channel: 'sms' })

        return { success: true, status: verification.status }
    } catch (error: any) {
        console.error('Error sending OTP:', error.message)
        return { success: false, error: error.message }
    }
    */
}

export async function verifyOTPCode(mobile: string, code: string) {
    if (FORCE_MOCK || !accountSid || !authToken || !verifySid) {
        if (code === '123456') return { success: true, mock: true }
        return { success: false, error: 'Invalid OTP. Use 123456 for testing.' }
    }

    /* Commented out for testing
    try {
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: mobile, code: code })

        return { success: verificationCheck.status === 'approved' }
    } catch (error: any) {
        console.error('Error verifying OTP:', error.message)
        return { success: false, error: error.message }
    }
    */
    return { success: false, error: 'Twilio disabled' }
}
