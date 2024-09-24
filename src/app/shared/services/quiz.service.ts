import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  quizContent: QuestionWithAnswers[] = [];
  playerAnswers: { questionId: number; answer: string }[] = [];
  score = 0;
  isQuizFinished = false;
  playerName: string = '';

  constructor(private http: HttpClient) {}

  checkAnswers() {
    this.score = 0;
    for (let i = 0; i < this.playerAnswers.length; i++) {
      const question = this.quizContent.find(
        (q) => q.id === this.playerAnswers[i].questionId
      );
      if (!question) continue;
      for (let j = 0; j < question.answers.length; j++) {
        const currentAnswer = question.answers[j];
        if (
          currentAnswer.isCorrect &&
          this.playerAnswers[i].answer === currentAnswer.answerLabel
        ) {
          this.score += 1;
          break;
        }
      }
    }
    this.isQuizFinished = true;
  }

  addAnswer(answer: string, questionId: number) {
    const isAnswered = this.playerAnswers.find(
      (a) => a.questionId === questionId
    );
    if (isAnswered) {
      isAnswered.answer = answer;
      return;
    }
    this.playerAnswers.push({ questionId, answer });
  }

  getQuizContent(categoryId: string) {
    this.quizContent = []; // Reset the question list

    this.http
      .get<QuestionWithAnswers[]>(
        `http://localhost:3000/questions?categoryId=${categoryId}`
      )
      .subscribe((questions) => {
        const questionsWithAnswers: QuestionWithAnswers[] = [];

        for (const question of questions) {
          this.http
            .get<Answer[]>(
              `http://localhost:3000/answers?questionId=${question.id}`
            )
            .subscribe((answers) => {
              questionsWithAnswers.push({
                id: question.id,
                question: question.question,
                answers,
              });

              if (questionsWithAnswers.length === questions.length) {
                this.quizContent = questionsWithAnswers;
              }
            });
        }
      });
  }

  resetQuiz() {
    this.quizContent = [];
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
  }
}
