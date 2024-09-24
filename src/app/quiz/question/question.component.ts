import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../shared/services/quiz.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  quizContent: any[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const categoryId = params['categoryId'];

      // Subscribe to the observable returned by getQuizContent()
      this.quizService.getQuizContent(categoryId).subscribe((questions) => {
        this.quizContent = questions;
      });
    });
  }
}
