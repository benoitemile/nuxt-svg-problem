// middleware/isMobile.js
import MobileDetect from 'mobile-detect';

export default function (context) {
  console.log('middleware');
  const userAgent = process.server ? context.req.headers['user-agent'] : window.navigator.userAgent;
  const detect = new MobileDetect(userAgent);
  context.isMobile = detect.mobile();
}