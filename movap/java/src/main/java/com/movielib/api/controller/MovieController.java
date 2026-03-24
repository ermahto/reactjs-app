package com.movielib.api.controller;

import com.movielib.api.model.Movie;
import com.movielib.api.model.Review;
import com.movielib.api.model.Watchlist;
import com.movielib.api.service.JsonStoreService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class MovieController {

    private final JsonStoreService store;

    public MovieController(JsonStoreService store) {
        this.store = store;
    }

    @GetMapping("/movies")
    public List<Movie> searchMovies(@RequestParam(required = false) String title,
                                    @RequestParam(required = false) String genre,
                                    @RequestParam(required = false) String actor) throws IOException {
        return store.searchMovies(title, genre, actor);
    }

    @GetMapping("/favorites")
    public List<String> favorites(@RequestParam String userId) throws IOException {
        return store.getFavorites(userId);
    }

    @PostMapping("/favorites/{userId}/{movieId}")
    public List<String> addFavorite(@PathVariable String userId, @PathVariable String movieId) throws IOException {
        return store.addFavorite(userId, movieId);
    }

    @DeleteMapping("/favorites/{userId}/{movieId}")
    public List<String> removeFavorite(@PathVariable String userId, @PathVariable String movieId) throws IOException {
        return store.removeFavorite(userId, movieId);
    }

    @PostMapping("/reviews")
    public Review addReview(@RequestBody Review review) throws IOException {
        return store.addReview(review);
    }

    @GetMapping("/reviews/movie/{movieId}")
    public List<Review> movieReviews(@PathVariable String movieId) throws IOException {
        return store.approvedReviewsByMovie(movieId);
    }

    @GetMapping("/watchlists")
    public List<Watchlist> userWatchlists(@RequestParam String userId) throws IOException {
        return store.watchlists(userId);
    }

    @PostMapping("/watchlists")
    public Watchlist addWatchlist(@RequestBody Watchlist watchlist) throws IOException {
        return store.createWatchlist(watchlist);
    }

    @PutMapping("/watchlists/{id}")
    public ResponseEntity<Watchlist> editWatchlist(@PathVariable String id, @RequestBody Watchlist watchlist) throws IOException {
        Watchlist updated = store.updateWatchlist(id, watchlist);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/watchlists/{id}")
    public ResponseEntity<Void> deleteWatchlist(@PathVariable String id) throws IOException {
        return store.deleteWatchlist(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/admin/movies")
    public Movie addMovie(@RequestBody Movie movie) throws IOException {
        return store.addMovie(movie);
    }

    @PutMapping("/admin/movies/{id}")
    public ResponseEntity<Movie> editMovie(@PathVariable String id, @RequestBody Movie movie) throws IOException {
        Movie updated = store.updateMovie(id, movie);
        return updated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updated);
    }

    @DeleteMapping("/admin/movies/{id}")
    public ResponseEntity<Void> removeMovie(@PathVariable String id) throws IOException {
        return store.deleteMovie(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/admin/reviews/pending")
    public List<Review> pendingReviews() throws IOException {
        return store.pendingReviews();
    }

    @PutMapping("/admin/reviews/{id}/moderate")
    public ResponseEntity<Review> moderate(@PathVariable String id, @RequestBody Map<String, String> body) throws IOException {
        Review moderated = store.moderateReview(id, body.getOrDefault("status", "REJECTED"));
        return moderated == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(moderated);
    }

    @GetMapping("/admin/reports/activity")
    public Map<String, Object> activityReport() throws IOException {
        return store.activityReport();
    }
}
