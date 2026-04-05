import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/session";

export default async function LoginLayout({ children }) {
  const session = await getAuthSession();
  if (session?.user) {
    redirect("/dashboard");
  }
  return children;
}
