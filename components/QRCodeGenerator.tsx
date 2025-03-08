'use client';

import QRCode from 'react-qr-code';

import { ref, set } from 'firebase/database';
import { realtimeDb } from '@/firebaseConfig';

type QRCodeProps = {
  data: string;
  eventId: string;
  ticketType: string;
  username: string;
};

const QRCodeGenerator = ({ data, eventId, ticketType, username }: QRCodeProps) => {
  const saveQRCode = async () => {
    const qrRef = ref(realtimeDb, `qrcodes/${eventId}_${username}_${ticketType}`);
    await set(qrRef, { qrData: data, username, ticketType, eventId });
    console.log('QR code saved successfully');
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('svg') as SVGElement;
    if (!svg) return;
  
    const serializer = new XMLSerializer();
    const svgData = serializer.serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
  
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
  
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `${eventId}_${username}_${ticketType}_QRCode.png`;
      link.click();
    };
  
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };
  
  
  saveQRCode();

  return (
    <div className="mt-6 text-center">
      <h3 className="text-lg font-semibold mb-4">Your Ticket QR Code</h3>
      <QRCode value={data} size={150} />
      <div className="mt-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={downloadQRCode}
        >
          Download QR Code
        </button>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
