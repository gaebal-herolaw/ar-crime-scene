const QRCode = require('qrcode');
const path = require('path');

const URL = 'https://gaebal-herolaw.github.io/ar-crime-scene/';

QRCode.toFile(path.join(__dirname, 'public', 'qr-code.png'), URL, {
  width: 512,
  margin: 2,
  color: { dark: '#000000', light: '#ffffff' },
}, (err) => {
  if (err) throw err;
  console.log('QR code saved: public/qr-code.png');
  console.log('URL:', URL);
});
