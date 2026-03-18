// ===== LOAD FROM LOCAL STORAGE OR DEFAULT =====

let users = JSON.parse(localStorage.getItem("users")) || [
  {
    id: "u1",
    email: "admin@music.local",
    phone: "9999999999",
    password: "admin",
    role: "admin"
  },
  {
    id: "u2",
    email: "user@music.local",
    phone: "8888888888",
    password: "user",
    role: "user"
  }
];

let songs = JSON.parse(localStorage.getItem("songs")) || [
  { id: "s1", name: "Tum Hi Ho", director: "Mithoon", releaseDate: "2013", album: "Aashiqui 2", isVisibleToUsers: true },
  { id: "s2", name: "Kesariya", director: "Pritam", releaseDate: "2022", album: "Brahmastra", isVisibleToUsers: true },
  { id: "s3", name: "Raataan Lambiyan", director: "Tanishk Bagchi", releaseDate: "2021", album: "Shershaah", isVisibleToUsers: true },
  { id: "s4", name: "Apna Bana Le", director: "Sachin-Jigar", releaseDate: "2022", album: "Bhediya", isVisibleToUsers: true },
  { id: "s5", name: "Tera Ban Jaunga", director: "Akhil Sachdeva", releaseDate: "2019", album: "Kabir Singh", isVisibleToUsers: true },
  { id: "s6", name: "Kaise Hua", director: "Vishal Mishra", releaseDate: "2019", album: "Kabir Singh", isVisibleToUsers: true },
  { id: "s7", name: "Agar Tum Saath Ho", director: "A.R. Rahman", releaseDate: "2015", album: "Tamasha", isVisibleToUsers: true },
  { id: "s8", name: "Dil Diyan Gallan", director: "Vishal-Shekhar", releaseDate: "2017", album: "Tiger Zinda Hai", isVisibleToUsers: true },
  { id: "s9", name: "Ghungroo", director: "Vishal-Shekhar", releaseDate: "2019", album: "War", isVisibleToUsers: true },
  { id: "s10", name: "Bekhayali", director: "Sachet-Parampara", releaseDate: "2019", album: "Kabir Singh", isVisibleToUsers: true },
  { id: "s11", name: "Channa Mereya", director: "Pritam", releaseDate: "2016", album: "Ae Dil Hai Mushkil", isVisibleToUsers: true },
  { id: "s12", name: "Kalank Title Track", director: "Pritam", releaseDate: "2019", album: "Kalank", isVisibleToUsers: true },
  { id: "s13", name: "Shayad", director: "Pritam", releaseDate: "2020", album: "Love Aaj Kal", isVisibleToUsers: true },
  { id: "s14", name: "Hawayein", director: "Pritam", releaseDate: "2017", album: "Jab Harry Met Sejal", isVisibleToUsers: true },
  { id: "s15", name: "Mast Magan", director: "Shankar-Ehsaan-Loy", releaseDate: "2014", album: "2 States", isVisibleToUsers: true }
];

let playlists = JSON.parse(localStorage.getItem("playlists")) || [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ===== SAVE HELPERS =====

const saveUsers = () => {
  localStorage.setItem("users", JSON.stringify(users));
};

const saveSongs = () => {
  localStorage.setItem("songs", JSON.stringify(songs));
};

const savePlaylists = () => {
  localStorage.setItem("playlists", JSON.stringify(playlists));
};

const saveFavorites = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const delay = (res) => new Promise((r) => setTimeout(() => r(res), 300));

// ===== API =====

export const fakeApi = {

  // ===== AUTH =====
  register: async ({ email, phone, password }) => {
    const exists = users.find((u) => u.email === email);
    if (exists) throw new Error("User exists");

    const newUser = {
      id: "u" + Date.now(),
      email,
      phone,
      password,
      role: "user"
    };

    users.push(newUser);
    saveUsers();

    return delay(newUser);
  },

  login: async ({ email, password }) => {
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) throw new Error("Invalid credentials");

    const session = {
      userId: user.id,
      role: user.role,
      email: user.email
    };

    localStorage.setItem("session", JSON.stringify(session));
    return delay(session);
  },

  getSession: async () => {
    return JSON.parse(localStorage.getItem("session"));
  },

  logout: async () => {
    localStorage.removeItem("session");
    return delay(true);
  },

  // ===== SONGS =====
  listSongs: async ({ forRole, query }) => {
    let result = [...songs];

    if (forRole === "user") {
      result = result.filter((s) => s.isVisibleToUsers);
    }

    if (query) {
      result = result.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return delay(result);
  },

  getSong: async (id) => {
    return delay(songs.find((s) => s.id === id));
  },

  createSong: async (data) => {
    const newSong = {
      ...data,
      id: "s" + Date.now(),
      isVisibleToUsers: true
    };

    songs.push(newSong);
    saveSongs();

    return delay(newSong);
  },

  updateSong: async (id, patch) => {
    songs = songs.map((s) =>
      s.id === id ? { ...s, ...patch } : s
    );

    saveSongs();
    return delay(true);
  },

  deleteSong: async (id) => {
    songs = songs.filter((s) => s.id !== id);
    saveSongs();

    return delay(true);
  },

  setSongVisibility: async (id, isVisibleToUsers) => {
    songs = songs.map((s) =>
      s.id === id ? { ...s, isVisibleToUsers } : s
    );

    saveSongs();
    return delay(true);
  },

  // ===== PLAYLIST =====
  listPlaylists: async ({ ownerUserId }) => {
    return delay(
      playlists.filter((p) => p.ownerUserId === ownerUserId)
    );
  },

  createPlaylist: async ({ ownerUserId, name }) => {
    const newPlaylist = {
      id: "p" + Date.now(),
      ownerUserId,
      name,
      songIds: []
    };

    playlists.push(newPlaylist);
    savePlaylists();

    return delay(newPlaylist);
  },

  deletePlaylist: async (id) => {
    playlists = playlists.filter((p) => p.id !== id);
    savePlaylists();

    return delay(true);
  },

  addSongToPlaylist: async (id, songId) => {
    playlists = playlists.map((p) =>
      p.id === id
        ? { ...p, songIds: [...p.songIds, songId] }
        : p
    );

    savePlaylists();
    return delay(true);
  },

  removeSongFromPlaylist: async (id, songId) => {
    playlists = playlists.map((p) =>
      p.id === id
        ? {
            ...p,
            songIds: p.songIds.filter((s) => s !== songId)
          }
        : p
    );

    savePlaylists();
    return delay(true);
  },

  // ===== FAVORITES =====
  getFavorites: async (userId) => {
    return delay(
      favorites.filter((f) => f.userId === userId)
    );
  },

  toggleFavorite: async (userId, songId) => {
    const exists = favorites.find(
      (f) => f.userId === userId && f.songId === songId
    );

    if (exists) {
      favorites = favorites.filter(
        (f) =>
          !(f.userId === userId && f.songId === songId)
      );
    } else {
      favorites.push({ userId, songId });
    }

    saveFavorites();
    return delay(true);
  }
};