import React from "react";
const GeminiChat: any = React.lazy(
    () => import('./sections/GeminiChat/GeminiChat')
);

export default function Home() {
  return (
    <main>
      <GeminiChat />
    </main>
  );
}


