import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const verifySid = process.env.TWILIO_SERVICE_SID

const client = twilio(accountSid, authToken)

export async function sendOTPCode(mobile: string) {
    if (!accountSid || !authToken || !verifySid) {
        console.warn('Twilio credentials missing. Logging OTP to console.')
        console.log(`OTP for ${mobile} is 123456 (MOCK)`)
        return { success: true, mock: true }
    }

    try {
        const verification = await client.verify.v2.services(verifySid)
            .verifications
            .create({ to: mobile, channel: 'sms' })

        return { success: true, status: verification.status }
    } catch (error: any) {
        console.error('Error sending OTP:', error.message)
        return { success: false, error: error.message }
    }
}

export async function verifyOTPCode(mobile: string, code: string) {
    if (!accountSid || !authToken || !verifySid) {
        if (code === '123456') return { success: true, mock: true }
        return { success: false, error: 'Invalid mock OTP' }
    }

    try {
        const verificationCheck = await client.verify.v2.services(verifySid)
            .verificationChecks
            .create({ to: mobile, code: code })

        return { success: verificationCheck.status === 'approved' }
    } catch (error: any) {
        console.error('Error verifying OTP:', error.message)
        return { success: false, error: error.message }
    }
}
