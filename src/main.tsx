import { createRoot } from 'react-dom/client';
import { CustomerApp } from './components/CustomerApp.tsx';
import './index.css';

const params = new URLSearchParams(window.location.search);
const tableToken = params.get('t');

function InvalidLink() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif', textAlign: 'center', padding: 24 }}>
      <div>
        <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Link tidak valid</p>
        <p style={{ fontSize: 14, color: '#8E8E93' }}>Silakan scan ulang QR code yang ada di meja Anda.</p>
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  tableToken ? <CustomerApp token={tableToken} /> : <InvalidLink />
);
