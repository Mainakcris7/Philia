package com.mainak.philia.repository;

import com.mainak.philia.model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CommentRepository extends JpaRepository<Comment, Long> {
    public List<Comment> findAllByPostIdOrderByCreatedAtDesc(Long postId);
    public List<Comment> findAllByUserId(Long userId);
}

