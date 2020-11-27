import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { AuthProvider } from "contexts/auth";
import { CartProvider } from "contexts/cart";

import ActiveAccountPage from "containers/ActiveAccount";
import SignInPage from "containers/SignIn";
import SignUpPage from "containers/SignUp";

import CourseDetailPage from "domain/user/CourseDetail";
import MyCoursesPage from "domain/user/MyCourses";
import MyCourseDetailPage from "domain/user/MyCourseDetail";
import UserHomePage from "domain/user/HomePage";
import UserProfilePage from "domain/user/UserProfile";

import UserLayout from "layouts/UserLayout";

import AuthenticatedRoute from "routes/AuthenticatedRoute";
import PublicRoute from "routes/PublicRoute";
import AdminRoutes from "routes/AdminRoutes";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <PublicRoute exact path="/sign_in" component={SignInPage} />

          <PublicRoute exact path="/sign_up" component={SignUpPage} />

          <PublicRoute
            exact
            path="/active-account"
            component={ActiveAccountPage}
          />

          <Route path="/admin">
            <AdminRoutes />
          </Route>

          <CartProvider>
            <UserLayout>
              <Route exact path="/">
                <UserHomePage />
              </Route>

              <Route path="/courses/:courseId">
                <CourseDetailPage />
              </Route>

              <AuthenticatedRoute
                path="/user-profile"
                component={UserProfilePage}
              />

              <AuthenticatedRoute
                path="/my-courses"
                component={MyCoursesPage}
              />

              <AuthenticatedRoute
                path="/my-course-detail/:courseId"
                component={MyCourseDetailPage}
              />
            </UserLayout>
          </CartProvider>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
