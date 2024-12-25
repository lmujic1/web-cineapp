import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

import Home from './routes/home/Home';
import AboutUs from './routes/about/AboutUs';
import Tickets from './routes/tickets/Tickets';
import Layout from './components/Layout';
import CurrentlyShowing from './routes/movies/CurrentlyShowing';
import UpcomingMovies from './routes/movies/UpcomingMovies';
import AllVenues from './routes/venues/AllVenues';
import MovieDetails from './routes/movies/MovieDetails';
import Reservation from './routes/reservations/Reservation';
import RequireAuth from './routes/auth/RequireAuth';
import Unauthorized from './routes/unauthorized/Unauthorized';
import PaymentDetails from './routes/reservations/PaymentDetails';
import AdminPanel from './routes/admin/AdminPanel';
import Movies from './routes/admin/movies/Movies';
import Drafts from './routes/admin/movies/Drafts';
import Currently from './routes/admin/movies/Currently';
import AddMovie from './routes/admin/movies/AddMovie';
import Upcoming from './routes/admin/movies/Upcoming';
import Archived from './routes/admin/movies/Archived';
import Venues from './routes/admin/venues/Venues';
import AddVenue from './routes/admin/venues/AddVenue';
import VenueDetails from './routes/venues/VenueDetails';
import UserProfile from './routes/user/UserProfile';
import PersonalInformation from './routes/user/PersonalInformation';
import Password from './routes/user/Password';
import PendingReservations from './routes/user/PendingReservations';
import Projections from './routes/user/Projections';
import UpcomingProjections from './routes/user/UpcomingProjections';
import PastProjections from './routes/user/PastProjections';

import { ROLES } from './utils/constants';
import Users from './routes/admin/users/Users';
import AddAdmin from './routes/admin/users/AddAdmin';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Layout />}>

            <Route path='/' element={<Home />} />
            <Route path='/tickets' element={<Tickets />} />
            <Route path='/aboutus' element={<AboutUs />} />
            <Route path='/movie-details/:id' element={<MovieDetails />} />
            <Route path='/currently-showing' element={<CurrentlyShowing />} />
            <Route path='/upcoming-movies' element={<UpcomingMovies />} />
            <Route path='/venues' element={<AllVenues />} />
            <Route path='/venue-details/:id' element={<VenueDetails />} />
            <Route path='/unauthorized' element={<Unauthorized />} />


            <Route element={<RequireAuth allowedRoles={[ROLES.User, ROLES.Admin, ROLES.SuperAdmin]} />}>
              <Route path='/ticket' element={<Reservation />} />
              <Route path='/payment-details' element={<PaymentDetails />} />
              <Route path='/user-profile' element={<UserProfile />} >
                <Route path='info' element={<PersonalInformation />} />
                <Route path='password' element={<Password />} />
                <Route path='reservations' element={<PendingReservations />} />
                <Route path='projections' element={<Projections />}>
                  <Route index element={<Navigate to="upcoming" />} />
                  <Route path='upcoming' element={<UpcomingProjections />} />
                  <Route path='past' element={<PastProjections />} />
                </Route>
              </Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Admin, ROLES.SuperAdmin]} />}>
              <Route path='/admin-panel' element={<AdminPanel />}>
                <Route path='movies' element={<Movies />}>
                  <Route index element={<Navigate to="drafts" />} />
                  <Route path='drafts' element={<Drafts />} />
                  <Route path='currently' element={<Currently />} />
                  <Route path='upcoming' element={<Upcoming />} />
                  <Route path='archived' element={<Archived />} />
                </Route>
                <Route path='add-movie' element={<AddMovie />} />
                <Route path='add-venue' element={<AddVenue />} />
                <Route path='venues' element={<Venues />} />

              </Route>
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.SuperAdmin]} />}>
              <Route path='/admin-panel' element={<AdminPanel />}>
                <Route path='users' element={<Users />} />
                <Route path='add-admin' element={<AddAdmin />} />
              </Route>
            </Route>
          </Route>
      </Routes>
    </Router>
  );
};

export default App;
