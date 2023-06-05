import { Link } from 'react-router-dom'

const Profile = ({ loggedIn, setLoggedIn }) => {
  return (
    <div>
      {loggedIn ? (
        <div>
          <h2>Profile</h2>
          <div id="profile-navigation">
            <p>User Info</p>
            <p>Classrooms & Students</p>
            <p>Generate Groups</p>
          </div>
        </div>
      ) : (
        <p>
          Click <Link to="/account">HERE</Link> to login or register
        </p>
      )}
    </div>
  );
};

export default Profile;
