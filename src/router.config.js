import ANALIZE from "./components/analize";
import NOTFOUND from "./components/not-found"
import courseTable from "./components/courseTable";
export default {
  routes: [
    {
      path: '/analyze', component: ANALIZE, meta: {
        keepAlive: true
      }
    },
    {path:'/graph',component:courseTable},
    { path: '*', component: NOTFOUND }
  ]
};