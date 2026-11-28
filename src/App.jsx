
import { useMemo, useState } from "react";
import "./App.css";
import API_BASE_URL from "./api";

const initialCommunities = [
  { id: "technology", name: "technology", members: "2.4m", icon: "⌘", color: "blue" },
  { id: "programming", name: "programming", members: "1.8m", icon: "</>", color: "violet" },
  { id: "design", name: "design", members: "846k", icon: "✳", color: "pink" },
  { id: "startups", name: "startups", members: "512k", icon: "↗", color: "cyan" },
  { id: "artificial", name: "artificial", members: "1.2m", icon: "✦", color: "purple" },
];

const initialPosts = [
  {
    id: 1,
    community: "technology",
    author: "pixelwanderer",
    time: "2h ago",
    title: "The internet is starting to feel like a place again.",
    body: "Smaller communities, thoughtful conversations, people sharing what they're building instead of chasing numbers. Maybe the next era of social media is about finding your people, not finding everyone.",
    votes: 284,
    comments: [
      { id: 1, author: "orbiting", text: "Less noise, more signal. That's the dream.", time: "1h ago" },
      { id: 2, author: "nightsky", text: "Small communities have always felt more human.", time: "45m ago" },
    ],
    tag: "Discussion",
    gradient: "aurora",
    saved: false,
  },
  {
    id: 2,
    community: "programming",
    author: "stacktrace",
    time: "3h ago",
    title: "Built my first side project from scratch. Here's what I learned.",
    body: "Six weeks of learning React, breaking things, fixing them, and questioning every design decision. The biggest lesson? Ship something small before you dream about something big.",
    votes: 196,
    comments: [
      { id: 1, author: "codecrumbs", text: "The first project teaches you more than ten tutorials.", time: "2h ago" },
    ],
    tag: "Build in public",
    gradient: "nebula",
    saved: false,
  },
  {
    id: 3,
    community: "design",
    author: "softpixels",
    time: "5h ago",
    title: "A few interface details that make an app feel premium",
    body: "Consistent spacing, quieter borders, a little breathing room, and animations that feel intentional. Good design doesn't need to shout to be noticed.",
    votes: 152,
    comments: [],
    tag: "Design",
    gradient: "cosmos",
    saved: false,
  },
];

