package com.movielib.api.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.movielib.api.model.ActivityEvent;
import com.movielib.api.model.AppUser;
import com.movielib.api.model.Movie;
import com.movielib.api.model.Review;
import com.movielib.api.model.UserFavorites;
import com.movielib.api.model.Watchlist;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class JsonStoreService {
    private final ObjectMapper mapper = new ObjectMapper();
    private final String storageDir;

    public JsonStoreService(@Value("${movie.storage-dir}") String storageDir) {
        this.storageDir = storageDir;
    }

    public synchronized List<Movie> searchMovies(String title, String genre, String actor) throws IOException {
        List<Movie> all = readMovies();
        final String safeTitle = normalize(title);
        final String safeGenre = normalize(genre);
        final String safeActor = normalize(actor);
        final boolean noFilters = safeTitle == null && safeGenre == null && safeActor == null;

        return all.stream()
                .filter(m -> {
                    if (noFilters) {
                        return true;
                    }
                    boolean titleMatch = safeTitle != null && m.getTitle() != null
                            && m.getTitle().toLowerCase().contains(safeTitle.toLowerCase());
                    boolean genreMatch = safeGenre != null && m.getGenres() != null
                            && m.getGenres().stream().anyMatch(g -> g != null && g.equalsIgnoreCase(safeGenre));
                    boolean actorMatch = safeActor != null && m.getActors() != null
                            && m.getActors().stream().anyMatch(a -> a != null && a.toLowerCase().contains(safeActor.toLowerCase()));
                    return titleMatch || genreMatch || actorMatch;
                })
                .collect(Collectors.toList());
    }

    public synchronized AppUser authenticate(String username, String password) throws IOException {
        String safeUsername = normalize(username);
        String safePassword = normalize(password);
        if (safeUsername == null || safePassword == null) {
            return null;
        }

        List<AppUser> users = readUsers();
        for (AppUser user : users) {
            if (user.getUsername() != null
                    && user.getPassword() != null
                    && user.getUsername().equalsIgnoreCase(safeUsername)
                    && user.getPassword().equals(safePassword)) {
                AppUser cleanUser = new AppUser();
                cleanUser.setId(user.getId());
                cleanUser.setUsername(user.getUsername());
                cleanUser.setRole(user.getRole());
                return cleanUser;
            }
        }
        return null;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    public synchronized Movie addMovie(Movie movie) throws IOException {
        List<Movie> movies = readMovies();
        movie.setId(UUID.randomUUID().toString());
        movies.add(movie);
        writeMovies(movies);
        logActivity("admin", "ADD_MOVIE", "MOVIE", movie.getId());
        return movie;
    }

    public synchronized Movie updateMovie(String id, Movie payload) throws IOException {
        List<Movie> movies = readMovies();
        for (Movie m : movies) {
            if (m.getId().equals(id)) {
                m.setTitle(payload.getTitle());
                m.setGenres(payload.getGenres());
                m.setActors(payload.getActors());
                m.setDescription(payload.getDescription());
                m.setYear(payload.getYear());
                m.setAvgRating(payload.getAvgRating());
                writeMovies(movies);
                logActivity("admin", "EDIT_MOVIE", "MOVIE", m.getId());
                return m;
            }
        }
        return null;
    }

    public synchronized boolean deleteMovie(String id) throws IOException {
        List<Movie> movies = readMovies();
        boolean removed = movies.removeIf(m -> m.getId().equals(id));
        if (removed) {
            writeMovies(movies);
            logActivity("admin", "DELETE_MOVIE", "MOVIE", id);
        }
        return removed;
    }

    public synchronized Review addReview(Review review) throws IOException {
        List<Review> reviews = readReviews();
        review.setId(UUID.randomUUID().toString());
        review.setStatus("PENDING");
        reviews.add(review);
        writeReviews(reviews);
        logActivity(review.getUserId(), "ADD_REVIEW", "REVIEW", review.getId());
        return review;
    }

    public synchronized List<Review> approvedReviewsByMovie(String movieId) throws IOException {
        return readReviews().stream()
                .filter(r -> r.getMovieId().equals(movieId) && "APPROVED".equals(r.getStatus()))
                .collect(Collectors.toList());
    }

    public synchronized List<Review> pendingReviews() throws IOException {
        return readReviews().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .collect(Collectors.toList());
    }

    public synchronized Review moderateReview(String reviewId, String status) throws IOException {
        List<Review> reviews = readReviews();
        for (Review r : reviews) {
            if (r.getId().equals(reviewId)) {
                r.setStatus(status);
                writeReviews(reviews);
                logActivity("admin", "MODERATE_REVIEW_" + status, "REVIEW", r.getId());
                return r;
            }
        }
        return null;
    }

    public synchronized List<Watchlist> watchlists(String userId) throws IOException {
        return readWatchlists().stream()
                .filter(w -> w.getUserId().equals(userId))
                .collect(Collectors.toList());
    }

    public synchronized Watchlist createWatchlist(Watchlist watchlist) throws IOException {
        List<Watchlist> watchlists = readWatchlists();
        watchlist.setId(UUID.randomUUID().toString());
        watchlists.add(watchlist);
        writeWatchlists(watchlists);
        logActivity(watchlist.getUserId(), "CREATE_WATCHLIST", "WATCHLIST", watchlist.getId());
        return watchlist;
    }

    public synchronized List<String> getFavorites(String userId) throws IOException {
        String safeUserId = normalize(userId);
        if (safeUserId == null) {
            return new ArrayList<String>();
        }
        List<UserFavorites> all = readFavorites();
        for (UserFavorites fav : all) {
            if (safeUserId.equals(fav.getUserId())) {
                return fav.getMovieIds() == null ? new ArrayList<String>() : fav.getMovieIds();
            }
        }
        return new ArrayList<String>();
    }

    public synchronized List<String> addFavorite(String userId, String movieId) throws IOException {
        String safeUserId = normalize(userId);
        String safeMovieId = normalize(movieId);
        if (safeUserId == null || safeMovieId == null) {
            return new ArrayList<String>();
        }

        List<UserFavorites> all = readFavorites();
        UserFavorites target = null;
        for (UserFavorites fav : all) {
            if (safeUserId.equals(fav.getUserId())) {
                target = fav;
                break;
            }
        }
        if (target == null) {
            target = new UserFavorites();
            target.setUserId(safeUserId);
            target.setMovieIds(new ArrayList<String>());
            all.add(target);
        }
        if (target.getMovieIds() == null) {
            target.setMovieIds(new ArrayList<String>());
        }
        if (!target.getMovieIds().contains(safeMovieId)) {
            target.getMovieIds().add(safeMovieId);
            writeFavorites(all);
            logActivity(safeUserId, "ADD_FAVORITE", "MOVIE", safeMovieId);
        }
        return target.getMovieIds();
    }

    public synchronized List<String> removeFavorite(String userId, String movieId) throws IOException {
        String safeUserId = normalize(userId);
        String safeMovieId = normalize(movieId);
        if (safeUserId == null || safeMovieId == null) {
            return new ArrayList<String>();
        }

        List<UserFavorites> all = readFavorites();
        for (UserFavorites fav : all) {
            if (safeUserId.equals(fav.getUserId())) {
                if (fav.getMovieIds() != null && fav.getMovieIds().removeIf(id -> safeMovieId.equals(id))) {
                    writeFavorites(all);
                    logActivity(safeUserId, "REMOVE_FAVORITE", "MOVIE", safeMovieId);
                }
                return fav.getMovieIds() == null ? new ArrayList<String>() : fav.getMovieIds();
            }
        }
        return new ArrayList<String>();
    }

    public synchronized Watchlist updateWatchlist(String id, Watchlist payload) throws IOException {
        List<Watchlist> watchlists = readWatchlists();
        for (Watchlist w : watchlists) {
            if (w.getId().equals(id)) {
                w.setName(payload.getName());
                w.setMovieIds(payload.getMovieIds() == null ? new ArrayList<String>() : payload.getMovieIds());
                writeWatchlists(watchlists);
                return w;
            }
        }
        return null;
    }

    public synchronized boolean deleteWatchlist(String id) throws IOException {
        List<Watchlist> watchlists = readWatchlists();
        boolean removed = watchlists.removeIf(w -> w.getId().equals(id));
        if (removed) {
            writeWatchlists(watchlists);
            logActivity("unknown", "DELETE_WATCHLIST", "WATCHLIST", id);
        }
        return removed;
    }

    public synchronized Map<String, Object> activityReport() throws IOException {
        List<ActivityEvent> events = readActivity();
        List<ActivityEvent> todayEvents = events.stream()
                .filter(e -> isToday(e.getTimestamp()))
                .collect(Collectors.toList());

        long dailyActiveUsers = todayEvents.stream()
                .map(ActivityEvent::getUserId)
                .filter(u -> u != null && !u.trim().isEmpty())
                .distinct()
                .count();

        long reviewsSubmittedToday = todayEvents.stream()
                .filter(e -> "ADD_REVIEW".equals(e.getAction()))
                .count();

        long watchlistsCreatedToday = todayEvents.stream()
                .filter(e -> "CREATE_WATCHLIST".equals(e.getAction()))
                .count();

        String topGenre = topGenreFromMovies(readMovies());

        Map<String, Long> actionCounts = new HashMap<String, Long>();
        for (ActivityEvent e : events) {
            String action = e.getAction() == null ? "UNKNOWN" : e.getAction();
            Long current = actionCounts.get(action);
            actionCounts.put(action, current == null ? 1L : current + 1L);
        }

        List<Map.Entry<String, Long>> sorted = actionCounts.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry<String, Long>::getValue).reversed())
                .collect(Collectors.toList());
        Map<String, Long> topActions = new LinkedHashMap<String, Long>();
        for (int i = 0; i < sorted.size() && i < 5; i++) {
            topActions.put(sorted.get(i).getKey(), sorted.get(i).getValue());
        }

        Map<String, Object> report = new HashMap<String, Object>();
        report.put("dailyActiveUsers", dailyActiveUsers);
        report.put("reviewsSubmittedToday", reviewsSubmittedToday);
        report.put("watchlistsCreatedToday", watchlistsCreatedToday);
        report.put("topGenre", topGenre);
        report.put("totalEvents", events.size());
        report.put("topActions", topActions);
        return report;
    }

    private List<Movie> readMovies() throws IOException {
        return mapper.readValue(new File(storageDir + "/movies.json"), new TypeReference<List<Movie>>() {});
    }

    private void writeMovies(List<Movie> movies) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(storageDir + "/movies.json"), movies);
    }

    private List<Review> readReviews() throws IOException {
        return mapper.readValue(new File(storageDir + "/reviews.json"), new TypeReference<List<Review>>() {});
    }

    private void writeReviews(List<Review> reviews) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(storageDir + "/reviews.json"), reviews);
    }

    private List<Watchlist> readWatchlists() throws IOException {
        return mapper.readValue(new File(storageDir + "/watchlists.json"), new TypeReference<List<Watchlist>>() {});
    }

    private void writeWatchlists(List<Watchlist> watchlists) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(storageDir + "/watchlists.json"), watchlists);
    }

    private List<UserFavorites> readFavorites() throws IOException {
        return mapper.readValue(new File(storageDir + "/favorites.json"), new TypeReference<List<UserFavorites>>() {});
    }

    private void writeFavorites(List<UserFavorites> favorites) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(storageDir + "/favorites.json"), favorites);
    }

    private List<AppUser> readUsers() throws IOException {
        return mapper.readValue(new File(storageDir + "/users.json"), new TypeReference<List<AppUser>>() {});
    }

    private void logActivity(String userId, String action, String entityType, String entityId) throws IOException {
        List<ActivityEvent> events = readActivity();
        ActivityEvent event = new ActivityEvent();
        event.setId(UUID.randomUUID().toString());
        event.setUserId(userId == null ? "unknown" : userId);
        event.setAction(action);
        event.setEntityType(entityType);
        event.setEntityId(entityId);
        event.setTimestamp(System.currentTimeMillis());
        events.add(event);
        writeActivity(events);
    }

    private List<ActivityEvent> readActivity() throws IOException {
        return mapper.readValue(new File(storageDir + "/activity.json"), new TypeReference<List<ActivityEvent>>() {});
    }

    private void writeActivity(List<ActivityEvent> events) throws IOException {
        mapper.writerWithDefaultPrettyPrinter().writeValue(new File(storageDir + "/activity.json"), events);
    }

    private boolean isToday(long timestamp) {
        long now = System.currentTimeMillis();
        long oneDayMillis = 24L * 60L * 60L * 1000L;
        return now - timestamp < oneDayMillis;
    }

    private String topGenreFromMovies(List<Movie> movies) {
        Map<String, Integer> genreCount = new HashMap<String, Integer>();
        for (Movie movie : movies) {
            if (movie.getGenres() == null) {
                continue;
            }
            for (String genre : movie.getGenres()) {
                if (genre == null || genre.trim().isEmpty()) {
                    continue;
                }
                Integer count = genreCount.get(genre);
                genreCount.put(genre, count == null ? 1 : count + 1);
            }
        }
        return genreCount.entrySet().stream()
                .max(Comparator.comparing(Map.Entry::getValue))
                .map(Map.Entry::getKey)
                .orElse("N/A");
    }
}
