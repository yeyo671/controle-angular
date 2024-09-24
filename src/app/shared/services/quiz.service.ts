import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeAll, switchMap } from 'rxjs/operators';

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

  getQuizContent(categoryId: string): Observable<QuestionWithAnswers[]> {
    return this.http
      .get<QuestionWithAnswers[]>(
        `http://localhost:3000/questions?categoryId=${categoryId}`
      )
      .pipe(
        switchMap((questions) => {
          const questionsWithAnswers$ = questions.map((question) =>
            this.http
              .get<Answer[]>(
                `http://localhost:3000/answers?questionId=${question.id}`
              )
              .pipe(
                map((answers) => ({
                  ...question,
                  answers,
                }))
              )
          );
          return forkJoin(questionsWithAnswers$);
        }),
        map((questionsWithAnswers) => {
          this.quizContent = questionsWithAnswers;
          return questionsWithAnswers;
        })
      );
  }

  resetQuiz() {
    this.quizContent = [];
    this.playerAnswers = [];
    this.score = 0;
    this.isQuizFinished = false;
  }
}
