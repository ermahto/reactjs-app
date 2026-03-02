// Simple data model for the blog. In a real app this would come from an API.
const posts = [
  {
    id: 1,
    title: "Understanding Large Language Models",
    subtitle: "How transformers, tokens, and attention work together",
    date: "Feb 10, 2026",
    publishedAt: "2026-02-10",
    category: "Foundations",
    heroLabel: "LLM architecture diagram",
    heroPill: "LLM Deep Dive",
    paragraphs: [
      "Large language models (LLMs) like GPT are neural networks trained to predict the next token in a sequence, but that simple objective leads to surprisingly general capabilities.",
      "They use a Transformer architecture built around self-attention layers. Instead of processing text strictly left-to-right, attention lets the model 'look' at any other token in the sequence to decide what matters right now.",
      "Once you understand tokens, embeddings, and attention heads, features like code generation, question answering, and reasoning feel less like magic—and more like the result of careful scaling laws and lots of gradient descent."
    ],
    tags: ["Transformers", "LLMs", "Architecture"]
  },
  {
    id: 2,
    title: "Practical AI for Your Everyday Work",
    subtitle: "Concrete workflows to save hours each week",
    date: "Jan 28, 2026",
    publishedAt: "2026-01-28",
    category: "Workflows",
    heroLabel: "AI productivity dashboard",
    heroPill: "Real-world usage",
    paragraphs: [
      "The best AI setups quietly automate the repetitive parts of your day: summarizing meetings, drafting first versions of emails, or turning notes into structured tasks.",
      "Instead of throwing a single giant prompt at a model, think in workflows: break work into smaller steps, add lightweight checks, and keep a human in the loop for anything sensitive or irreversible.",
      "This post walks through example flows for coding, content, and analysis, and shows how to turn your best prompts into reusable templates or simple internal tools."
    ],
    tags: ["Productivity", "Prompt Design", "Workflows"]
  },
  {
    id: 3,
    title: "From Prototype to Production with AI Features",
    subtitle: "What changes when your prompt becomes a product",
    date: "Jan 5, 2026",
    publishedAt: "2026-01-05",
    category: "Shipping",
    heroLabel: "AI feature lifecycle",
    heroPill: "Shipping to users",
    paragraphs: [
      "Going from a cool prompt in a playground to a reliable product feature means dealing with latency, cost, versioning, and failure modes.",
      "You’ll need guardrails (validation, fallbacks), observability (logging, tracing, prompt experiments), and product thinking around when to block, warn, or silently correct results.",
      "We compare common patterns—tools, agents, retrieval, and fine-tuning—and outline a checklist for hardening your favorite prototype into something you’re comfortable giving to real users."
    ],
    tags: ["Production", "Guardrails", "MLOps"]
  }
];

const popularPosts = [
  {
    title: "Prompt Engineering Cheatsheet for Developers",
    readTime: "7 min read",
    targetId: 1
  },
  {
    title: "Top 5 AI Tools to Upgrade Your Dev Workflow",
    readTime: "5 min read",
    targetId: 2
  },
  {
    title: "Building a Chatbot with React and GPT",
    readTime: "12 min read",
    targetId: 3
  }
];

const about = {
  name: "Santosh",
  role: "Frontend engineer exploring applied AI & modern UX.",
  tagline: "Writing about the intersection of UI engineering and language models.",
  badge: "Writing with AI · Weekly"
};

const follow = {
  text: "Follow along for new posts, code experiments, and small, practical AI recipes you can ship this week.",
  channels: ["GitHub", "LinkedIn", "Twitter/X", "Email newsletter"]
};

// Derived, mutable state for the UI. We keep the original `posts` array immutable.
let dynamicPosts = posts.slice();
let visibleCount = 2;
let currentCategory = "all";
let sortMode = "newest";
let searchQuery = "";

