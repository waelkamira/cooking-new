'use client';
import { loadScript } from '@paypal/paypal-js';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import CurrentUser from '../CurrentUser';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { inputsContext } from '../Context';
import PaymentSuccess from '../../app/payment-success/page';

const PayPalButton = ({ plan }) => {
  const user = CurrentUser();
  const router = useRouter();
  const { dispatch, rerender } = useContext(inputsContext);
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    const container = document.getElementById('paypal-button-container');
    
    if (window.paypal && container) {
      window.paypal.Buttons({
        createOrder: function(data, actions) {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: plan.price.toString()
              }
            }]
          });
        },
        onApprove: function(data, actions) {
          return actions.order.capture().then(function(details) {
            setSuccess(true);
            // تحديث حالة الاشتراك للمستخدم
            updateSubscriptionStatus();
          });
        }
      }).render('#paypal-button-container');
    }
  }, [plan, rerender]);

  useEffect(() => {
    handlePlanPrice(plan?.price);
  }, [plan?.price, rerender]);
  
  // هذه الدالة لتخزين قيمة الخطة المدفوعة
  async function handlePlanPrice(price) {
    if (!user || !price) return;
    
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...user,
        plan_price: price
      }),
    });
  }
  
  // تحديث حالة الاشتراك بعد الدفع الناجح
  async function updateSubscriptionStatus() {
    if (!user || !plan) return;
    
    const subscriptionField = plan.subscription_period === 30 ? 'monthly_subscribed' : 'yearly_subscribed';
    const subscriptionDateField = plan.subscription_period === 30 ? 'monthly_subscribed_date' : 'yearly_subscribed_date';
    
    const response = await fetch('/api/user', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...user,
        [subscriptionField]: true,
        [subscriptionDateField]: new Date().toISOString(),
        plan_price: plan.price
      }),
    });
    
    if (response.ok) {
      dispatch({ type: 'RERENDER' });
      router.refresh();
    }
  }

  return (
    <div>
      <div id="paypal-button-container" className="paypal-container">
        {' '}
      </div>
      {success && <PaymentSuccess plan={plan} />}
    </div>
  );
};

export default PayPalButton;