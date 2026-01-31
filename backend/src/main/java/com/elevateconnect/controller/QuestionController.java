package com.elevateconnect.controller;

import com.elevateconnect.model.Question;
import com.elevateconnect.model.User;
import com.elevateconnect.repository.QuestionRepository;
import com.elevateconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    QuestionRepository questionRepository;

    @Autowired
    UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category) {

        if (company != null && !company.isEmpty() &&
                difficulty != null && !difficulty.isEmpty() &&
                category != null && !category.isEmpty()) {
            return ResponseEntity
                    .ok(questionRepository.findByCompanyContainingAndDifficultyContainingAndCategoryContaining(
                            company, difficulty, category));
        }

        // Simplified filtering logic for now - ideally use Criteria API or
        // Specification
        // If no filters, return all
        return ResponseEntity.ok(questionRepository.findAll());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<String>> getCompanies() {
        return ResponseEntity.ok(questionRepository.findDistinctCompanies());
    }

    @PostMapping("/{id}/helpful")
    public ResponseEntity<?> markHelpful(@PathVariable Long id) {
        return questionRepository.findById(id).map(q -> {
            q.setHelpfulCount(q.getHelpfulCount() + 1);
            questionRepository.save(q);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my")
    public ResponseEntity<List<Question>> getMyQuestions() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        return ResponseEntity.ok(questionRepository.findByUserId(user.getId()));
    }

    @PostMapping
    public ResponseEntity<Question> addQuestion(@RequestBody Question question) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();

        question.setUser(user);
        Question savedQuestion = questionRepository.save(question);
        return ResponseEntity.ok(savedQuestion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        questionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