function createPostCard(post) {
  const wrapper = document.createElement("article");
  wrapper.className = "card post-card";
  wrapper.dataset.postId = String(post.id);

  const meta = document.createElement("div");
  meta.className = "post-card__meta";
  meta.textContent = `${post.category} · ${post.date}`;

  const title = document.createElement("h2");
  title.className = "post-card__title";
  title.textContent = post.title;

  const subtitle = document.createElement("p");
  subtitle.className = "post-card__subtitle";
  subtitle.textContent = post.subtitle;

  const hero = document.createElement("div");
  hero.className = "post-card__image";

  const heroLabel = document.createElement("div");
  heroLabel.className = "post-card__image-label";
  heroLabel.textContent = post.heroLabel;

  const heroPill = document.createElement("div");
  heroPill.className = "post-card__image-pill";
  heroPill.textContent = post.heroPill;

  hero.appendChild(heroLabel);
  hero.appendChild(heroPill);

  const body = document.createElement("div");
  body.className = "post-card__body";

  // map: transform paragraphs into <p> nodes
  const paragraphNodes = post.paragraphs.map((text) => {
    const para = document.createElement("p");
    para.textContent = text;
    return para;
  });

  paragraphNodes.forEach((node) => body.appendChild(node));

  if (post.tags?.length) {
    const tagRow = document.createElement("div");
    tagRow.className = "post-card__tag-row";

    post.tags.forEach((t) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = t;
      tagRow.appendChild(tag);
    });

    // join: build a comma-separated tag summary as a tooltip
    const tagSummary = post.tags.join(", ");
    wrapper.title = `Tags: ${tagSummary}`;
    body.appendChild(tagRow);
  }

  wrapper.appendChild(meta);
  wrapper.appendChild(title);
  wrapper.appendChild(subtitle);
  wrapper.appendChild(hero);
  wrapper.appendChild(body);

  return wrapper;
}

function renderPosts() {
  const container = document.getElementById("posts");
  if (!container) return;

  container.innerHTML = "";

  // slice: work with a shallow copy so we never mutate `dynamicPosts` when sorting
  let working = dynamicPosts.slice();

  // filter: by category
  if (currentCategory !== "all") {
    working = working.filter((post) => post.category === currentCategory);
  }

  // filter: by search query (title + subtitle + tags)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    working = working.filter((post) => {
      const haystack = [
        post.title,
        post.subtitle,
        (post.tags || []).join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }

  // sort + reverse: newest / oldest / title
  if (sortMode === "title") {
    working.sort((a, b) => a.title.localeCompare(b.title));
  } else {
    // sort ascending by date, then reverse for "newest first"
    working.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    if (sortMode === "newest") {
      working.reverse();
    }
  }

  // console toString: simple debugging of current controls
  console.debug(
    "Post controls",
    [currentCategory, sortMode, searchQuery].toString()
  );

  // paginate with slice + map
  const page = working.slice(0, visibleCount);
  const cards = page.map((post) => createPostCard(post));
  cards.forEach((card) => container.appendChild(card));
}

