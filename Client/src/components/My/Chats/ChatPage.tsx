import {ChatWrite,ContactChat}from "../index"
export default function Chat() {
  return (
    
    <main className="md:grid md:flex-1 gap-4 md:overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Contact Chat */}
      <ContactChat className="hidden"/>
      {/* Chat place */}
      <ChatWrite />
    </main>          
  );
}
