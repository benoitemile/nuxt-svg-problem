<template>
  <div>
    <pre>{{ isMobile }}</pre>
    <pre>{{ component }}</pre>
    <component :is="component"/>
  </div>
</template>

<script>
// middleware/isMobile.js
import MobileDetect from 'mobile-detect';
const mobile = () => import('~/components/pages/home/mobile.vue');
const desktop = () => import('~/components/pages/home/desktop.vue');

function checkUserAgent(context) {
  const userAgent = process.server ? context.req.headers['user-agent'] : window.navigator.userAgent;
  const detect = new MobileDetect(userAgent);
  return detect.mobile();
}

export default {
  data() {
    return {
      isMobile() {},
      component() {}, // The result from asyncData will be merged with data
    }
  },
  async asyncData(context) {
    return {
      isMobile: checkUserAgent(context) ? 'mobile' : 'desktop',
      component: checkUserAgent(context) ? mobile : desktop,
    }
  },
  layout(context) {
    const isMobile = checkUserAgent(context);
    return isMobile ? 'mobile' : 'desktop'; // switching between layouts/mobile and layouts/desktop
  },
  methods: {
    handleWindowResize() {
      this.isMobile = this.checkWindowSize() ? 'mobile' : 'desktop',
      this.component = this.checkWindowSize() ? mobile : desktop;
    },
    checkWindowSize() {
      let isMobile;
      if (window.screen.availWidth < 768) {
        isMobile = true;
      } else {
        isMobile = false;
      }
      return isMobile;
    },
  },
  created () {
    if (process.client) {
      window.addEventListener('resize', this.handleWindowResize);
    }
  },
  destroyed () {
    if (process.client) {
      window.removeEventListener('resize', this.handleWindowResize);
    }
  }
}
</script>

<style>
body {
  font-size: 100px;
}
</style>
