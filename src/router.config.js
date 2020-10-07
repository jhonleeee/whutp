import ANALIZE from "./components/analize";
import NOTFOUND from "./components/not-found"
import IFRAMEBROWSER from "./components/iframe-browser"
export default {
  routes: [
    { path: '/iframe', component: IFRAMEBROWSER },
    {
      path: '/', component: ANALIZE, meta: {
        keepAlive: true
      }
    },
    { path: '*', component: NOTFOUND }
  ]
};