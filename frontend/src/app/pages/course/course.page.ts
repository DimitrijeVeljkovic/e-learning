import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ViewDidEnter } from '@ionic/angular';
import { combineLatest } from 'rxjs';
import { InProgressCourse } from 'src/app/interfaces/in-progress-course';
import { CourseService } from 'src/app/services/course.service';
import { ToastService } from 'src/app/services/toast.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements ViewDidEnter {
  public course: InProgressCourse | null = null;
  public selectedSegment: string = 'content';

  constructor(private _route: ActivatedRoute,
              private _userService: UserService,
              private _courseService: CourseService,
              private _toastService: ToastService,
              private _router: Router,
              public sanitizer: DomSanitizer) { }

  ionViewDidEnter() {
    combineLatest([
      this._route.params,
      this._userService.getInProgressCourses()
    ]).subscribe(([params, inProgress]) => {
      const courseId = params['courseId'];
      const inProgressCourses = inProgress.inProgressCourses;
      
      this.course = inProgressCourses.find(c => c.course._id === courseId)!;
    });
  }

  public handleSegmentChange(event: any) {
    this.selectedSegment = event.detail.value;
  }

  public addNote(form: NgForm) {
    this._userService.addNote(this.course?.course._id || '', form.value)
      .subscribe(res => {
        this.course?.notes.push(res.note);
        form.resetForm();
      });
  }

  public postComment(form: NgForm) {
    this._courseService.postComment({
      userName: this._userService.getAuthData().userName || '',
      comment: form.value.comment
    }, this.course?.course?._id || '')
      .subscribe(res => {
        if (this.course && this.course.course) {
          this.course.course.comments = res.comments;
        }
        form.resetForm();
      })
  }

  public handleSubmitTest(form: NgForm) {
    const test = form.value;
    const body = Object.keys(test).map(key => test[key]) as { question: string; answer: string; }[];
    
    this._userService.submitTest(this.course?.course._id || '', body)
      .subscribe(
        res => {
          this._courseService.inProgressCounter$.next(this._courseService.inProgressCounter$.getValue() - 1);
          this._courseService.completedCounter$.next(this._courseService.completedCounter$.getValue() + 1);
          this._toastService.showToast(`${res.message} Percentage: ${res.finishedCourse.percentage}%`, 'success');
          this._router.navigate(['/completed']);
        },
        err => {
          this._toastService.showToast(`${err.error.message} Percentage: ${err.error.percentCorrect}%`, 'danger');
          form.resetForm();
        }
      );
  }
}
