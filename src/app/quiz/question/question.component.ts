import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../shared/services/quiz.service';

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

  constructor(private quizService: QuizService) {}

  ngOnInit(): void {
    this.quizContent = this.quizService.quizContent;
  }
}
