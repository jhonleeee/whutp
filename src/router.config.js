import ANALIZE from "./components/analize";
import NOTFOUND from "./components/not-found"
import courseTable from "./components/courseTable";
import document from './components/document'
export default {
  routes: [
    { path: '/', redirect: '/analyze' },
    {
      path: '/analyze', component: ANALIZE, meta: {
        keepAlive: true
      }
    },
    {path:'/graph',component:courseTable},
    {path:'/document/:id',component:document},
    { path: '*', component: NOTFOUND }
  ]
};