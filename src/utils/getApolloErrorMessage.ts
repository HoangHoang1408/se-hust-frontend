import { ApolloError } from "@apollo/client";

export const getApolloErrorMessage = (err: ApolloError) => {
  const res = err.graphQLErrors[0].extensions.response as {
    message?: string[];
  };
  if (!res || !res.message) return null;
  return res.message[0];
};
