import "../assets/css/darkModal.css"; 
import PropTypes from "prop-types";

const FollowersModal = ({ title, users, onClose }) => {
  return (
    <div className="dark-modal-overlay" onClick={onClose}>
      <div className="dark-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="dark-modal-title">{title}</h2>
        <button className="dark-modal-close-btn" onClick={onClose}>×</button>
        <ul className="dark-user-list">
          {users.map((user) => (
            <li key={user.userId} className="dark-user-item">
              <img
                src={
                  user.userImage
                    ? `http://localhost:8080/SocialShe/api/users/files/${user.userImage}`
                    : "/images/profile.png"
                }
                alt={user.username}
                className="dark-user-avatar"
              />
              <span className="dark-user-name">{user.username}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ✅ Corrected PropTypes validation
FollowersModal.propTypes = {
  title: PropTypes.string.isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      username: PropTypes.string.isRequired,
      userImage: PropTypes.string,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default FollowersModal;
