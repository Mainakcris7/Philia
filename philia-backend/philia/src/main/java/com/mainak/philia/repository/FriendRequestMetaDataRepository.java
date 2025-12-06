package com.mainak.philia.repository;

import com.mainak.philia.model.FriendRequestMetaData;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FriendRequestMetaDataRepository extends JpaRepository<FriendRequestMetaData, Long> {
    public void deleteBySenderIdAndReceiverId(Long senderId, Long receiverId);
    public void deleteBySenderId(Long senderId);
    public void deleteByReceiverId(Long receiverId);
    public List<FriendRequestMetaData> findBySenderId(Long senderId);
    public List<FriendRequestMetaData> findByReceiverId(Long receiverId);
}
