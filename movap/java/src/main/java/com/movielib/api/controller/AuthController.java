package com.movielib.api.controller;

import com.movielib.api.dto.LoginRequest;
import com.movielib.api.dto.LoginResponse;
import com.movielib.api.model.AppUser;
import com.movielib.api.service.JsonStoreService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final JsonStoreService store;

    public AuthController(JsonStoreService store) {
        this.store = store;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) throws IOException {
        AppUser user = store.authenticate(request.getUsername(), request.getPassword());
        if (user == null) {
            Map<String, String> error = new HashMap<String, String>();
            error.put("message", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        LoginResponse response = new LoginResponse(user.getId(), user.getUsername(), user.getRole());
        return ResponseEntity.ok(response);
    }
}
