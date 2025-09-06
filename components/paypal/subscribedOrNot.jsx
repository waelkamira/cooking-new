'use client';
import { useContext, useState, useEffect, useCallback } from 'react';
import CurrentUser from '../CurrentUser';
import { inputsContext } from '../Context';

export default function SubscribedOrNot() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const user = CurrentUser();
  const { dispatch } = useContext(inputsContext);

  // Check subscription status
  const checkSubscriptionStatus = useCallback((startDate, daysLimit) => {
    if (!startDate) return false;
    
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= daysLimit;
  }, []);

  // Update user subscription in database
  const updateUserSubscription = useCallback(async () => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...user,
          monthly_subscribed: false,
          yearly_subscribed: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update subscription status');
      }
      
      console.log('Subscription status updated successfully');
    } catch (error) {
      console.error('Error updating subscription status:', error);
    }
  }, [user]);

  useEffect(() => {
    // Function to determine subscription status
    const determineSubscriptionStatus = () => {
      if (!user) return;
      
      const monthlyActive = user.monthly_subscribed && 
        checkSubscriptionStatus(user.monthly_subscribed_date, 30);
      
      const yearlyActive = user.yearly_subscribed && 
        checkSubscriptionStatus(user.yearly_subscribed_date, 365);
      
      setIsSubscribed(monthlyActive || yearlyActive);
      
      // If subscription has expired, update user status
      if ((user.monthly_subscribed && !monthlyActive) || 
          (user.yearly_subscribed && !yearlyActive)) {
        updateUserSubscription();
      }
    };
    
    determineSubscriptionStatus();
  }, [user, checkSubscriptionStatus, updateUserSubscription]);

  return isSubscribed;
}