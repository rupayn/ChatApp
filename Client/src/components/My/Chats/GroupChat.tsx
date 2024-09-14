import ChatWrite from "./ChatWrite";
import ContactChat from "./ContactChat";


function GroupChat() {
  return (
    <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Contact Chat */}
      <ContactChat isGrp={true} className="hidden" />
      {/* Chat place */}
      <ChatWrite isGrp={true} />
    </main>
  );
}

export default GroupChat
