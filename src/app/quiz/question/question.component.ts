import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../shared/services/quiz.service';
import { ActivatedRoute } from '@angular/router';

interface Answer {
  id: number;
  questionId: number;
  answerLabel: string;
  isCorrect: boolean;
}

interface QuestionWithAnswers {
  id: number;
  question: string;
  answers: Answer[];
}
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  quizContent: QuestionWithAnswers[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const categoryId = params['categoryId'];
      this.quizService.getQuizContent(categoryId).subscribe((questions) => {
        this.quizContent = questions;
      });
    });
  }
}
