import { useEffect, useState } from "react";
import Header from "./components/layout/Header/Header";
import FeedContainer from "./components/feed/FeedContainer/FeedContainer";
import { useFeedStore } from "./store/slices/feedSlice";

function App() {
  const [avatar, setAvatar] = useState<string>("")
  const { posts } = useFeedStore();
  
  useEffect(() => {
    const firstUser = posts[1];
    if (firstUser?.avatar) {
      setAvatar(firstUser.avatar);
    }
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#f6f7f7]">
      <Header avatar={avatar} />
      <main className="container mx-auto px-4">
        <FeedContainer />
      </main>
    </div>
  );
}

export default App;