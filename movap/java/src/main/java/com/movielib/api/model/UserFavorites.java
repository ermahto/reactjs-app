package com.movielib.api.model;

import java.util.ArrayList;
import java.util.List;

public class UserFavorites {
    private String userId;
    private List<String> movieIds = new ArrayList<String>();

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public List<String> getMovieIds() { return movieIds; }
    public void setMovieIds(List<String> movieIds) { this.movieIds = movieIds; }
}
