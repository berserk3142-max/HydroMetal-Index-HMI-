import { auth } from "@/lib/auth";
import { db } from "@/db";
import { meetings, agents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MeetingRoom } from "@/modules/meetings/ui/components/meeting-room";

interface Props {
  params: Promise<{ meetingId: string }>;
}

const MeetingIdPage = async ({ params }: Props) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  // Fetch meeting with agent info
  const [meeting] = await db
    .select({
      id: meetings.id,
      name: meetings.name,
      status: meetings.status,
      agentId: meetings.agentId,
      agentName: agents.name,
      agentInstructions: agents.instructions,
    })
    .from(meetings)
    .innerJoin(agents, eq(meetings.agentId, agents.id))
    .where(
      and(
        eq(meetings.id, meetingId),
        eq(meetings.userId, session.user.id)
      )
    );

  if (!meeting) {
    redirect("/meetings");
  }

  return (
    <MeetingRoom
      meetingId={meeting.id}
      meetingName={meeting.name}
      agentName={meeting.agentName}
      agentInstructions={meeting.agentInstructions}
      user={{
        id: session.user.id,
        name: session.user.name,
        image: session.user.image || undefined,
      }}
    />
  );
};

export default MeetingIdPage;
