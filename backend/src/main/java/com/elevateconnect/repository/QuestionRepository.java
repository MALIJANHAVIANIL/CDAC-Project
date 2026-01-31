package com.elevateconnect.repository;

import com.elevateconnect.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByUserId(Long userId);

    @Query("SELECT DISTINCT q.company FROM Question q")
    List<String> findDistinctCompanies();

    List<Question> findByCompanyContainingAndDifficultyContainingAndCategoryContaining(
            String company, String difficulty, String category);
}
