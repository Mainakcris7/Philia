package com.mainak.philia.utils.mapper;

import com.mainak.philia.dto.comment.CommentCreateDto;
import com.mainak.philia.dto.comment.CommentDto;
import com.mainak.philia.dto.comment.CommentUpdateDto;
import com.mainak.philia.model.Comment;
import com.mainak.philia.model.Post;
import com.mainak.philia.model.User;

public class CommentMapper {
    public static Comment mapToCommentFromCommentCreateDto(CommentCreateDto dto, Post post, User user){
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(dto.getContent());

        user.getComments().add(comment);
        post.addComment(comment);
        return comment;
    }

    public static Comment updateCommentFromCommentUpdateDto(Comment comment, CommentUpdateDto dto){
        comment.setContent(dto.getContent());
        return comment;
    }

    public static CommentDto mapToCommentDto(Comment comment){
        CommentDto commentDto = new CommentDto();
        commentDto.setId(comment.getId());
        commentDto.setPostId(comment.getPost().getId());
        commentDto.setContent(comment.getContent());
        commentDto.setCommentLikesUrl(String.format("/comments/%d/likes", comment.getId()));
        commentDto.setLikesCount((long)comment.getLikes().size());
        commentDto.setCreatedAt(comment.getCreatedAt());
        commentDto.setUser(UserMapper.mapToUserDto(comment.getUser()));
        return commentDto;
    }
}
