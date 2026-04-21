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

    @Autowired
    private com.elevateconnect.service.NotificationService notificationService;

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
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long userId = user.getId();

        return questionRepository.findById(java.util.Objects.requireNonNull(id)).map(q -> {
            if (q.getUser().getId().equals(userId)) {
                return ResponseEntity.badRequest().body("You cannot like your own question");
            }
            if (q.getLikedByUsers().contains(userId)) {
                q.getLikedByUsers().remove(userId);
                q.setHelpfulCount(Math.max(0, q.getHelpfulCount() - 1));
            } else {
                q.getLikedByUsers().add(userId);
                q.setHelpfulCount(q.getHelpfulCount() + 1);
            }
            questionRepository.save(q);
            return ResponseEntity.ok(q);
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

        notificationService.notifyAllStudents(
                "New Interview Question: " + (user.getName() != null ? user.getName() : "Alumni")
                        + " shared a question for " + savedQuestion.getCompany(),
                "INFO");

        return ResponseEntity.ok(savedQuestion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long id) {
        if (!questionRepository.existsById(java.util.Objects.requireNonNull(id))) {
            return ResponseEntity.notFound().build();
        }
        questionRepository.deleteById(java.util.Objects.requireNonNull(id));
        return ResponseEntity.ok().build();
    }
}
