export default {
  endpoint: {
    users: "/service/identity/v1/users/users",
    deleteUser: "/service/identity/v1/users/users/",
    userIdentity: "/service/identity/v1/users/users/**",
  },
  path: {
    user: "/user/#/users",
    me:"/user/#/users/me"
  },
};
