package com.mainak.philia.repository;

import com.mainak.philia.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    @Query("SELECT u FROM User u WHERE LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    public List<User> searchUsersByKeyword(@Param("keyword") String keyword);
    public boolean existsByEmail(String email);
    public Optional<User> findByEmail(String email);
}
