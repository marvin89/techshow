export default [{
    path: "/slide-1",
    component: "slide-1",
    action: () => import("./slide-1.js"),
  },{
    path: "/slide-2",
    component: "slide-2",
    action: () => import("./slide-2.js"),
  },{ path: "(.*)", redirect: "/slide-1" }];