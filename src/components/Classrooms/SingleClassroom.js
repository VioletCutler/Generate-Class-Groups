const SingleClassroom = ({ classroomInfo, instructors, students }) => {
  return (
    <div className="profile-classroom-section" key={classroomInfo.id}>
      <h4>{classroomInfo.name}</h4>
      <h5>Instructors:</h5>
      {instructors.map((instructor) => {
        return <p key={instructor.id}>{instructor.name}</p>;
      })}
    </div>
  );
};

export default SingleClassroom;
