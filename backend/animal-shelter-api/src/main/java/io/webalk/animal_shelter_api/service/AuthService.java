package io.webalk.animal_shelter_api.service;

import io.webalk.animal_shelter_api.enums.Role;
import io.webalk.animal_shelter_api.model.User;
import io.webalk.animal_shelter_api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(password));

        userRepository.save(user);
    }

}
