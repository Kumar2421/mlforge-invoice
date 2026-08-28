import InviteAcceptance from "@/components/InviteAcceptance";

export default async function InvitePage({ params }: PageProps<"/invite/[token]">) {
  const { token } = await params;
  return <InviteAcceptance token={token} />;
}
