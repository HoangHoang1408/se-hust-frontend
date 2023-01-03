import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../apollo/reactiveVar/loginStatusVar";

type Props = {};

const NormalUserHomePage = (props: Props) => {
  const user = useReactiveVar(userVar);
  console.log(user);
  return <div>NormalUserHomePage</div>;
};

export default NormalUserHomePage;
