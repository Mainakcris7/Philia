package com.mainak.philia.repository;

import com.mainak.philia.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    public List<Post> findAllByOrderByCreatedAtDesc();
    public List<Post> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    public List<Post> findByCaptionContainingIgnoreCaseOrderByCreatedAtDesc(String keyword);
}
