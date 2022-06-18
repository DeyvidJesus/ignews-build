// AUTENTICAÇÃO
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// SERVIÇOS
import { api } from '../../services/api'
import { getStripeJs } from '../../services/stripe-js'

// ESTILOS
import styles from './styles.module.scss'


export function SubscribeButton () {
    const {data: session} = useSession()
    const router = useRouter()

    async function handleSubscribe() {
        if(!session) {
            signIn('github')
            return
        }

        if(session.activeSubscription) {
            router.push('/posts')
            return
        }

        try {
            const response = await api.post('/subscribe')

            const {sessionId} = response.data

            console.log(response.data, 'OIII')

            const stripe = await getStripeJs()
            
            await stripe.redirectToCheckout({sessionId: sessionId})

        } catch (err) {
            alert(err.message)
        }
    }

    return (
        <button 
            type="button"
            className={styles['subscribeButton']}
            onClick={handleSubscribe}
        >
            Subscribe Now
        </button>
    )
}