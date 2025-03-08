'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ref, get } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';

type Props = {
  qrId: string; // Expected format: `${eventId}_${username}_${ticketType}`
};

const QRCodeDisplay = ({ qrId }: Props) => {
  const [qrData, setQrData] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const qrRef = ref(realtimeDb, `qrcodes/${qrId}`);
        const snapshot = await get(qrRef);

        if (snapshot.exists()) {
          setQrData(snapshot.val().qrData);
        } else {
          setError('No QR Code Found');
        }
      } catch {
        setError('Error fetching QR code');
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [qrId]);

  if (loading) return <div>Loading QR Code...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-4">Your Ticket QR Code</h3>
      {qrData ? (
        <Image
          src={qrData}
          alt="QR Code"
          width={160} // Adjust size as needed
          height={160}
          className="mx-auto"
        />
      ) : (
        <div>No QR Code Available</div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
