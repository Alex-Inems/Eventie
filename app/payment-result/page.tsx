'use client'
// app/payment-result/page.tsx
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'; // useSearchParams to access query params
import { useRouter } from 'next/navigation';

const PaymentResultPage = () => {
  const searchParams = useSearchParams(); // Get search params from URL
  const status = searchParams.get('status');
  const reference = searchParams.get('reference');
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    if (status && reference) {
      verifyPaymentStatus(reference, status); // Verify payment on page load
    }
  }, [status, reference]);

  const verifyPaymentStatus = async (reference: string, status: string) => {
    try {
      const response = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference, status }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPaymentStatus('success');
      } else {
        setPaymentStatus('failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setPaymentStatus('failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-4xl font-bold mb-4">
        {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
      </h1>
      <p className="text-lg text-gray-600 mb-4">
        {paymentStatus === 'success'
          ? 'Your payment was successful. Thank you for your purchase!'
          : 'Unfortunately, the payment failed. Please try again.'}
      </p>

      {paymentStatus === 'success' && (
        <button
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 mt-8"
          onClick={() => alert('You can now access your tickets or content!')}
        >
          Access Your Tickets/Content
        </button>
      )}

      {paymentStatus === 'failed' && (
        <button
          className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 mt-8"
          onClick={() => router.push(`/dashboard/organizer`)} 
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default PaymentResultPage;
