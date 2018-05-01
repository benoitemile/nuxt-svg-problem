<template>
  <div>
    <component :is="component"/>
  </div>
</template>

<script>
// middleware/isMobile.js
import MobileDetect from 'mobile-detect';
const mobile = () => import('~/components/pages/home/mobile.vue');
const desktop = () => import('~/components/pages/home/desktop.vue');

export default {
  middleware: 'ismobile',
  data() {
    return {
      isMobile: null,
      component() {}, // The result from asyncData will be merged with data
    }
  },
  async asyncData(context) {
    return {
      isMobile: context.isMobile,
      component: context.isMobile ? mobile : desktop,
    }
  },
  layout(context) {
    console.log('layout');
    const userAgent = process.server ? context.req.headers['user-agent'] : window.navigator.userAgent;
    const detect = new MobileDetect(userAgent);
    let isMobile = detect.mobile();
    return isMobile ? 'mobile' : 'desktop'; // switching between layouts/mobile and layouts/desktop
  },
  methods: {
    handleWindowResize() {
      this.component =  this.checkSize() ? mobile : desktop;
    },
    checkSize() {
      if (!window) {
        return false;
      }
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