function renderPopular() {
  const container = document.getElementById("popular-posts");
  if (!container) return;

  const list = document.createElement("div");
  list.className = "popular-list";

  popularPosts.forEach((item) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "popular-item";

    const title = document.createElement("span");
    title.className = "popular-item__title";
    title.textContent = item.title;

    const meta = document.createElement("span");
    meta.className = "popular-item__meta";
    meta.textContent = item.readTime;

    row.appendChild(title);
    row.appendChild(meta);

    // find: scroll to the associated post when clicking a popular item
    row.addEventListener("click", () => {
      const target = dynamicPosts.find((post) => post.id === item.targetId);
      if (!target) return;
      const article = document.querySelector(
        `[data-post-id="${CSS.escape(String(target.id))}"]`
      );
      if (article) {
        article.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
    list.appendChild(row);
  });

  container.appendChild(list);
}

function renderAbout() {
  const container = document.getElementById("about");
  if (!container) return;

  const header = document.createElement("div");
  header.className = "about__header";

  const avatar = document.createElement("div");
  avatar.className = "avatar-placeholder";
  const ring = document.createElement("div");
  ring.className = "avatar-ring";
  avatar.appendChild(ring);

  const headingBlock = document.createElement("div");

  const title = document.createElement("h3");
  title.className = "about__heading";
  title.textContent = `About ${about.name}`;

  const role = document.createElement("p");
  role.className = "about__role";
  role.textContent = about.role;

  headingBlock.appendChild(title);
  headingBlock.appendChild(role);

  header.appendChild(avatar);
  header.appendChild(headingBlock);

  const badge = document.createElement("span");
  badge.className = "about__badge";
  badge.textContent = about.badge;

  const text = document.createElement("p");
  text.className = "about__text";
  text.textContent = about.tagline;

  container.appendChild(header);
  container.appendChild(badge);
  container.appendChild(text);
}

function renderFollow() {
  const container = document.getElementById("follow");
  if (!container) return;

  const title = document.createElement("h3");
  title.className = "card__title";
  title.textContent = "Follow Me";

  const text = document.createElement("p");
  text.className = "follow__text";
  text.textContent = follow.text;

  const channels = document.createElement("div");
  channels.className = "follow__channels";

  follow.channels.forEach((ch, index) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip" + (index === 0 ? " chip--primary" : "");
    chip.textContent = ch;
    channels.appendChild(chip);
  });

  container.appendChild(title);
  container.appendChild(text);
  container.appendChild(channels);
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-filter");
  const sortSelect = document.getElementById("sort-select");
  const showMoreButton = document.getElementById("show-more");
  const demoControls = document.getElementById("feed-demo-controls");

  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      searchQuery = event.target.value;
      visibleCount = 2;
      renderPosts();
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener("change", (event) => {
      currentCategory = event.target.value;
      visibleCount = 2;
      renderPosts();
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", (event) => {
      sortMode = event.target.value;
      renderPosts();
    });
  }

  if (showMoreButton) {
    showMoreButton.addEventListener("click", () => {
      // concat example: extend the dynamic list with extra posts when we first need more
      const extraPosts = [
        {
          id: 99,
          title: "Designing Prompt Libraries for Your Team",
          subtitle: "From personal notes to shared, versioned snippets",
          date: "Dec 20, 2025",
          publishedAt: "2025-12-20",
          category: "Workflows",
          heroLabel: "Prompt library board",
          heroPill: "Team prompts",
          paragraphs: [
            "As more teammates use AI, prompts move from individual experiments to shared assets that deserve versioning and documentation.",
            "A small prompt library with owners, examples, and known failure modes will outperform a chaotic collection of screenshots and chat logs."
          ],
          tags: ["Collaboration", "Prompt Design"]
        }
      ];

      if (!dynamicPosts.some((post) => post.id === 99)) {
        dynamicPosts = dynamicPosts.concat(extraPosts);
      }

      visibleCount += 2;
      renderPosts();
    });
  }

  if (demoControls) {
    demoControls.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLButtonElement)) return;
      const action = target.dataset.action;

      if (action === "add-top") {
        const newPost = {
          id: Date.now(),
          title: "Fresh: Shipping an AI Feature This Week",
          subtitle: "A tiny checklist before you hit deploy",
          date: "Live now",
          publishedAt: "9999-12-31",
          category: "Shipping",
          heroLabel: "Launch dashboard",
          heroPill: "Checklist",
          paragraphs: [
            "Before you ship, walk through latency, failure modes, and how you'll know if the feature is working for users.",
            "Even a lightweight checklist dramatically reduces production surprises."
          ],
          tags: ["Launch", "Checklists"]
        };
        // unshift: put the new post at the top of the feed
        dynamicPosts.unshift(newPost);
      } else if (action === "add-end") {
        const newPost = {
          id: Date.now(),
          title: "Weekend Experiment: Building a Tiny Agent",
          subtitle: "Letting a model call a couple of tools safely",
          date: "Experiment",
          publishedAt: "9999-12-30",
          category: "Foundations",
          heroLabel: "Agent playground",
          heroPill: "Experiment",
          paragraphs: [
            "You don't need a complex framework to let models call tools—start with a narrow set of actions and clear logging.",
            "We wired a model to call just three functions and learned a lot about error handling along the way."
          ],
          tags: ["Agents", "Tools"]
        };
        // push: append to the end
        dynamicPosts.push(newPost);
      } else if (action === "remove-first") {
        // shift: drop the first (oldest on screen) item
        dynamicPosts.shift();
      } else if (action === "remove-last") {
        // pop: drop the latest item in the list
        dynamicPosts.pop();
      } else if (action === "replace-second" && dynamicPosts.length >= 2) {
        const updated = {
          ...dynamicPosts[1],
          title: "Updated: Hardening AI Features for Production",
          subtitle: "Logging, guardrails, and UX patterns that survive real traffic",
          tags: ["Production", "Guardrails", "UX"]
        };
        // splice: replace the second post in-place
        dynamicPosts.splice(1, 1, updated);
      }

      visibleCount = Math.max(2, visibleCount);
      renderPosts();
    });
  }

  renderPosts();
  renderPopular();
  renderAbout();
  renderFollow();
});


