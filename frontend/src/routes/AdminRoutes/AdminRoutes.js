import { Switch } from "react-router-dom";

import AuthenticatedRoute from "routes/AuthenticatedRoute";

import { ListCourse, NewCourse, EditCourse } from "domain/admin/Courses";
import { ListExam, NewExam, EditExam } from "domain/admin/Exams";
import { ListLesson, NewLesson, EditLesson } from "domain/admin/Lessons";
import { ListRequest } from "domain/admin/Requests";
import { ListUser, NewUser, EditUser } from "domain/admin/Users";
import {
  ListCategory,
  NewCategory,
  EditCategory,
} from "domain/admin/Categories";
import {
  ListQuestion,
  NewQuestion,
  EditQuestion,
} from "domain/admin/Questions";
import { ListReview } from "domain/admin/Reviews";
import AdminHomePage from "domain/admin/HomePage";
import AdminLayout from "layouts/AdminLayout";

function App() {
  return (
    <Switch>
      <AdminLayout>
        <AuthenticatedRoute exact path="/admin" component={AdminHomePage} />

        <AuthenticatedRoute
          exact
          path="/admin/requests"
          component={ListRequest}
        />

        <AuthenticatedRoute
          exact
          path="/admin/categories"
          component={ListCategory}
        />
        <AuthenticatedRoute
          exact
          path="/admin/categories/new"
          component={NewCategory}
        />
        <AuthenticatedRoute
          exact
          path="/admin/categories/:categoryId/edit"
          component={EditCategory}
        />

        <AuthenticatedRoute
          exact
          path="/admin/lessons"
          component={ListLesson}
        />
        <AuthenticatedRoute
          exact
          path="/admin/lessons/new"
          component={NewLesson}
        />
        <AuthenticatedRoute
          exact
          path="/admin/lessons/:lessonId/edit"
          component={EditLesson}
        />

        <AuthenticatedRoute
          exact
          path="/admin/courses"
          component={ListCourse}
        />
        <AuthenticatedRoute
          exact
          path="/admin/courses/new"
          component={NewCourse}
        />
        <AuthenticatedRoute
          exact
          path="/admin/courses/:courseId/edit"
          component={EditCourse}
        />

        <AuthenticatedRoute
          exact
          path="/admin/questions"
          component={ListQuestion}
        />
        <AuthenticatedRoute
          exact
          path="/admin/questions/new"
          component={NewQuestion}
        />
        <AuthenticatedRoute
          exact
          path="/admin/questions/:questionId/edit"
          component={EditQuestion}
        />

        <AuthenticatedRoute exact path="/admin/exams" component={ListExam} />
        <AuthenticatedRoute exact path="/admin/exams/new" component={NewExam} />
        <AuthenticatedRoute
          exact
          path="/admin/exams/:examId/edit"
          component={EditExam}
        />

        <AuthenticatedRoute
          exact
          path="/admin/reviews"
          component={ListReview}
        />

        <AuthenticatedRoute exact path="/admin/users" component={ListUser} />
        <AuthenticatedRoute exact path="/admin/users/new" component={NewUser} />
        <AuthenticatedRoute
          exact
          path="/admin/users/:userId/edit"
          component={EditUser}
        />
      </AdminLayout>
    </Switch>
  );
}

export default App;
