import {
    onCurrentUserSubscriptionUpdate,
    Subscription,
  } from '@stripe/firestore-stripe-payments'
  import { User } from 'firebase/auth'
  import { useEffect, useState } from 'react'
  import payments from '../lib/stripe'
import { db } from '@/firebase'
import {  collection, onSnapshot, query, where } from 'firebase/firestore'
  
  function useSubscription(user: User | null) {
    const [subscription, setSubscription] = useState<Subscription | null>(null)
  
    useEffect(() => {
        
      if (!user) return
      const subscriptionsRef = collection(db, 'customers', user.uid, 'subscriptions');

      const q = query(subscriptionsRef, where('status', 'in', ['trialing', 'active']));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const subscriptions = snapshot.docs.filter(
            (subscription) =>

                subscription.data().status === 'active' ||
                        subscription.data().status === 'trialing'
          
          );
 
      if(subscriptions.length > 0){
        
        setSubscription(subscriptions[0].data())
      }
        // 
      
      });
    }, [user])
  
    return subscription
  }
  
  export default useSubscription