function Icon({ name }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9M9 20v-7h6v7" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2.5 5-5 2.5 2.5-5z" /></>,
    bookmark: <path d="M6 4h12v17l-6-4-6 4z" />,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z" /></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    up: <path d="m5 14 7-7 7 7" />,
    down: <path d="m5 10 7 7 7-7" />,
    send: <><path d="m22 2-7 20-4-9-9-4Z" /><path d="M22 2 11 13" /></>,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2z" /></>,
    more: <><circle cx="5" cy="12" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>,
  };

  return (
    <svg
      className="icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name] || <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}

function Avatar({ name = "User", size = "normal", color = "blue" }) {
  return (
    <div className={`avatar avatar-${color} avatar-${size}`} title={name}>
      {name.slice(0, 2).toUpperCase()}
    </div>
  );
}
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("signup");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (mode === "signup") {
      if (username.trim().length < 3) {
        setError("Username must be at least 3 characters.");
        return;
      }

      if (displayName.trim().length < 2) {
        setError("Please enter your display name.");
        return;
      }

      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint =
        mode === "signup" ? "/auth/signup" : "/auth/login";

      const body =
        mode === "signup"
          ? {
              username: username.trim(),
              displayName: displayName.trim(),
              email: cleanEmail,
              password,
            }
          : {
              email: cleanEmail,
              password,
            };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (mode === "signup") {
        setMode("login");
        setError("Account created successfully! Please log in.");
        setPassword("");
      } else {
        onLogin(data.user, data.token);
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div className="auth-logo">rally<span>.</span></div>

        <div className="auth-eyebrow">YOUR PEOPLE. YOUR PLANET.</div>

        <h1>
          {mode === "signup" ? "Find your people." : "Welcome back."}
        </h1>

        <p className="auth-description">
          {mode === "signup"
            ? "Create your space. Join the conversation."
            : "Your communities are waiting for you."}
        </p>

        <div className="auth-tabs">
          <button
            className={mode === "login" ? "active" : ""}
            onClick={() => {
              setMode("login");
              setError("");
            }}
            type="button"
          >
            Log in
          </button>

          <button
            className={mode === "signup" ? "active" : ""}
            onClick={() => {
              setMode("signup");
              setError("");
            }}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
        
          {mode === "signup" && (
            <>
              <label>Display Name</label>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Enter your name"
                required
              />

              <label>Username</label>
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
              />
            </>
          )}

          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <div className="auth-error">{error}</div>}


          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create account"
                : "Log in"}

          </button>
        </form>

        <p className="auth-switch">
          {mode === "signup"
            ? "Already have an account?"
            : "New to Rally?"}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "login" : "signup");
              setError("");
            }}
          >
            {mode === "signup" ? "Log in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

function App() {
  const [currentUser, setCurrentUser] = useState("");
  const [currentRole, setCurrentRole] = useState("user");
  const [authToken, setAuthToken] = useState("");

  const [posts, setPosts] = useState(initialPosts);
  const [communities, setCommunities] = useState(initialCommunities);
  const [joined, setJoined] = useState(["technology", "programming"]);
  const [activeNav, setActiveNav] = useState("Home");
  const [activeCommunity, setActiveCommunity] = useState("");
  const [sort, setSort] = useState("For you");
  const [search, setSearch] = useState("");
  const [showComposer, setShowComposer] = useState(false);
  const [showComments, setShowComments] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newCommunity, setNewCommunity] = useState("technology");
  const [commentText, setCommentText] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // The logged-in user's details are used throughout the existing homepage.
  const initialUser = {
    name: currentUser,
    handle: currentUser,
    initials: currentUser.slice(0, 2).toUpperCase(),
  };

  const currentPost = posts.find((post) => post.id === showComments);

  const visiblePosts = useMemo(() => {
    let result = [...posts];

    if (activeCommunity) {
      result = result.filter((post) => post.community === activeCommunity);
    }

    if (activeNav === "Saved") {
      result = result.filter((post) => post.saved);
    }

    if (activeNav === "My communities") {
      result = result.filter((post) => joined.includes(post.community));
    }

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter((post) =>
        [post.title, post.body, post.author, post.community, post.tag]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }

    if (sort === "Popular") result.sort((a, b) => b.votes - a.votes);
    if (sort === "Newest") result.sort((a, b) => b.id - a.id);

    return result;
  }, [posts, activeCommunity, activeNav, joined, search, sort]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function vote(postId, direction) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId
          ? { ...post, votes: post.votes + direction }
          : post
      )
    );
  }

  function toggleSave(postId) {
    setPosts((previous) =>
      previous.map((post) =>
        post.id === postId ? { ...post, saved: !post.saved } : post
      )
    );
  }

  function toggleJoin(communityId) {
    const alreadyJoined = joined.includes(communityId);
    setJoined((previous) =>
      alreadyJoined
        ? previous.filter((id) => id !== communityId)
        : [...previous, communityId]
    );
    showNotice(alreadyJoined ? "Community left" : "Welcome to the community");
  }

  function createPost(event) {
    event.preventDefault();
    if (!newTitle.trim()) return;

    const post = {
      id: Date.now(),
      community: newCommunity,
      author: initialUser.handle,
      time: "just now",
      title: newTitle.trim(),
      body: newBody.trim(),
      votes: 1,
      comments: [],
      tag: "New post",
      gradient: "aurora",
      saved: false,
    };

    setPosts((previous) => [post, ...previous]);
    setActiveNav("Home");
    setActiveCommunity("");
    setSort("Newest");
    setSearch("");
    setNewTitle("");
    setNewBody("");
    setShowComposer(false);
    showNotice("Your post is live!");
  }

  function addComment(event) {
    event.preventDefault();
    if (!commentText.trim() || !currentPost) return;

    setPosts((previous) =>
      previous.map((post) =>
        post.id === currentPost.id
          ? {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: Date.now(),
                  author: initialUser.handle,
                  text: commentText.trim(),
                  time: "just now",
                },
              ],
            }
          : post
      )
    );

    setCommentText("");
    showNotice("Comment added");
  }

  function selectNav(name) {
    setActiveNav(name);
    setActiveCommunity("");
    setMobileMenu(false);
  }

  // Show authentication before rendering the existing Rally homepage.
  if (!currentUser) {
  
  return (
    <AuthScreen
      onLogin={(user, token) => {
        setCurrentUser(user.username);
        setCurrentRole(user.role || "user");
        setAuthToken(token);
      }}
    />
  );
}

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar glass-panel">
        <button
          className="brand"
          onClick={() => {
            selectNav("Home");
            setSearch("");
          }}
          aria-label="Rally home"
        >
          <span className="brand-mark"><span /></span>
          <span className="brand-name">rally<span>.</span></span>
        </button>

        <div className="top-search">
          <Icon name="search" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations, communities..."
            aria-label="Search Rally"
          />
          <kbd>⌘ K</kbd>
        </div>

        <div className="top-actions">
          <button
            className="icon-button notification-button"
            aria-label="Notifications"
            onClick={() => showNotice("You're all caught up!")}
          >
            <Icon name="bell" />
            <span className="notification-dot" />
          </button>

          <button
            className="create-button"
            onClick={() => setShowComposer(true)}
          >
            <Icon name="plus" />
            <span>Create post</span>
          </button>

          <div className="profile-menu-wrapper">
            <button
              className="profile-button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              aria-label="Open profile menu"
            >
              <Avatar name={initialUser.initials} />
              {currentRole === "admin" && (
                <span className="admin-label">ADMIN</span>
              )}
              <span className="profile-chevron">⌄</span>
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown">
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowProfileMenu(false);
                  }}
                >
                  <Icon name="message" />
                  View Profile
                </button>

                <button
                  onClick={async () => {
                    try {
                      await fetch(`${API_BASE_URL}/auth/logout`, {
                        method: "POST",
                        headers: {
                          Authorization: `Bearer ${authToken}`,
                        },
                      });
                    } catch (error) {
                      console.error("Logout error:", error);
                    } finally {
                      setCurrentUser("");
                      setCurrentRole("user");
                      setAuthToken("");
                      setActiveNav("Home");
                      setActiveCommunity("");
                      setSearch("");
                      setShowProfileMenu(false);
                    }
                  }}
                >
                  <Icon name="close" />
                  Log out
                </button>
              </div>
            )}
          </div>

          <button
            className="icon-button mobile-menu-button"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle menu"
          >
            ☰

          </button>
        </div>

      </header>

      <div className={`workspace ${mobileMenu ? "menu-open" : ""}`}>
        <aside className="sidebar">
          <div className="sidebar-section">
            <div className="section-label">YOUR SPACE</div>
            <button className={`nav-item ${activeNav === "Home" && !activeCommunity ? "active" : ""}`} onClick={() => selectNav("Home")}>
              <Icon name="home" /><span>Home feed</span><span className="nav-shortcut">⌂</span>
            </button>
            <button className={`nav-item ${activeNav === "Explore" ? "active" : ""}`} onClick={() => selectNav("Explore")}>
              <Icon name="compass" /><span>Explore</span>
            </button>
            <button className={`nav-item ${activeNav === "Saved" ? "active" : ""}`} onClick={() => selectNav("Saved")}>
              <Icon name="bookmark" /><span>Saved posts</span>
            </button>
            <button className={`nav-item ${activeNav === "My communities" ? "active" : ""}`} onClick={() => selectNav("My communities")}>
              <Icon name="message" /><span>My communities</span>
              <span className="nav-count">{joined.length}</span>
            </button>
          </div>

          <div className="sidebar-section community-section">
            <div className="section-heading">
              <span className="section-label">YOUR COMMUNITIES</span>
              <button className="tiny-icon-button" onClick={() => selectNav("Explore")} aria-label="Explore communities"><Icon name="plus" /></button>
            </div>

            {communities.filter((community) => joined.includes(community.id)).map((community) => (
              <button
                className={`community-nav ${activeCommunity === community.id ? "selected" : ""}`}
                key={community.id}
                onClick={() => {
                  setActiveCommunity(community.id);
                  setActiveNav("Home");
                  setMobileMenu(false);
                }}
              >
                <span className={`community-icon ${community.color}`}>{community.icon}</span>
                <span className="community-nav-name">r/{community.name}</span>
                <span className="community-indicator" />
              </button>
            ))}
          </div>

          <div className="sidebar-section discover-section">
            <div className="section-label">DISCOVER</div>
            {communities.filter((community) => !joined.includes(community.id)).slice(0, 3).map((community) => (
              <button className="community-nav discover-item" key={community.id} onClick={() => toggleJoin(community.id)}>
                <span className={`community-icon ${community.color}`}>{community.icon}</span>
                <span className="community-nav-name">r/{community.name}</span>
                <span className="join-mini">+</span>
              </button>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div className="upgrade-card">
              <div className="upgrade-spark"><Icon name="spark" /></div>
              <div className="upgrade-title">Your corner of the internet.</div>
              <p>Good conversations start with good people.</p>
              <button onClick={() => selectNav("Explore")}>Find your people <Icon name="arrow" /></button>
            </div>
            <div className="sidebar-footer">
              <span>About</span><span>Guidelines</span><span>Privacy</span>
              <p>© 2026 Rally community</p>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <section className="welcome-banner">
            <div className="banner-copy">
              <div className="eyebrow"><span className="live-pulse" /> YOUR PEOPLE. YOUR PLANET.</div>
              <h1>Good things happen<br />when we <span>rally.</span></h1>
              <p>A place for your interests, your ideas, and the people who get it.</p>
              <button className="banner-button" onClick={() => selectNav("Explore")}>Explore communities <Icon name="arrow" /></button>
            </div>
            <div className="banner-art" aria-hidden="true">
              <div className="orbit orbit-a" />
              <div className="orbit orbit-b" />
              <div className="orbit orbit-c" />
              <div className="planet planet-main"><span>r.</span></div>
              <div className="planet planet-small" />
              <div className="planet planet-blue" />
              <div className="star star-a">✦</div>
              <div className="star star-b">✧</div>
              <div className="star star-c">·</div>
            </div>
          </section>

          {activeNav === "Explore" && (
            <section className="explore-panel glass-panel">
              <div className="panel-heading">
                <div><div className="eyebrow">FIND YOUR CORNER</div><h2>Communities to explore</h2></div>
                <span className="muted-text">{communities.length} communities</span>
              </div>
              <div className="community-grid">
                {communities.map((community) => (
                  <div className="explore-community" key={community.id}>
                    <div className={`community-icon large ${community.color}`}>{community.icon}</div>
                    <div className="explore-community-info"><strong>r/{community.name}</strong><span>{community.members} members</span></div>
                    <button className={`join-button ${joined.includes(community.id) ? "joined" : ""}`} onClick={() => toggleJoin(community.id)}>
                      {joined.includes(community.id) ? "Joined" : "Join"}
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="feed-section">
            <div className="feed-heading">
              <div>
                <div className="eyebrow">{activeCommunity ? "COMMUNITY FEED" : activeNav === "Saved" ? "YOUR COLLECTION" : activeNav === "My communities" ? "YOUR COMMUNITIES" : "THE COMMUNITY FEED"}</div>
                <h2>{activeCommunity ? `r/${activeCommunity}` : activeNav === "Saved" ? "Saved for later" : activeNav === "My communities" ? "Your communities" : activeNav === "Explore" ? "The latest conversations" : "Discover something new"}</h2>
              </div>
              <div className="feed-tabs">
                {["For you", "Popular", "Newest"].map((item) => (
                  <button key={item} className={sort === item ? "selected" : ""} onClick={() => setSort(item)}>{item}</button>
                ))}
              </div>
            </div>

            <button className="quick-compose glass-panel" onClick={() => setShowComposer(true)}>
              <Avatar name={initialUser.initials} />
              <span>What's on your mind, {initialUser.name}?</span>
              <span className="compose-icon"><Icon name="plus" /></span>
            </button>

            <div className="posts-list">
              {visiblePosts.length ? visiblePosts.map((post) => {
                const community = communities.find((item) => item.id === post.community);
                return (
                  <article className="post-card glass-panel" key={post.id}>
                    <div className="post-topline">
                      <div className="post-community">
                        <span className={`community-icon small ${community?.color || "blue"}`}>{community?.icon || "✳"}</span>
                        <strong>r/{post.community}</strong>
                        <span className="post-separator">·</span>
                        <span className="post-time">{post.time}</span>
                      </div>
                      <button className="tiny-icon-button post-more" aria-label="More post options" onClick={() => toggleSave(post.id)} title={post.saved ? "Remove saved post" : "Save post"}>
                        <Icon name="more" />
                      </button>
                    </div>

                    <div className="post-author"><Avatar name={post.author} size="small" color={post.gradient === "nebula" ? "violet" : post.gradient === "cosmos" ? "pink" : "cyan"} /><span>@{post.author}</span><span className="author-dot">·</span><span>{post.tag}</span></div>

                    <h3>{post.title}</h3>
                    {post.body && <p className="post-body">{post.body}</p>}

                    {post.id === 1 && (
                      <div className="post-art art-aurora">
                        <div className="aurora-glow glow-one" /><div className="aurora-glow glow-two" />
                        <div className="art-caption"><span>FIELD NOTES / 001</span><strong>Find your frequency.</strong></div>
                        <div className="art-orb" />
                      </div>
                    )}
                    {post.id === 2 && (
                      <div className="post-art art-nebula">
                        <div className="code-window"><div className="window-dots"><i /><i /><i /></div><span className="code-line long" /><span className="code-line medium" /><span className="code-line short" /><span className="code-line long muted-line" /><span className="code-line medium" /></div>
                        <div className="art-caption"><span>BUILD LOG / 002</span><strong>Make it real.</strong></div>
                      </div>
                    )}
                    {post.id === 3 && (
                      <div className="post-art art-cosmos">
                        <div className="design-tile tile-one">Less,<br /><em>but better.</em></div>
                        <div className="design-tile tile-two"><span>◌</span><small>SPACE / TYPE / LIGHT</small></div>
                        <div className="design-tile tile-three">Aa</div>
                      </div>
                    )}

                    <div className="post-actions">
                      <div className="vote-control">
                        <button onClick={() => vote(post.id, 1)} aria-label="Upvote"><Icon name="up" /></button>
                        <span>{post.votes}</span>
                        <button onClick={() => vote(post.id, -1)} aria-label="Downvote"><Icon name="down" /></button>
                      </div>
                      <button className="post-action" onClick={() => setShowComments(post.id)}><Icon name="message" /><span>{post.comments.length} comments</span></button>
                      <button className={`post-action save-action ${post.saved ? "saved" : ""}`} onClick={() => toggleSave(post.id)}><Icon name="bookmark" /><span>{post.saved ? "Saved" : "Save"}</span></button>
                      <button className="post-action share-action" onClick={() => { navigator.clipboard?.writeText(post.title); showNotice("Post title copied"); }}><Icon name="send" /><span>Share</span></button>
                    </div>
                  </article>
                );
              }) : (
                <div className="empty-state glass-panel">
                  <div className="empty-icon"><Icon name="spark" /></div>
                  <h3>It's quiet in here.</h3>
                  <p>{activeNav === "Saved" ? "Save a post and it'll show up here." : "Try another search or explore a community to find something interesting."}</p>
                  <button className="create-button" onClick={() => activeNav === "Saved" ? selectNav("Home") : selectNav("Explore")}>{activeNav === "Saved" ? "Back to feed" : "Explore communities"}</button>
                </div>
              )}
            </div>
          </section>
        </main>

        <aside className="right-sidebar">
          <section className="right-card glass-panel">
            <div className="right-card-heading"><div><div className="eyebrow">CURATED FOR YOU</div><h3>Trending now</h3></div><span className="trending-mark">↗</span></div>
            {[
              { topic: "Artificial intelligence", community: "r/artificial", posts: "2.8k posts", color: "purple", icon: "✦" },
              { topic: "Build in public", community: "r/startups", posts: "1.4k posts", color: "cyan", icon: "↗" },
              { topic: "Creative coding", community: "r/programming", posts: "986 posts", color: "violet", icon: "</>" },
            ].map((trend, index) => (
              <button className="trend-item" key={trend.topic} onClick={() => { setSearch(trend.topic.split(" ")[0]); setActiveCommunity(""); setActiveNav("Home"); }}>
                <span className={`trend-number ${trend.color}`}>0{index + 1}</span>
                <span className="trend-info"><strong>{trend.topic}</strong><span>{trend.community} · {trend.posts}</span></span>
                <Icon name="arrow" />
              </button>
            ))}
          </section>

          <section className="right-card glass-panel">
            <div className="right-card-heading"><div><div className="eyebrow">MEET YOUR PEOPLE</div><h3>Communities for you</h3></div><button className="text-link" onClick={() => selectNav("Explore")}>See all</button></div>
            {communities.filter((community) => !joined.includes(community.id)).slice(0, 3).map((community) => (
              <div className="suggestion-item" key={community.id}>
                <span className={`community-icon ${community.color}`}>{community.icon}</span>
                <div className="suggestion-info"><strong>r/{community.name}</strong><span>{community.members} members</span></div>
                <button className="join-circle" onClick={() => toggleJoin(community.id)} aria-label={`Join ${community.name}`}>+</button>
              </div>
            ))}
            {communities.every((community) => joined.includes(community.id)) && <p className="muted-text">You're part of every community. Nice!</p>}
          </section>

          <section className="quote-card">
            <div className="quote-mark">“</div>
            <p>The internet is better when we build it together.</p>
            <span>THE RALLY WAY</span>
            <div className="quote-orb" />
          </section>

          <div className="right-footer"><span>Made for the curious.</span><span className="footer-heart">✦</span></div>
        </aside>
      </div>

      {showComposer && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowComposer(false)}>
          <form className="modal glass-panel composer-modal" onSubmit={createPost}>
            <div className="modal-heading"><div><div className="eyebrow">START A CONVERSATION</div><h2>Create a post</h2></div><button type="button" className="icon-button" onClick={() => setShowComposer(false)} aria-label="Close"><Icon name="close" /></button></div>
            <label className="field-label">Community</label>
            <select value={newCommunity} onChange={(event) => setNewCommunity(event.target.value)}>
              {communities.map((community) => <option key={community.id} value={community.id}>r/{community.name}</option>)}
            </select>
            <label className="field-label" htmlFor="post-title">Title</label>
            <input id="post-title" value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="Give your post a great title..." required maxLength={160} />
            <label className="field-label" htmlFor="post-body">What's the story? <span>Optional</span></label>
            <textarea id="post-body" value={newBody} onChange={(event) => setNewBody(event.target.value)} placeholder="Share an idea, ask a question, start a conversation..." rows={5} />
            <div className="modal-actions"><span className="muted-text">Be kind. Be curious.</span><button className="create-button" type="submit"><Icon name="plus" /> Publish post</button></div>
          </form>
        </div>
      )}

      {currentPost && (
        <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowComments(null)}>
          <section className="modal glass-panel comments-modal">
            <div className="modal-heading"><div><div className="eyebrow">COMMUNITY CONVERSATION</div><h2>Post & comments</h2></div><button className="icon-button" onClick={() => setShowComments(null)} aria-label="Close"><Icon name="close" /></button></div>
            <div className="comment-post-summary"><span className="community-pill">r/{currentPost.community}</span><h3>{currentPost.title}</h3><p>{currentPost.body}</p><span className="muted-text">@{currentPost.author} · {currentPost.time}</span></div>
            <div className="comments-list">
              <div className="comments-title">{currentPost.comments.length} comments <span>·</span> Be part of the conversation</div>
              {currentPost.comments.length ? currentPost.comments.map((comment) => (
                <div className="comment-item" key={comment.id}><Avatar name={comment.author} size="small" /><div><div className="comment-meta"><strong>@{comment.author}</strong><span>{comment.time}</span></div><p>{comment.text}</p></div></div>
              )) : <div className="no-comments">No comments yet. Start the conversation.</div>}
            </div>
            <form className="comment-form" onSubmit={addComment}><Avatar name={initialUser.initials} size="small" /><input value={commentText} onChange={(event) => setCommentText(event.target.value)} placeholder="Add a thoughtful comment..." aria-label="Write a comment" /><button type="submit" disabled={!commentText.trim()} aria-label="Send comment"><Icon name="send" /></button></form>
          </section>
        </div>
      )}

{showProfile && (
  <div
    className="modal-backdrop"
    onMouseDown={(event) =>
      event.target === event.currentTarget && setShowProfile(false)
    }
  >
    <section className="modal glass-panel">
      <div className="modal-heading">
        <div>
          <div className="eyebrow">YOUR RALLY SPACE</div>
          <h2>Your Profile</h2>
        </div>

        <button
          className="icon-button"
          onClick={() => setShowProfile(false)}
          aria-label="Close profile"
        >
          <Icon name="close" />
        </button>
      </div>

      <Avatar name={initialUser.initials} />
      <h3>{initialUser.name}</h3>
      <p>@{initialUser.handle}</p>
      <p className="muted-text">Role: {currentRole}</p>
    </section>
  </div>
)}

      {notice && <div className="toast-message"><span className="toast-check">✓</span>{notice}</div>}
    </div>
  );
}

export default App;
