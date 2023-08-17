import { Component, OnInit } from '@angular/core';
import { State } from 'src/app/enums/state';
import { Course } from 'src/app/interfaces/course';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.page.html',
  styleUrls: ['./bookmarks.page.scss'],
})
export class BookmarksPage implements OnInit {
  public bookmarkedCourses: Course[] = [];
  public state: State = State.BOOKMARKED;

  constructor(private _userService: UserService) { }

  ngOnInit() {
    this._userService.getBookmarkedCourses().subscribe(res => {
      this.bookmarkedCourses = res.bookmarkedCourses;
    });
  }

}
