import LandingPageContent from '@/components/landing/LandingPageContent'
import { getProfile } from '@/lib/user-actions'
import { getPublicProfiles } from '@/lib/match-actions'

export default async function Home() {
    const user = await getProfile()
    const brides = await getPublicProfiles('FEMALE', 10, true)
    const grooms = await getPublicProfiles('MALE', 10, true)

    return (
        <LandingPageContent
            user={user ? JSON.parse(JSON.stringify(user)) : null}
            brides={brides ? JSON.parse(JSON.stringify(brides)) : []}
            grooms={grooms ? JSON.parse(JSON.stringify(grooms)) : []}
        />
    )
}
