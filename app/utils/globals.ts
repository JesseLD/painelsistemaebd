import { getServerSession } from "next-auth";

export const Globals = {
  loggedUserEmail: '',

}
export const getServerSession1 = async () => {
  const session = await getServerSession();
  if (!session) {
    return null;
  }
  Globals.loggedUserEmail = session?.user?.email || "Error";
  return session;
};
