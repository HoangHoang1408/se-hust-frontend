const a = {
  client: {
    excludes: ["**/graphql/generated/*"],
    service: {
      name: "my-graphql-app",
      url: "http://localhost:4000/graphql",
    },
  },
};
module.exports = a;
